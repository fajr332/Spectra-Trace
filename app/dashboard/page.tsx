"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useLang } from "@/lib/language-context"

export default function DashboardPage() {
  const { t, isRTL, lang } = useLang()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ docs: 0, emps: 0, leaks: 0 })
  const [logs, setLogs] = useState<any[]>([])

  const fontBody = isRTL ? "var(--font-cairo)" : "var(--font-montserrat)"

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const [docsRes, empsRes, leaksRes, logsRes] = await Promise.all([
        supabase.from("protected_documents").select("*", { count: "exact", head: true }),
        supabase.from("employees").select("*", { count: "exact", head: true }),
        supabase.from("leak_detections").select("*", { count: "exact", head: true }),
        supabase.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(5),
      ])

      setStats({
        docs: docsRes.count || 0,
        emps: empsRes.count || 0,
        leaks: leaksRes.count || 0,
      })
      setLogs(logsRes.data || [])
    }
    fetchData()
  }, [])

  return (
    <div dir={isRTL ? "rtl" : "ltr"} style={{ fontFamily: fontBody, color: "#FDFFFC" }}>
      <div className="mb-8">
        <h1 className="text-3xl font-light" style={{ color: "#FDFFFC" }}>
          {t("dashboard.welcome")}، {user?.user_metadata?.full_name || t("dashboard.user")}
        </h1>
      </div>

      <div dir="rtl" className="grid md:grid-cols-3 gap-6 mb-10">
        {/* Card 1 */}
        <div className="p-6 rounded-2xl backdrop-blur-md"
          style={{
            backgroundColor: "rgba(2,43,72,0.5)",
            border: "1px solid rgba(0,212,255,0.15)",
          }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)" }}>
              <svg className="w-7 h-7" fill="none" stroke="#00D4FF" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-light" style={{ color: "#FDFFFC" }}>{stats.docs}</p>
              <p style={{ color: "#92A1A8" }}>{t("dashboard.protectedDocs")}</p>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-6 rounded-2xl backdrop-blur-md"
          style={{
            backgroundColor: "rgba(2,43,72,0.5)",
            border: "1px solid rgba(0,212,255,0.15)",
          }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)" }}>
              <svg className="w-7 h-7" fill="none" stroke="#00D4FF" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-light" style={{ color: "#FDFFFC" }}>{stats.emps}</p>
              <p style={{ color: "#92A1A8" }}>{t("dashboard.employees")}</p>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-6 rounded-2xl backdrop-blur-md"
          style={{
            backgroundColor: "rgba(2,43,72,0.5)",
            border: "1px solid rgba(0,212,255,0.15)",
          }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)" }}>
              <svg className="w-7 h-7" fill="none" stroke="#00D4FF" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-light" style={{ color: "#FDFFFC" }}>{stats.leaks}</p>
              <p style={{ color: "#92A1A8" }}>{t("dashboard.leaks")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-6 backdrop-blur-md"
        style={{
          backgroundColor: "rgba(2,43,72,0.5)",
          border: "1px solid rgba(0,212,255,0.15)",
        }}>
        <h2 className="text-xl font-light mb-6" style={{ color: "#FDFFFC" }}>
          {t("dashboard.recentActivity")}
        </h2>
        {logs.length > 0 ? (
          <ul className="space-y-4">
            {logs.map((log) => (
              <li key={log.id}
                className="flex items-center justify-between py-3 border-b last:border-0"
                style={{ borderColor: "rgba(0,212,255,0.1)" }}>
                <div>
                  <p className="font-light" style={{ color: "#FDFFFC" }}>{log.action_type}</p>
                  <p className="text-sm" style={{ color: "#92A1A8" }}>{log.description}</p>
                </div>
                <span className="text-sm" style={{ color: "#92A1A8" }}>
                  {new Date(log.created_at).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-8" style={{ color: "#92A1A8" }}>
            {t("dashboard.noActivity")}
          </p>
        )}
      </div>
    </div>
  )
}