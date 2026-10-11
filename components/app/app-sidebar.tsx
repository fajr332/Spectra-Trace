"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import LogoutButton from "./logout-button"
import { useLang } from "@/lib/language-context"

export function AppSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { t, isRTL } = useLang()

  const fontBody = isRTL ? "var(--font-cairo)" : "var(--font-montserrat)"
  const fontLogo = "var(--font-michroma)"

  const navigation = [
    { name: t("nav.dashboard"), href: "/dashboard" },
    { name: t("nav.employees"), href: "/dashboard/employees" },
    { name: t("nav.encrypt"), href: "/dashboard/encrypt" },
    { name: t("nav.detect"), href: "/dashboard/detect" },
  ]

  return (
    <>
      {/* زر الفتح — دائماً يمين الشاشة */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed top-1/2 right-0 rounded-l-xl border-r-0 -translate-y-1/2 z-40 py-5 px-3 flex items-center justify-center shadow-2xl transition-all duration-500 ${
          open ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{
          backgroundColor: "#0C2E47",
          border: "1px solid rgba(0,212,255,0.15)",
          fontFamily: fontBody,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* ✅ الدرج: يدخل من اليمين، ينسحب ببطء نحو اليسار حتى يستقر */}
      <div
        className={`fixed top-0 h-full w-72 border-l shadow-2xl z-50 flex flex-col backdrop-blur-md ${
          open ? "right-0" : "right-[-288px]"
        }`}
        style={{
          backgroundColor: "rgba(1,22,39,0.95)",
          borderColor: "rgba(0,212,255,0.15)",
          fontFamily: fontBody,
          transitionProperty: "right",
          transitionDuration: "1100ms",
          transitionTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
      >
        {/* رأس الدرج — X يسار + Spectra/Trace يمين بعيد عنه */}
        <div dir="ltr" className="px-6 py-6 flex items-start justify-between border-b"
          style={{ borderColor: "rgba(0,212,255,0.15)" }}>

          {/* X مع مربع شفاف عند hover */}
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg transition-all duration-200 hover:bg-white/10"
            style={{ color: "#92A1A8" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Spectra فوق, Trace تحت — بالوسط أفقياً ضمن النصف الأيمن */}
          <div className="flex flex-col items-center leading-tight">
            <span
              className="text-lg tracking-widest"
              style={{
                color: "#f5f5f0",
                fontFamily: fontLogo,
                textShadow: "0 0 20px rgba(0,212,255,0.5)",
                letterSpacing: "0.15em",
              }}
            >
              SPECTRA
            </span>
            <span
              className="text-lg tracking-widest mt-1"
              style={{
                color: "#f5f5f0",
                fontFamily: fontLogo,
                textShadow: "0 0 20px rgba(0,212,255,0.5)",
                letterSpacing: "0.15em",
              }}
            >
              TRACE
            </span>
          </div>
        </div>

        <nav dir={isRTL ? "rtl" : "ltr"} className="flex-1 p-4 space-y-2 mt-2 overflow-y-auto">
          {navigation.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-3.5 rounded-xl text-sm transition-all duration-200"
                style={{
                  backgroundColor: active ? "rgba(0,212,255,0.1)" : "transparent",
                  color: active ? "#f5f5f0" : "#92A1A8",
                  border: active ? "1px solid rgba(0,212,255,0.3)" : "1px solid transparent",
                  fontFamily: fontBody,
                  fontWeight: active ? 600 : 400,
                  boxShadow: active ? "0 0 15px rgba(0,212,255,0.15)" : "none",
                }}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: "rgba(0,212,255,0.15)" }}>
          <LogoutButton />
        </div>
      </div>
    </>
  )
}