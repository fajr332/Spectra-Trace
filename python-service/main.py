from fastapi import FastAPI, UploadFile, File, HTTPException
from PIL import Image
import numpy as np
import cv2
import io

app = FastAPI(title="Spectra-Trace OCR Engine")

def enhance_image_for_ocr(img: Image.Image) -> Image.Image:
    """
    تحسين الصورة قبل OCR: تكبير + رمادي + تنعيم
    يساعد على دقة قراءة النصوص من السكرين شوت
    """
    img_array = np.array(img)
    
    if len(img_array.shape) == 3:
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
    else:
        gray = img_array
    
    # تكبير الصور الصغيرة
    h, w = gray.shape
    if w < 1500:
        scale = 1500 / w
        new_w = int(w * scale)
        new_h = int(h * scale)
        gray = cv2.resize(gray, (new_w, new_h), interpolation=cv2.INTER_CUBIC)
    
    # تنعيم بسيط
    gray = cv2.GaussianBlur(gray, (3, 3), 0)
    
    return Image.fromarray(gray)


@app.post("/ocr")
async def ocr_extract(file: UploadFile = File(...)):
    """
    يستخرج النص من صورة باستخدام OCR
    مع تحسينات قبل المعالجة لزيادة الدقة
    يدعم الإنجليزي والعربي
    """
    try:
        import pytesseract
        
        pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        
        file_bytes = await file.read()
        img = Image.open(io.BytesIO(file_bytes))
        
        # تحسين الصورة قبل OCR
        enhanced = enhance_image_for_ocr(img)
        
        # PSM 6 = Single uniform block of text (أفضل للسكرين شوت)
        config = '--psm 6 --oem 3'
        text = pytesseract.image_to_string(enhanced, lang='eng+ara', config=config)
        
        sample = text.strip()[:200]
        print(f"📝 OCR extracted ({len(text)} chars): {sample}")
        
        return {"text": text.strip()}
    except Exception as e:
        print(f"❌ OCR error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health():
    return {"status": "ok", "engine": "Spectra-Trace OCR Engine"}


