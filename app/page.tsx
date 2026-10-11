"use client"

import { useState } from "react"
import Link from "next/link"
import { useLang } from "@/lib/language-context"

export default function HomePage() {
  const [loading, setLoading] = useState(false)
  const { lang, setLang, t, isRTL } = useLang()

  const handleInstantAccess = async () => {
    setLoading(true)
    window.location.href = "/dashboard"
  }

  const fontBody = isRTL ? "var(--font-cairo)" : "var(--font-montserrat)"
  const fontLogo = "var(--font-michroma)"

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
      style={{ backgroundColor: "#011627", fontFamily: fontBody }}
    >
      {/* الخلفية المائية */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-30 animate-blob-1"
          style={{ background: "radial-gradient(circle, rgba(0,212,255,0.4) 0%, transparent 70%)" }} />
        <div className="absolute top-[40%] right-[-15%] w-[600px] h-[600px] rounded-full opacity-25 animate-blob-2"
          style={{ background: "radial-gradient(circle, rgba(0,212,255,0.5) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-15%] left-[20%] w-[550px] h-[550px] rounded-full opacity-30 animate-blob-3"
          style={{ background: "radial-gradient(circle, rgba(12,46,71,0.8) 0%, transparent 70%)" }} />
        <div className="absolute top-[20%] left-[40%] w-[400px] h-[400px] rounded-full opacity-20 animate-blob-4"
          style={{ background: "radial-gradient(circle, rgba(0,212,255,0.3) 0%, transparent 70%)" }} />
        <div className="absolute top-[60%] left-[5%] w-[350px] h-[350px] rounded-full opacity-25 animate-blob-5"
          style={{ background: "radial-gradient(circle, rgba(2,43,72,0.7) 0%, transparent 70%)" }} />
      </div>

      <style jsx>{`
        @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1) rotate(0deg)} 25%{transform:translate(80px,50px) scale(1.15) rotate(45deg)} 50%{transform:translate(-50px,100px) scale(0.9) rotate(90deg)} 75%{transform:translate(60px,-30px) scale(1.1) rotate(135deg)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1) rotate(0deg)} 25%{transform:translate(-70px,80px) scale(1.1) rotate(-45deg)} 50%{transform:translate(90px,-60px) scale(0.85) rotate(-90deg)} 75%{transform:translate(-40px,-80px) scale(1.2) rotate(-135deg)} }
        @keyframes blob3 { 0%,100%{transform:translate(0,0) scale(1) rotate(0deg)} 25%{transform:translate(60px,-50px) scale(1.12) rotate(60deg)} 50%{transform:translate(-80px,40px) scale(1.05) rotate(120deg)} 75%{transform:translate(50px,70px) scale(0.95) rotate(180deg)} }
        @keyframes blob4 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-50px,60px) scale(1.2)} 66%{transform:translate(70px,-40px) scale(0.9)} }
        @keyframes blob5 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(80px,-60px) scale(1.25)} }
        .animate-blob-1 { animation: blob1 14s ease-in-out infinite; }
        .animate-blob-2 { animation: blob2 16s ease-in-out infinite; }
        .animate-blob-3 { animation: blob3 13s ease-in-out infinite; }
        .animate-blob-4 { animation: blob4 11s ease-in-out infinite; }
        .animate-blob-5 { animation: blob5 15s ease-in-out infinite; }
      `}</style>

      {/* Header — ثابت LTR بحيث الشعار يسار واللغة يمين دائماً */}
      <header className="relative z-10 border-b backdrop-blur-md"
        style={{
          borderColor: "rgba(0,212,255,0.15)",
          backgroundColor: "rgba(2,43,72,0.5)",
        }}>
        <div dir="ltr" className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* الشعار — ثابت يسار */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)" }}>
              <span className="font-bold text-sm" style={{ color: "#00D4FF", fontFamily: fontLogo }}>ST</span>
            </div>
            <span className="text-xl tracking-tight"
              style={{ color: "#f5f5f0", fontFamily: fontLogo, letterSpacing: "0.1em" }}>
              SPECTRA TRACE
            </span>
          </div>

          {/* اللغة + Login — ثابت يمين */}
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-full p-1"
              style={{
                backgroundColor: "rgba(2,43,72,0.5)",
                border: "1px solid rgba(0,212,255,0.15)",
              }}>
              <button
                onClick={() => setLang("ar")}
                className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
                style={{
                  backgroundColor: lang === "ar" ? "#f5f5f0" : "transparent",
                  color: lang === "ar" ? "#011627" : "#92A1A8",
                  fontFamily: "var(--font-montserrat)",
                }}
              >
                عربي
              </button>
              <button
                onClick={() => setLang("en")}
                className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
                style={{
                  backgroundColor: lang === "en" ? "#f5f5f0" : "transparent",
                  color: lang === "en" ? "#011627" : "#92A1A8",
                  fontFamily: "var(--font-montserrat)",
                }}
              >
                EN
              </button>
            </div>

            <Link href="/auth/login"
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "#92A1A8", fontFamily: fontBody }}
            >
              {t("login")}
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-32 text-center">
        <h1
          className="text-5xl md:text-6xl font-light mb-16 tracking-widest"
          style={{
            color: "#f5f5f0",
            fontFamily: fontLogo,
            textShadow: "0 0 30px rgba(245,245,240,0.3), 0 0 60px rgba(0,212,255,0.2)",
            letterSpacing: "0.15em",
          }}
        >
          SPECTRA TRACE
        </h1>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleInstantAccess}
            disabled={loading}
            className="group relative text-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center"
            style={{
              backgroundColor: "#f5f5f0",
              color: "#011627",
              borderRadius: "9999px",
              boxShadow: "0 0 25px rgba(245,245,240,0.4), 0 0 50px rgba(245,245,240,0.2)",
              fontFamily: fontBody,
              fontWeight: 600,
              minWidth: "240px",
              height: "60px",
            }}
          >
            {loading ? t("home.loading") : t("home.tryFree")}
          </button>
        </div>
      </main>

      {/* Footer — اتجاه LTR ثابت، الأعمدة لا تتحرك أبداً */}
      <footer className="relative z-10 border-t backdrop-blur-md"
        style={{
          borderColor: "rgba(0,212,255,0.15)",
          backgroundColor: "rgba(2,43,72,0.5)",
        }}>
        <div dir="ltr" className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid md:grid-cols-3 gap-x-24 gap-y-10 mb-10">

            {/* Column 1 — About Us (ثابت في المكان الأول) */}
            <div dir={isRTL ? "rtl" : "ltr"} className={isRTL ? "text-right" : "text-left"}>
              <Link href="/about">
                <h3 className="text-xl font-light mb-4 cursor-pointer transition-colors inline-block"
                  style={{
                    color: "#f5f5f0",
                    textShadow: "0 0 15px rgba(0,212,255,0.4)",
                    fontFamily: fontBody,
                  }}>
                  {t("home.aboutUs")} {isRTL ? "←" : "→"}
                </h3>
              </Link>
              <p className="text-xs leading-relaxed" style={{ color: "#92A1A8", fontFamily: fontBody }}>
                {isRTL
                  ? "اضغط لمعرفة المزيد عن منصة Spectra Trace ومميزاتها"
                  : "Click to learn more about Spectra Trace and its features"}
              </p>
            </div>

            {/* Column 2 — Support (ثابت في المنتصف) */}
            <div dir={isRTL ? "rtl" : "ltr"} className={isRTL ? "text-right" : "text-left"}>
              <h3 className="text-xl font-light mb-4"
                style={{ color: "#f5f5f0", textShadow: "0 0 15px rgba(0,212,255,0.4)", fontFamily: fontBody }}>
                {t("home.support")}
              </h3>
              <p className="text-xs leading-relaxed mb-4" style={{ color: "#92A1A8", fontFamily: fontBody }}>
                {t("home.supportDesc")}
              </p>
              <div className="flex items-center gap-2 text-xs" style={{ color: "#92A1A8", fontFamily: fontBody }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="2" className="shrink-0">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span dir="ltr">support@spectratrace.com</span>
              </div>
            </div>

            {/* Column 3 — Contact (ثابت في المكان الثالث) */}
            <div dir={isRTL ? "rtl" : "ltr"} className={isRTL ? "text-right" : "text-left"}>
              <h3 className="text-xl font-light mb-4"
                style={{ color: "#f5f5f0", textShadow: "0 0 15px rgba(0,212,255,0.4)", fontFamily: fontBody }}>
                {t("home.contact")}
              </h3>
              <div className="space-y-3 text-xs" style={{ fontFamily: fontBody }}>
                <div className="flex items-center gap-2" style={{ color: "#92A1A8" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="2" className="shrink-0">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{t("home.email")}: <span dir="ltr">contact@spectratrace.com</span></span>
                </div>
                <div className="flex items-center gap-2" style={{ color: "#92A1A8" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="2" className="shrink-0">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{t("home.phone")}: <span dir="ltr">+966 XX XXX XXXX</span></span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 text-center text-xs"
            style={{ borderColor: "rgba(0,212,255,0.15)", color: "#92A1A8", fontFamily: fontBody }}>
            {t("home.footer")}
          </div>
        </div>
      </footer>
    </div>
  )
}