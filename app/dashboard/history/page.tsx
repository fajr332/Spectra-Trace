"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { ActivityLog, LeakDetection } from "@/lib/types"
import CryptoJS from "crypto-js"
import { motion, AnimatePresence } from "framer-motion" // مكتبة الحركات الفخمة

export default function HistoryPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [detections, setDetections] = useState<LeakDetection[]>([])
  const [verifying, setVerifying] = useState(false)
  const [chainStatus, setChainStatus] = useState<"idle" | "valid" | "tampered">("idle")

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: logsData } = await supabase.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(50)
    setLogs(logsData || [])

    const { data: detectionsData } = await supabase.from("leak_detections").select(`*, employee:employees(name, email)`).order("detected_at", { ascending: false }).limit(20)
    setDetections(detectionsData || [])
  }

  const verifyBlockchain = async () => {
    setVerifying(true)
    setChainStatus("idle")
    
    const { data } = await supabase.from("activity_logs").select("*").order("created_at", { ascending: true })
      
    if (!data || data.length === 0) {
      setChainStatus("valid")
      setVerifying(false)
      return
    }

    let isValid = true
    let expectedPreviousHash = '0000000000000000000000000000000000000000000000000000000000000000'

    for (const log of data) {
      if (log.previous_hash !== expectedPreviousHash) { isValid = false; break; }
      const dataToHash = log.previous_hash + log.user_id + log.action_type + (log.description || '') + log.created_at;
      const recalculatedHash = CryptoJS.SHA256(dataToHash).toString(CryptoJS.enc.Hex);
      if (recalculatedHash !== log.current_hash) { isValid = false; break; }
      expectedPreviousHash = log.current_hash
    }

    setTimeout(() => {
      setChainStatus(isValid ? "valid" : "tampered")
      setVerifying(false)
    }, 2000)
  }

  return (
    <div className="p-4" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold italic">Spectra Trace Ledger</h1>
          <p className="text-muted-foreground mt-1">نظام التوثيق الجنائي المحمي بالبلوكتشين</p>
        </div>
        
        {/* زر الفحص مع أنيميشن النبض */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={verifyBlockchain}
          disabled={verifying}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg disabled:opacity-50"
        >
          {verifying ? (
            <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
              جارٍ فحص السلسلة...
            </motion.span>
          ) : "التحقق من النزاهة (Verify)"}
        </motion.button>
      </div>

      {/* أنيميشن ظهور النتيجة (الضربة القاضية) */}
      <AnimatePresence>
        {chainStatus !== "idle" && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0 }}
            className={`p-6 rounded-3xl mb-8 border-4 flex items-center gap-6 shadow-2xl ${
              chainStatus === "valid" ? "bg-green-50 border-green-500 text-green-700" : "bg-red-50 border-red-500 text-red-700"
            }`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${chainStatus === "valid" ? "bg-green-200" : "bg-red-200"}`}>
              {chainStatus === "valid" ? "✅" : "🚨"}
            </div>
            <div>
              <h3 className="font-black text-2xl">{chainStatus === "valid" ? "السلسلة سليمة 100%" : "تنبيه: تلاعب في البيانات!"}</h3>
              <p className="font-medium text-lg italic">
                {chainStatus === "valid" ? "تم التحقق من تطابق جميع الهاشات بنجاح." : "تم كشف كسر في التشفير! السجلات معدلة."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-2 gap-8 text-right">
        {/* سجل النشاطات مع أنيميشن ظهور القائمة */}
        <motion.div layout className="bg-card rounded-3xl border border-border p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6 border-b pb-2">سجل العمليات (Immutable)</h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {logs.map((log, index) => (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                key={log.id}
                className="p-4 bg-secondary/20 rounded-2xl border border-border/50"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-primary">{log.action_type}</span>
                  <span className="text-[10px] text-muted-foreground">{new Date(log.created_at).toLocaleString("ar-SA")}</span>
                </div>
                <p className="text-sm mb-3">{log.description}</p>
                <div className="bg-black/5 p-2 rounded-lg font-mono text-[9px] break-all opacity-70">
                  HASH: {log.current_hash}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* التسريبات المكتشفة */}
        <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-red-600 border-b pb-2">رصد التسريبات</h2>
          <div className="space-y-4">
            {detections.map((detection) => (
              <div key={detection.id} className="bg-red-50 p-4 rounded-2xl border border-red-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-red-700">{detection.employee?.name || "غير معروف"}</p>
                  <p className="text-xs text-red-600/70">{detection.leaked_filename}</p>
                </div>
                <div className="bg-red-600 text-white px-3 py-1 rounded-full font-black text-sm">
                  {detection.confidence_score}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}