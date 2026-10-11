"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Employee } from "@/lib/types"
import { useLang } from "@/lib/language-context"

export default function EmployeesPage() {
  const { t, isRTL } = useLang()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", department: "", employee_number: "" })

  const supabase = createClient()
  const fontBody = isRTL ? "var(--font-cairo)" : "var(--font-montserrat)"

  useEffect(() => { fetchEmployees() }, [])

  const fetchEmployees = async () => {
    setLoading(true)
    const { data } = await supabase.from("employees").select("*").order("created_at", { ascending: false })
    setEmployees(data || [])
    setLoading(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdding(true)

    const { error: insertError } = await supabase.from("employees").insert({
      name: form.name,
      email: form.email,
      department: form.department || null,
      employee_number: form.employee_number || null,
    })

    if (insertError) {
      alert(insertError.message)
      setAdding(false)
      return
    }

    // ✅ سجل النشاط بالإنجليزي دائماً
    await supabase.from("activity_logs").insert({
      action_type: "Add Employee",
      description: form.name,
    })

    setForm({ name: "", email: "", department: "", employee_number: "" })
    setShowForm(false)
    await fetchEmployees()
    setAdding(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`${t("emp.confirmDelete")}: ${name}؟`)) return
    const { error } = await supabase.from("employees").delete().eq("id", id)
    if (error) alert(error.message)
    else fetchEmployees()
  }

  const inputStyle = {
    backgroundColor: "#0C2E47",
    color: "#f5f5f0",
    border: "1px solid rgba(146,161,168,0.4)",
    borderRadius: "12px",
    fontFamily: fontBody,
  }

  const primaryBtn = {
    backgroundColor: "#f5f5f0",
    color: "#011627",
    boxShadow: "0 0 25px rgba(245,245,240,0.4)",
    fontFamily: fontBody,
    fontWeight: 600,
  }

  return (
    <div className="min-h-screen p-4" dir={isRTL ? "rtl" : "ltr"}
      style={{ fontFamily: fontBody, color: "#f5f5f0" }}>

      {/* ✅ ثابت RTL: العنوان يمين، الزر يسار */}
      <div dir="rtl" className="flex items-center justify-between mb-10 border-b pb-6"
        style={{ borderColor: "rgba(0,212,255,0.15)" }}>
        <div dir={isRTL ? "rtl" : "ltr"} className={isRTL ? "text-right" : "text-left"}>
          <h1 className="text-4xl font-light tracking-tight" style={{ color: "#f5f5f0" }}>
            {t("emp.title")}
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#92A1A8" }}>{t("emp.subtitle")}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-7 py-3 transition-all hover:scale-105 active:scale-95"
          style={{ ...primaryBtn, borderRadius: "9999px" }}
        >
          {showForm ? t("emp.cancel") : t("emp.add")}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd}
          className="p-8 rounded-3xl mb-10 backdrop-blur-md animate-in fade-in slide-in-from-top-4"
          style={{
            backgroundColor: "rgba(2,43,72,0.5)",
            border: "1px solid rgba(0,212,255,0.15)",
          }}>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest" style={{ color: "#92A1A8" }}>
                {t("emp.fullName")}
              </label>
              <input type="text" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-5 py-3.5 focus:outline-none transition-all"
                style={inputStyle}
                required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest" style={{ color: "#92A1A8" }}>
                {t("emp.email")}
              </label>
              <input type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-5 py-3.5 focus:outline-none transition-all"
                style={inputStyle}
                required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest" style={{ color: "#92A1A8" }}>
                {t("emp.department")}
              </label>
              <input type="text" value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="w-full px-5 py-3.5 focus:outline-none transition-all"
                style={inputStyle} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest" style={{ color: "#92A1A8" }}>
                {t("emp.empNumber")}
              </label>
              <input type="text" value={form.employee_number}
                onChange={(e) => setForm({ ...form, employee_number: e.target.value })}
                className="w-full px-5 py-3.5 focus:outline-none transition-all"
                style={inputStyle} />
            </div>
          </div>
          <button type="submit" disabled={adding}
            className="w-full py-4 transition-all disabled:opacity-50 hover:scale-[1.01]"
            style={{ ...primaryBtn, borderRadius: "9999px" }}>
            {adding ? t("emp.saving") : t("emp.confirm")}
          </button>
        </form>
      )}

      <div className="rounded-3xl overflow-hidden backdrop-blur-md"
        style={{
          backgroundColor: "rgba(2,43,72,0.5)",
          border: "1px solid rgba(0,212,255,0.15)",
        }}>
        {loading ? (
          <div className="p-20 text-center font-light animate-pulse" style={{ color: "#92A1A8" }}>
            {t("emp.loading")}
          </div>
        ) : employees.length === 0 ? (
          <div className="p-20 text-center italic" style={{ color: "#92A1A8" }}>
            {t("emp.noEmployees")}
          </div>
        ) : (
          <table className={`w-full ${isRTL ? "text-right" : "text-left"} border-collapse`}>
            <thead style={{ backgroundColor: "rgba(0,212,255,0.05)" }}>
              <tr>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest" style={{ color: "#92A1A8" }}>
                  {t("emp.colName")}
                </th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest" style={{ color: "#92A1A8" }}>
                  {t("emp.colDept")}
                </th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest" style={{ color: "#92A1A8" }}>
                  {t("emp.colNumber")}
                </th>
                <th className={`px-8 py-5 text-xs font-bold uppercase tracking-widest ${isRTL ? "text-left" : "text-right"}`}
                  style={{ color: "#92A1A8" }}>
                  {t("emp.colActions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}
                  className="transition-colors group border-t"
                  style={{ borderColor: "rgba(0,212,255,0.1)" }}>
                  <td className="px-8 py-5 font-light" style={{ color: "#f5f5f0" }}>{emp.name}</td>
                  <td className="px-8 py-5" style={{ color: "#92A1A8" }}>{emp.department || t("emp.uncategorized")}</td>
                  <td className="px-8 py-5 font-mono" style={{ color: "#92A1A8" }}>{emp.employee_number || "N/A"}</td>
                  <td className={`px-8 py-5 ${isRTL ? "text-left" : "text-right"}`}>
                    <button onClick={() => handleDelete(emp.id, emp.name)}
                      className="p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      style={{ color: "#92A1A8" }}>
                      {t("emp.delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}