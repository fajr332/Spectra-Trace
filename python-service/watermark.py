import cv2
import numpy as np
import pywt
import hashlib

ALPHA = 8.0
WAVELET = 'haar'
STANDARD_SIZE = (1024, 768)


def generate_pn_sequence(employee_id: str, length: int) -> np.ndarray:
    seed_hex = hashlib.sha256(employee_id.encode()).hexdigest()[:16]
    seed = int(seed_hex, 16) % (2**31)
    rng = np.random.default_rng(seed)
    return rng.choice([-1.0, 1.0], size=length)


def detect_document_boundary(image: np.ndarray):
    # 1. تحويل لرمادي وتقليل التشويش
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) if len(image.shape) == 3 else image.copy()
    blurred = cv2.GaussianBlur(gray, (5, 5), 0) # قللنا الـ Blur عشان ما تضيع حواف الورقة البعيدة

    # 2. القناص (Canny Edge Detection) - أقوى بمراحل من الـ Threshold العادي
    edges = cv2.Canny(blurred, 50, 150)

    # 3. تضخيم الحواف عشان تتصل الخطوط المقطعة لو الإضاءة سيئة
    kernel = np.ones((5, 5), np.uint8)
    dilated = cv2.dilate(edges, kernel, iterations=2)

    # 4. استخراج الخطوط المحيطة (Contours)
    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if not contours:
        return None

    # 5. ترتيب الأشكال حسب المساحة (نأخذ أكبر 5 أشكال وندور على الورقة بينهم)
    contours = sorted(contours, key=cv2.contourArea, reverse=True)[:5]

    for contour in contours:
        epsilon = 0.02 * cv2.arcLength(contour, True)
        approx = cv2.approxPolyDP(contour, epsilon, True)

        # إذا لقينا شكل له 4 زوايا (ورقة)
        if len(approx) == 4:
            pts = approx.reshape(4, 2).astype(np.float32)

            # ترتيب الزوايا (فوق يسار، فوق يمين، تحت يمين، تحت يسار)
            rect = np.zeros((4, 2), dtype=np.float32)
            s = pts.sum(axis=1)
            diff = np.diff(pts, axis=1)
            
            rect[0] = pts[np.argmin(s)]      # Top-Left
            rect[2] = pts[np.argmax(s)]      # Bottom-Right
            rect[1] = pts[np.argmin(diff)]   # Top-Right
            rect[3] = pts[np.argmax(diff)]   # Bottom-Left

            # حساب العرض والطول الحقيقي للورقة المكتشفة
            width = int(max(np.linalg.norm(rect[1] - rect[0]), np.linalg.norm(rect[2] - rect[3])))
            height = int(max(np.linalg.norm(rect[3] - rect[0]), np.linalg.norm(rect[2] - rect[1])))

            # إذا الشكل المربع صغير جداً (مجرد نويز)، نتجاهله
            if width < 100 or height < 100:
                continue

            # فرد الورقة (Perspective Transform) عشان تصير مستقيمة 100%
            dst = np.array([
                [0, 0], [width - 1, 0],
                [width - 1, height - 1], [0, height - 1]
            ], dtype=np.float32)
            
            M = cv2.getPerspectiveTransform(rect, dst)
            return cv2.warpPerspective(image, M, (width, height))

    # إذا ما لقى ورقة نهائياً
    return None


def preprocess(image: np.ndarray) -> np.ndarray:
    img = cv2.resize(image, STANDARD_SIZE)
    if len(img.shape) == 3:
        yuv = cv2.cvtColor(img, cv2.COLOR_BGR2YUV)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        yuv[:, :, 0] = clahe.apply(yuv[:, :, 0])
        img = cv2.cvtColor(yuv, cv2.COLOR_YUV2BGR)
    return img


def get_luminance(image: np.ndarray) -> np.ndarray:
    if len(image.shape) == 3:
        yuv = cv2.cvtColor(image, cv2.COLOR_BGR2YUV).astype(np.float64)
        return yuv[:, :, 0]
    return image.astype(np.float64)


def embed_spread_spectrum(image: np.ndarray, employee_id: str) -> np.ndarray:
    img = preprocess(image)
    channel = get_luminance(img)

    coeffs2 = pywt.dwt2(channel, WAVELET)
    cA, (cH, cV, cD) = coeffs2

    flat_cH = cH.flatten()
    flat_cV = cV.flatten()

    pn_H = generate_pn_sequence(employee_id + "_H", len(flat_cH))
    pn_V = generate_pn_sequence(employee_id + "_V", len(flat_cV))

    flat_cH_wm = flat_cH + ALPHA * pn_H
    flat_cV_wm = flat_cV + ALPHA * pn_V

    new_coeffs = (cA, (flat_cH_wm.reshape(cH.shape), flat_cV_wm.reshape(cV.shape), cD))
    wm_channel = pywt.idwt2(new_coeffs, WAVELET)
    wm_channel = wm_channel[:channel.shape[0], :channel.shape[1]]

    if len(img.shape) == 3:
        yuv = cv2.cvtColor(img, cv2.COLOR_BGR2YUV).astype(np.float64)
        yuv[:, :, 0] = np.clip(wm_channel, 0, 255)
        return cv2.cvtColor(yuv.astype(np.uint8), cv2.COLOR_YUV2BGR)
    return np.clip(wm_channel, 0, 255).astype(np.uint8)


def detect_spread_spectrum(image: np.ndarray, all_employee_ids: list) -> tuple:
    img = preprocess(image)
    channel = get_luminance(img)

    coeffs2 = pywt.dwt2(channel, WAVELET)
    _, (cH, cV, _) = coeffs2

    flat_cH = cH.flatten()
    flat_cV = cV.flatten()

    cH_norm = (flat_cH - np.mean(flat_cH)) / (np.std(flat_cH) + 1e-8)
    cV_norm = (flat_cV - np.mean(flat_cV)) / (np.std(flat_cV) + 1e-8)

    scores = {}
    for emp_id in all_employee_ids:
        pn_H = generate_pn_sequence(emp_id + "_H", len(flat_cH))
        pn_V = generate_pn_sequence(emp_id + "_V", len(flat_cV))
        score_H = float(np.dot(cH_norm, pn_H) / len(flat_cH))
        score_V = float(np.dot(cV_norm, pn_V) / len(flat_cV))
        scores[emp_id] = (score_H + score_V) / 2.0

    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    best_id, best_score = sorted_scores[0]
    second_score = sorted_scores[1][1] if len(sorted_scores) > 1 else 0.0
    gap = best_score - second_score

    print(f"[DEBUG] أفضل: {best_score:.6f} | ثاني: {second_score:.6f} | فرق: {gap:.6f}")

    # رفعنا معايير الثقة عشان النظام يرفض يعطي اسم عشوائي لو الصورة غير صالحة أبداً
    THRESHOLD = 0.0006
    GAP_THRESHOLD = 0.0003

    if best_score >= THRESHOLD and gap >= GAP_THRESHOLD:
        confidence = min(99.0, (gap / GAP_THRESHOLD) * 20)
        return best_id, round(min(confidence, 99.0), 1)

    return None, 0.0


class RobustWatermarking:

    def embed(self, image_array: np.ndarray, employee_id: str) -> np.ndarray:
        return embed_spread_spectrum(image_array, employee_id)

    def detect(self, image_array: np.ndarray, all_employee_ids: list) -> tuple:
        rectified = detect_document_boundary(image_array)
        img = rectified if rectified is not None else image_array
        print(f"[DEBUG] المنظور: {'صُحِّح بدقة' if rectified is not None else 'فشل التصحيح (استخدام الصورة كاملة)'}")
        return detect_spread_spectrum(img, all_employee_ids)