"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function AdvancedPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[] | null>(null)

  const handleAnalyze = async () => {
    if (!file) return
    setLoading(true)
    const formData = new FormData(); formData.append("file", file)
    try {
      const res = await fetch("http://localhost:5000/api/resilience/analyze", { method: "POST", body: formData })
      const data = await res.json(); setResults(data.analysis)
    } catch { alert("تأكدي من تشغيل سيرفر البايثون!") }
    setLoading(false)
  }

  return (
    <div className="p-8 text-right" dir="rtl">
      <h1 className="text-3xl font-bold mb-8">اختبار صمود البصمة (DWT + OpenCV)</h1>
      <div className="bg-card p-10 rounded-3xl border-2 border-dashed border-border text-center mb-10">
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mb-4 block mx-auto" />
        <button onClick={handleAnalyze} disabled={loading} className="px-8 py-3 bg-primary text-white rounded-2xl font-bold">
          {loading ? "جارٍ التحليل الرياضي..." : "بدء فحص الصمود"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatePresence>
          {results?.map((res, i) => (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} key={i} className="p-6 bg-secondary/30 rounded-2xl border border-border">
              <h3 className="font-bold text-lg mb-2">{res.attack_type}</h3>
              <p className={res.extracted ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                {res.extracted ? "✅ صمدت البصمة" : "❌ فشل الاستخراج"}
              </p>
              <div className="mt-4 bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full" style={{ width: `${res.confidence_score}%` }} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}