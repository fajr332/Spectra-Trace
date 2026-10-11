"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Employee } from "@/lib/types"
import { FileText, Upload, Check, Download } from "lucide-react"
import { useLang } from "@/lib/language-context"

export default function EncryptPage() {
  const { t, isRTL } = useLang()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<string>("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [result, setResult] = useState<{ name: string; url: string } | null>(null)

  const supabase = createClient()
  const fontBody = isRTL ? "var(--font-cairo)" : "var(--font-montserrat)"

  useEffect(() => { fetchEmployees() }, [])

  const fetchEmployees = async () => {
    const { data } = await supabase.from("employees").select("*").order("name")
    setEmployees(data || [])
  }

  const downloadFile = (url: string, name: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleEncrypt = async () => {
    if (!file || !selectedEmployee) return
    setLoading(true)
    setSuccess(false)
    setResult(null)

    try {
      const res = await fetch("/api/encrypt", {
        method: "POST",
        headers: {
          "X-Employee-ID": selectedEmployee,
          "X-File-Name": encodeURIComponent(file.name),
        },
        body: file,
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || `Error: ${res.status}`)
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const empName = employees.find((e) => e.id === selectedEmployee)?.name || "Employee"

      setResult({
        name: `protected_${empName}_${file.name}`,
        url: url,
      })
      setSuccess(true)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const cardStyle = {
    backgroundColor: "rgba(2,43,72,0.5)",
    border: "1px solid rgba(0,212,255,0.15)",
  }

  const primaryBtn = {
    backgroundColor: "#f5f5f0",
    color: "#011627",
    boxShadow: "0 0 25px rgba(245,245,240,0.4)",
    fontFamily: fontBody,
    fontWeight: 600,
  }

  if (success && result) {
    return (
      <div className={isRTL ? "text-right" : "text-left"} dir={isRTL ? "rtl" : "ltr"}
        style={{ fontFamily: fontBody, color: "#f5f5f0" }}>
        <div className="mb-8">
          <h1 className="text-3xl font-light">{t("enc.title")}</h1>
        </div>
        <div className="p-8 rounded-2xl text-center max-w-2xl mx-auto backdrop-blur-md" style={cardStyle}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{
              backgroundColor: "rgba(0,212,255,0.1)",
              border: "1px solid rgba(0,212,255,0.3)",
              boxShadow: "0 0 20px rgba(0,212,255,0.3)",
            }}>
            <Check className="w-10 h-10" strokeWidth={2.5} style={{ color: "#00D4FF" }} />
          </div>
          <h2 className="text-2xl font-light mb-2" style={{ color: "#f5f5f0" }}>{t("enc.success")}</h2>
          <p className="mb-6 italic font-light" style={{ color: "#92A1A8" }}>
            {t("enc.copiesGenerated")} 1 {t("enc.copies")}
          </p>
          <div className="mb-6">
            <button
              onClick={() => downloadFile(result.url, result.name)}
              className="w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all"
              style={{
                backgroundColor: "#0C2E47",
                border: "1px solid rgba(0,212,255,0.15)",
                color: "#f5f5f0",
              }}>
              <span className="font-light flex items-center gap-2">
                <FileText className="w-4 h-4" style={{ color: "#00D4FF" }} />
                {result.name}
              </span>
              <span className="font-bold text-sm flex items-center gap-1" style={{ color: "#00D4FF" }}>
                <Download className="w-4 h-4" /> {t("enc.download")}
              </span>
            </button>
          </div>
          <button
            onClick={() => {
              setSuccess(false)
              setFile(null)
              setSelectedEmployee("")
              setResult(null)
            }}
            className="px-8 py-3 transition-all hover:scale-105 active:scale-95"
            style={{ ...primaryBtn, borderRadius: "9999px" }}
          >
            {t("enc.encryptAnother")}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={isRTL ? "text-right" : "text-left"} dir={isRTL ? "rtl" : "ltr"}
      style={{ fontFamily: fontBody, color: "#f5f5f0" }}>
      <div className="mb-8">
        <h1 className="text-3xl font-light">{t("enc.title")}</h1>
        <p className="mt-1" style={{ color: "#92A1A8" }}>{t("enc.subtitle")}</p>
      </div>

      {/* ✅ thabit RTL — yemeen yarfa3 al-malaf, yasaar al-mostalimeen */}
      <div dir="rtl" className="grid lg:grid-cols-2 gap-8">
        {/* Upload — يمين */}
        <div dir={isRTL ? "rtl" : "ltr"} className={`${isRTL ? "text-right" : "text-left"} p-6 rounded-2xl backdrop-blur-md`} style={cardStyle}>
          <h2 className="text-xl font-light mb-4">{t("enc.upload")}</h2>
          <label className="block border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all"
            style={{
              borderColor: "rgba(146,161,168,0.4)",
              backgroundColor: "rgba(12,46,71,0.3)",
            }}>
            <input
              type="file"
              accept=".pdf,.docx,.xlsx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            {file ? (
              <div>
                <FileText className="w-16 h-16 mx-auto mb-3" style={{ color: "#00D4FF" }} />
                <p className="font-light text-lg" style={{ color: "#f5f5f0" }}>{file.name}</p>
                <p className="text-sm mt-1" style={{ color: "#92A1A8" }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div>
                <Upload className="w-16 h-16 mx-auto mb-4" style={{ color: "#92A1A8" }} />
                <p className="font-light text-lg mb-2" style={{ color: "#f5f5f0" }}>{t("enc.dragOrSelect")}</p>
                <div className="flex justify-center gap-2 mt-3">
                  {["PDF", "Word", "Excel"].map((label) => (
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
        </div>

        {/* Recipients — يسار */}
        <div dir={isRTL ? "rtl" : "ltr"} className={`${isRTL ? "text-right" : "text-left"} p-6 rounded-2xl backdrop-blur-md`} style={cardStyle}>
          <h2 className="text-xl font-light mb-4">{t("enc.recipients")}</h2>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {employees.map((emp) => (
              <label key={emp.id}
                className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all"
                style={{
                  backgroundColor: selectedEmployee === emp.id
                    ? "rgba(0,212,255,0.1)"
                    : "#0C2E47",
                  border: selectedEmployee === emp.id
                    ? "1px solid rgba(0,212,255,0.3)"
                    : "1px solid transparent",
                }}>
                <input
                  type="radio"
                  name="employee"
                  checked={selectedEmployee === emp.id}
                  onChange={() => setSelectedEmployee(emp.id)}
                  className="w-5 h-5"
                  style={{ accentColor: "#00D4FF" }}
                />
                <div>
                  <p className="font-light" style={{ color: "#f5f5f0" }}>{emp.name}</p>
                  <p className="text-xs" style={{ color: "#92A1A8" }}>{emp.email}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleEncrypt}
        disabled={!file || !selectedEmployee || loading}
        className="mt-8 w-full py-5 disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-[0.99]"
        style={{ ...primaryBtn, borderRadius: "9999px", fontSize: "1.25rem" }}
      >
        {loading
          ? `${t("enc.encrypting")}...`
          : t("enc.encryptBtn")
        }
      </button>
    </div>
  )
}