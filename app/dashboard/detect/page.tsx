"use client"

import { useState } from "react"
import {
  FileSearch, Upload, AlertTriangle, User, CheckCircle,
  ShieldAlert, ShieldCheck, Clock, FileText, Wifi, Link, Camera
} from "lucide-react"
import { useLang } from "@/lib/language-context"

export default function DetectPage() {
  const { t, lang, isRTL } = useLang()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const fontBody = isRTL ? "var(--font-cairo)" : "var(--font-montserrat)"

  const handleDetect = async () => {
    if (!file) return
    setLoading(true)
    setResult(null)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/detect", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Server error")
      setResult(data)
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return t("det.notSpecified")
    return new Date(dateStr).toLocaleString(lang === "ar" ? "ar-SA" : "en-US", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    })
  }

  const getFileIcon = (name: string) => {
    const ext = name?.split('.').pop()?.toLowerCase()
    if (ext === 'pdf') return <FileSearch className="w-16 h-16 mx-auto mb-4" style={{ color: "#00D4FF" }} />
    if (['jpg', 'jpeg', 'png'].includes(ext || '')) return <Camera className="w-16 h-16 mx-auto mb-4" style={{ color: "#00D4FF" }} />
    return <FileSearch className="w-16 h-16 mx-auto mb-4" style={{ color: "#00D4FF" }} />
  }

  const cardStyle = {
    backgroundColor: "rgba(2,43,72,0.5)",
    border: "1px solid rgba(0,212,255,0.15)",
  }

  const innerCardStyle = {
    backgroundColor: "rgba(1,22,39,0.5)",
    border: "1px solid rgba(0,212,255,0.1)",
  }

  return (
    <>
      {/* ✅ CSS الطباعة — يخفي الواجهة الكحلية ويُظهر التقرير الرسمي */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 20mm 18mm;
          }

          body * {
            visibility: hidden !important;
          }

          #forensic-print-report,
          #forensic-print-report * {
            visibility: visible !important;
          }

          #forensic-print-report {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            color: black !important;
            font-family: "Times New Roman", Georgia, serif !important;
          }

          /* إخفاء كل شيء آخر */
          .no-print {
            display: none !important;
          }
        }

        /* التقرير الرسمي مخفي على الشاشة، يظهر فقط عند الطباعة */
        #forensic-print-report {
          display: none;
        }

        @media print {
          #forensic-print-report {
            display: block !important;
          }
        }
      `}</style>

      <div className={`space-y-6 no-print ${isRTL ? "text-right" : "text-left"}`}
        dir={isRTL ? "rtl" : "ltr"}
        style={{ fontFamily: fontBody, color: "#f5f5f0" }}>

        <div>
          <h2 className="text-2xl font-light" style={{ color: "#f5f5f0" }}>{t("det.title")}</h2>
          <p style={{ color: "#92A1A8" }}>{t("det.subtitle")}</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <div className="p-8 rounded-2xl backdrop-blur-md" style={cardStyle}>
            <label className="block border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all group"
              style={{
                borderColor: "rgba(146,161,168,0.4)",
                backgroundColor: "rgba(12,46,71,0.3)",
              }}>
              <input
                type="file"
                accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              {file ? (
                <div>
                  {getFileIcon(file.name)}
                  <p className="font-light text-lg" style={{ color: "#f5f5f0" }}>{file.name}</p>
                  <p className="text-sm" style={{ color: "#92A1A8" }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div>
                  <Upload className="w-16 h-16 mx-auto mb-4" style={{ color: "#92A1A8" }} />
                  <p className="text-lg font-light" style={{ color: "#f5f5f0" }}>{t("det.upload")}</p>
                  <div className="flex justify-center gap-2 mt-3 flex-wrap">
                    {["PDF", "Word", "Excel", "JPG", "PNG"].map((label) => (
                      <span key={label} className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: "rgba(0,212,255,0.1)",
                          color: "#00D4FF",
                          border: "1px solid rgba(0,212,255,0.3)",
                        }}>
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </label>

            <button
              onClick={handleDetect}
              disabled={!file || loading}
              className="w-full mt-6 py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-95"
              style={{
                backgroundColor: "#f5f5f0",
                color: "#011627",
                boxShadow: "0 0 25px rgba(245,245,240,0.4)",
                fontFamily: fontBody,
                fontWeight: 600,
              }}
            >
              {loading ? t("det.analyze") : <><FileSearch className="w-5 h-5" /> {t("det.detectBtn")}</>}
            </button>
          </div>

          {result && (
            <div className="p-8 rounded-2xl backdrop-blur-md animate-in fade-in zoom-in duration-300" style={cardStyle}>
              {result.found ? (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    {result.is_image_leak || result.is_modified ? (
                      <AlertTriangle className="w-16 h-16 mx-auto mb-4" style={{ color: "#00D4FF" }} />
                    ) : (
                      <ShieldCheck className="w-16 h-16 mx-auto mb-4" style={{ color: "#00D4FF" }} />
                    )}
                    <h3 className="text-2xl font-light" style={{ color: "#f5f5f0" }}>
                      {result.is_image_leak || result.is_modified
                        ? t("det.breachDetected")
                        : t("det.documentVerified")}
                    </h3>
                    <p style={{ color: "#92A1A8" }}>{t("det.confidence")}: {result.confidence}%</p>
                  </div>

                  <div className="p-5 rounded-xl" style={innerCardStyle}>
                    <p className="text-xs mb-3 font-bold uppercase tracking-widest" style={{ color: "#92A1A8" }}>
                      {result.is_image_leak || result.is_modified ? t("det.identifiedLeaker") : t("det.documentRecipient")}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full"
                        style={{
                          backgroundColor: "rgba(0,212,255,0.1)",
                          border: "1px solid rgba(0,212,255,0.3)",
                        }}>
                        <User className="w-6 h-6" style={{ color: "#00D4FF" }} />
                      </div>
                      <div>
                        <p className="font-light text-xl" style={{ color: "#f5f5f0" }}>{result.leaker?.name}</p>
                        <p style={{ color: "#92A1A8" }}>{result.leaker?.email}</p>
                        <p className="text-sm" style={{ color: "#92A1A8" }}>
                          {t("det.department")}: {result.leaker?.department || t("det.notSpecified")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl space-y-3" style={innerCardStyle}>
                    <p className="text-xs mb-3 font-bold uppercase tracking-widest" style={{ color: "#92A1A8" }}>
                      {t("det.documentDetails")}
                    </p>
                    {[
                      { icon: FileText, label: t("det.filename"), value: result.document?.filename },
                      { icon: Clock, label: t("det.encryptionDate"), value: formatDate(result.document?.created_at) },
                      { icon: Clock, label: t("det.distributionDate"), value: formatDate(result.document?.distributed_at) },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <item.icon className="w-4 h-4 shrink-0" style={{ color: "#00D4FF" }} />
                        <span style={{ color: "#92A1A8" }}>{item.label}:</span>
                        <span className="font-light" style={{ color: "#f5f5f0" }}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 rounded-xl space-y-3" style={innerCardStyle}>
                    <p className="text-xs mb-3 font-bold uppercase tracking-widest" style={{ color: "#92A1A8" }}>
                      {t("det.forensicEvidence")}
                    </p>
                    <div className="flex items-center gap-3 text-sm">
                      <User className="w-4 h-4 shrink-0" style={{ color: "#00D4FF" }} />
                      <span style={{ color: "#92A1A8" }}>{t("det.empName")}:</span>
                      <span className="font-light" style={{ color: "#f5f5f0" }}>{result.leaker?.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <User className="w-4 h-4 shrink-0" style={{ color: "#00D4FF" }} />
                      <span style={{ color: "#92A1A8" }}>{t("det.empNumber")}:</span>
                      <span className="font-mono font-light" style={{ color: "#f5f5f0" }}>
                        {result.leaker?.employee_number || t("det.notSpecified")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <User className="w-4 h-4 shrink-0" style={{ color: "#00D4FF" }} />
                      <span style={{ color: "#92A1A8" }}>{t("det.email")}:</span>
                      <span className="font-mono font-light" style={{ color: "#f5f5f0" }}>{result.leaker?.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Wifi className="w-4 h-4 shrink-0" style={{ color: "#00D4FF" }} />
                      <span style={{ color: "#92A1A8" }}>{t("det.ipAddress")}:</span>
                      <span className="font-mono font-light" style={{ color: "#f5f5f0" }}>{result.forensics?.ip_address}</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <Link className="w-4 h-4 shrink-0 mt-1" style={{ color: "#00D4FF" }} />
                      <div className="flex-1">
                        <span style={{ color: "#92A1A8" }}>{t("det.incidentHash")}:</span>
                        <p className="font-mono text-xs break-all mt-1 p-2 rounded"
                          style={{
                            color: "#f5f5f0",
                            backgroundColor: "rgba(1,22,39,0.5)",
                            border: "1px solid rgba(0,212,255,0.1)",
                          }}>
                          {result.forensics?.incident_hash}
                        </p>
                      </div>
                    </div>
                    {result.forensics?.bitcoin_proof && (
                      <div className="mt-2 p-3 rounded-lg"
                        style={{
                          backgroundColor: "rgba(0,212,255,0.05)",
                          border: "1px solid rgba(0,212,255,0.2)",
                        }}>
                        <p className="text-xs leading-relaxed" style={{ color: "#92A1A8" }}>
                          {t("det.legalEvidence")}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 p-5 rounded-xl" style={innerCardStyle}>
                    {result.is_image_leak ? (
                      <>
                        <ShieldAlert className="w-8 h-8 shrink-0" style={{ color: "#00D4FF" }} />
                        <div>
                          <p className="font-light text-lg" style={{ color: "#f5f5f0" }}>{t("det.documentLeaked")}</p>
                          <p className="text-sm" style={{ color: "#92A1A8" }}>{t("det.photographedCopy")}</p>
                        </div>
                      </>
                    ) : result.is_modified ? (
                      <>
                        <ShieldAlert className="w-8 h-8 shrink-0" style={{ color: "#00D4FF" }} />
                        <div>
                          <p className="font-light text-lg" style={{ color: "#f5f5f0" }}>{t("det.fileTampered")}</p>
                          <p className="text-sm" style={{ color: "#92A1A8" }}>{t("det.contentAltered")}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-8 h-8 shrink-0" style={{ color: "#00D4FF" }} />
                        <div>
                          <p className="font-light text-lg" style={{ color: "#f5f5f0" }}>{t("det.intactOriginal")}</p>
                          <p className="text-sm" style={{ color: "#92A1A8" }}>{t("det.notModified")}</p>
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="w-full py-3 rounded-xl transition-all hover:scale-[1.01]"
                    style={{
                      backgroundColor: "#f5f5f0",
                      color: "#011627",
                      boxShadow: "0 0 15px rgba(245,245,240,0.3)",
                      fontFamily: fontBody,
                      fontWeight: 600,
                    }}
                  >
                    {t("det.printReport")}
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: "#00D4FF" }} />
                  <h3 className="text-2xl font-light" style={{ color: "#f5f5f0" }}>{t("det.noFingerprints")}</h3>
                  <p style={{ color: "#92A1A8" }}>{t("det.notRegistered")}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* تقرير الطباعة الرسمي — صفحة A4 واحدة */}
      {/* ═══════════════════════════════════════════════════════ */}
      {result && result.found && (
        <div id="forensic-print-report" dir={isRTL ? "rtl" : "ltr"}
          style={{
            background: "white",
            color: "black",
            fontFamily: '"Times New Roman", Georgia, serif',
            padding: "0",
            lineHeight: "1.4",
          }}>

          {/* ─── رأس التقرير ─── */}
          <div style={{
            borderBottom: "3px double black",
            paddingBottom: "10px",
            marginBottom: "14px",
            textAlign: "center",
          }}>
            <h1 style={{
              fontSize: "20px",
              fontWeight: "bold",
              margin: "0 0 4px 0",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}>
              SPECTRA TRACE
            </h1>
            <p style={{ fontSize: "11px", margin: "0 0 2px 0", fontStyle: "italic" }}>
              {isRTL ? "نظام التحقيق الجنائي الرقمي" : "Digital Forensic Investigation System"}
            </p>
            <p style={{ fontSize: "13px", fontWeight: "bold", marginTop: "8px", letterSpacing: "1px" }}>
              {isRTL ? "تقرير جنائي رسمي" : "OFFICIAL FORENSIC REPORT"}
            </p>
          </div>

          {/* ─── معلومات التقرير ─── */}
          <table style={{ width: "100%", marginBottom: "12px", fontSize: "10px" }}>
            <tbody>
              <tr>
                <td style={{ padding: "2px 0", fontWeight: "bold" }}>
                  {isRTL ? "تاريخ الإصدار:" : "Report Date:"}
                </td>
                <td style={{ padding: "2px 0", textAlign: isRTL ? "left" : "right" }}>
                  {new Date().toLocaleString(lang === "ar" ? "ar-SA" : "en-US")}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "2px 0", fontWeight: "bold" }}>
                  {isRTL ? "رقم الحادثة:" : "Incident ID:"}
                </td>
                <td style={{ padding: "2px 0", textAlign: isRTL ? "left" : "right", fontFamily: "Courier, monospace", fontSize: "9px" }}>
                  {result.forensics?.incident_hash?.substring(0, 16).toUpperCase()}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "2px 0", fontWeight: "bold" }}>
                  {isRTL ? "نسبة الثقة:" : "Confidence Level:"}
                </td>
                <td style={{ padding: "2px 0", textAlign: isRTL ? "left" : "right" }}>
                  {result.confidence}%
                </td>
              </tr>
            </tbody>
          </table>

          {/* ─── الملخص التنفيذي ─── */}
          <div style={{ marginBottom: "12px" }}>
            <h2 style={{
              fontSize: "11px",
              fontWeight: "bold",
              borderBottom: "1px solid black",
              paddingBottom: "3px",
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}>
              {isRTL ? "الملخص التنفيذي" : "Executive Summary"}
            </h2>
            <p style={{ fontSize: "11px", margin: 0, textAlign: "justify", lineHeight: "1.5" }}>
              {result.is_image_leak
                ? (isRTL
                  ? "أكدّ التحليل الجنائي اكتشاف نسخة مسرّبة من الوثيقة المحمية خارج نطاق التوزيع المصرّح به. تم تحديد هوية المُسرِّب بنجاح من خلال آليات البصمة الرقمية."
                  : "Forensic analysis confirms the detection of a leaked copy of the protected document outside its authorized distribution boundary. The identity of the leaker has been successfully determined through digital fingerprinting mechanisms.")
                : result.is_modified
                  ? (isRTL
                    ? "أكدّ التحليل الجنائي وجود تلاعب بمحتوى الوثيقة بعد توزيعها. تم تحديد هوية المُسرِّب وحفظ الأدلة الجنائية الرقمية كاملة."
                    : "Forensic analysis confirms tampering with the document content after distribution. The leaker's identity has been determined and full digital forensic evidence has been preserved.")
                  : (isRTL
                    ? "تم التحقق من سلامة الوثيقة وتطابقها مع النسخة الأصلية المحفوظة. لم يُكتشف أي تلاعب بالمحتوى."
                    : "Document integrity verified and confirmed to match the stored original. No content tampering detected.")
              }
            </p>
          </div>

          {/* ─── معلومات المُسرِّب ─── */}
          <div style={{ marginBottom: "12px" }}>
            <h2 style={{
              fontSize: "11px",
              fontWeight: "bold",
              borderBottom: "1px solid black",
              paddingBottom: "3px",
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}>
              {result.is_image_leak || result.is_modified
                ? (isRTL ? "هوية المُسرِّب" : "Identified Subject")
                : (isRTL ? "مستلم الوثيقة" : "Document Recipient")
              }
            </h2>
            <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse" }}>
              <tbody>
                <tr style={{ borderBottom: "1px dotted #888" }}>
                  <td style={{ padding: "4px 0", fontWeight: "bold", width: "40%" }}>
                    {isRTL ? "الاسم الكامل" : "Full Name"}
                  </td>
                  <td style={{ padding: "4px 0" }}>{result.leaker?.name}</td>
                </tr>
                <tr style={{ borderBottom: "1px dotted #888" }}>
                  <td style={{ padding: "4px 0", fontWeight: "bold" }}>
                    {isRTL ? "الرقم الوظيفي" : "Employee ID"}
                  </td>
                  <td style={{ padding: "4px 0", fontFamily: "Courier, monospace" }}>
                    {result.leaker?.employee_number || "—"}
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px dotted #888" }}>
                  <td style={{ padding: "4px 0", fontWeight: "bold" }}>
                    {isRTL ? "البريد الإلكتروني" : "Email Address"}
                  </td>
                  <td style={{ padding: "4px 0", fontFamily: "Courier, monospace" }}>
                    {result.leaker?.email}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 0", fontWeight: "bold" }}>
                    {isRTL ? "القسم" : "Department"}
                  </td>
                  <td style={{ padding: "4px 0" }}>
                    {result.leaker?.department || "—"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ─── معلومات الوثيقة ─── */}
          <div style={{ marginBottom: "12px" }}>
            <h2 style={{
              fontSize: "11px",
              fontWeight: "bold",
              borderBottom: "1px solid black",
              paddingBottom: "3px",
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}>
              {isRTL ? "تفاصيل الوثيقة" : "Document Information"}
            </h2>
            <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse" }}>
              <tbody>
                <tr style={{ borderBottom: "1px dotted #888" }}>
                  <td style={{ padding: "4px 0", fontWeight: "bold", width: "40%" }}>
                    {isRTL ? "اسم الملف" : "Filename"}
                  </td>
                  <td style={{ padding: "4px 0", fontFamily: "Courier, monospace" }}>
                    {result.document?.filename}
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px dotted #888" }}>
                  <td style={{ padding: "4px 0", fontWeight: "bold" }}>
                    {isRTL ? "تاريخ التشفير" : "Encryption Date"}
                  </td>
                  <td style={{ padding: "4px 0" }}>{formatDate(result.document?.created_at)}</td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 0", fontWeight: "bold" }}>
                    {isRTL ? "تاريخ التوزيع" : "Distribution Date"}
                  </td>
                  <td style={{ padding: "4px 0" }}>{formatDate(result.document?.distributed_at)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ─── الأدلة الجنائية ─── */}
          <div style={{ marginBottom: "12px" }}>
            <h2 style={{
              fontSize: "11px",
              fontWeight: "bold",
              borderBottom: "1px solid black",
              paddingBottom: "3px",
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}>
              {isRTL ? "الأدلة الجنائية الرقمية" : "Digital Forensic Evidence"}
            </h2>
            <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse" }}>
              <tbody>
                <tr style={{ borderBottom: "1px dotted #888" }}>
                  <td style={{ padding: "4px 0", fontWeight: "bold", width: "40%" }}>
                    {isRTL ? "عنوان IP" : "IP Address"}
                  </td>
                  <td style={{ padding: "4px 0", fontFamily: "Courier, monospace" }}>
                    {result.forensics?.ip_address}
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px dotted #888" }}>
                  <td style={{ padding: "4px 0", fontWeight: "bold", verticalAlign: "top" }}>
                    {isRTL ? "هاش الحادثة" : "Incident Hash"}
                  </td>
                  <td style={{
                    padding: "4px 0",
                    fontFamily: "Courier, monospace",
                    fontSize: "9px",
                    wordBreak: "break-all",
                  }}>
                    {result.forensics?.incident_hash}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 0", fontWeight: "bold" }}>
                    {isRTL ? "حالة الوثيقة" : "Document Status"}
                  </td>
                  <td style={{ padding: "4px 0", fontWeight: "bold" }}>
                    {result.is_image_leak
                      ? (isRTL ? "وثيقة مسرّبة" : "LEAKED")
                      : result.is_modified
                        ? (isRTL ? "تم التلاعب بها" : "TAMPERED")
                        : (isRTL ? "سليمة وأصلية" : "INTACT")
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ─── الإفادة القانونية ─── */}
          <div style={{
            marginTop: "12px",
            padding: "10px 12px",
            border: "2px solid black",
            fontSize: "9px",
            lineHeight: "1.5",
          }}>
            <p style={{ margin: 0, fontWeight: "bold", marginBottom: "4px" }}>
              {isRTL ? "إفادة قانونية:" : "LEGAL STATEMENT:"}
            </p>
            <p style={{ margin: 0, textAlign: "justify" }}>
              {isRTL
                ? "هذا التقرير صادر آلياً من نظام Spectra Trace للتحقيق الجنائي الرقمي. جميع البيانات الواردة فيه تم استخراجها من خلال خوارزميات تحليل قطعية ومُوثَّقة بطابع زمني غير قابل للتعديل أو الحذف. يُعتبر هذا التقرير دليلاً جنائياً معتمداً صالحاً للاستخدام القانوني."
                : "This report is automatically generated by the Spectra Trace Digital Forensic Investigation System. All data contained herein has been extracted through deterministic analytical algorithms and certified with an immutable timestamp that cannot be modified or deleted. This report constitutes accredited forensic evidence valid for legal use."
              }
            </p>
          </div>

          {/* ─── التوقيع ─── */}
          <div style={{
            marginTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "10px",
          }}>
            <div style={{ width: "40%" }}>
              <div style={{ borderTop: "1px solid black", paddingTop: "4px", textAlign: "center" }}>
                {isRTL ? "توقيع المحقق" : "Investigator Signature"}
              </div>
            </div>
            <div style={{ width: "40%" }}>
              <div style={{ borderTop: "1px solid black", paddingTop: "4px", textAlign: "center" }}>
                {isRTL ? "ختم النظام" : "System Stamp"}
              </div>
            </div>
          </div>

          {/* ─── التذييل ─── */}
          <div style={{
            marginTop: "16px",
            paddingTop: "8px",
            borderTop: "1px solid black",
            textAlign: "center",
            fontSize: "9px",
            fontStyle: "italic",
          }}>
            <p style={{ margin: 0 }}>
              {isRTL
                ? "© 2026 Spectra Trace — جميع الحقوق محفوظة"
                : "© 2026 Spectra Trace — All Rights Reserved"
              }
            </p>
            <p style={{ margin: "2px 0 0 0" }}>
              {isRTL
                ? "نهاية التقرير الجنائي"
                : "— End of Forensic Report —"
              }
            </p>
          </div>
        </div>
      )}
    </>
  )
}