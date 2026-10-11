"use client"

import Link from "next/link"
import { useLang } from "@/lib/language-context"

export default function AboutPage() {
  const { t, isRTL } = useLang()

  const fontBody = isRTL ? "var(--font-cairo)" : "var(--font-montserrat)"
  const fontLogo = "var(--font-michroma)"

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
      style={{ backgroundColor: "#011627", color: "#FDFFFC", fontFamily: fontBody }}
    >
      {}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-25 animate-blob-1"
          style={{ background: "radial-gradient(circle, rgba(0,212,255,0.4) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-25 animate-blob-2"
          style={{ background: "radial-gradient(circle, rgba(2,43,72,0.8) 0%, transparent 70%)" }} />
      </div>

      <style jsx>{`
        @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(60px,40px) scale(1.1)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-50px,-30px) scale(1.05)} }
        .animate-blob-1 { animation: blob1 18s ease-in-out infinite; }
        .animate-blob-2 { animation: blob2 20s ease-in-out infinite; }
      `}</style>

      {/* Header */}
      <header className="relative z-10 border-b backdrop-blur-md"
        style={{
          borderColor: "rgba(0,212,255,0.15)",
          backgroundColor: "rgba(2,43,72,0.5)",
        }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)" }}>
              <span className="font-bold text-sm" style={{ color: "#00D4FF", fontFamily: fontLogo }}>ST</span>
            </div>
            <span className="text-xl tracking-tight"
              style={{ color: "#FDFFFC", fontFamily: fontLogo, letterSpacing: "0.1em" }}>
              SPECTRA TRACE
            </span>
          </Link>

          <Link
            href="/"
            className="text-sm transition-opacity hover:opacity-80 flex items-center gap-2"
            style={{ color: "#92A1A8", fontFamily: fontBody }}
          >
            {isRTL ? "→" : "←"} {t("about.back")}
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-light mb-16 text-center tracking-widest"
          style={{
            color: "#FDFFFC",
            fontFamily: fontLogo,
            textShadow: "0 0 25px rgba(0,212,255,0.4)",
            letterSpacing: "0.15em",
          }}
        >
          {t("about.title")}
        </h1>

        <div className="space-y-8">
          {/* Section 1 */}
          <section className="rounded-3xl p-8 md:p-10 backdrop-blur-md"
            style={{
              backgroundColor: "rgba(2,43,72,0.5)",
              border: "1px solid rgba(0,212,255,0.15)",
            }}>
            <h2 className="text-2xl font-light mb-6"
              style={{ color: "#FDFFFC", textShadow: "0 0 15px rgba(0,212,255,0.4)" }}>
              {t("about.whatTitle")}
            </h2>
            <div className="space-y-4 leading-relaxed font-light" style={{ color: "#92A1A8" }}>
              <p>{t("about.whatP1")}</p>
              <p>{t("about.whatP2")}</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="rounded-3xl p-8 md:p-10 backdrop-blur-md"
            style={{
              backgroundColor: "rgba(2,43,72,0.5)",
              border: "1px solid rgba(0,212,255,0.15)",
            }}>
            <h2 className="text-2xl font-light mb-6"
              style={{ color: "#FDFFFC", textShadow: "0 0 15px rgba(0,212,255,0.4)" }}>
              {t("about.howTitle")}
            </h2>
            <div className="space-y-4 leading-relaxed font-light" style={{ color: "#92A1A8" }}>
              <p>{t("about.howP1")}</p>
              <p>{t("about.howP2")}</p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="rounded-3xl p-8 md:p-10 backdrop-blur-md"
            style={{
              backgroundColor: "rgba(2,43,72,0.5)",
              border: "1px solid rgba(0,212,255,0.15)",
            }}>
            <h2 className="text-2xl font-light mb-6"
              style={{ color: "#FDFFFC", textShadow: "0 0 15px rgba(0,212,255,0.4)" }}>
              {t("about.leakTitle")}
            </h2>
            <div className="space-y-4 leading-relaxed font-light" style={{ color: "#92A1A8" }}>
              <p>{t("about.leakP1")}</p>
              <p>{t("about.leakP2")}</p>
            </div>
          </section>

          {/* Final */}
          <div className="text-center py-8">
            <p className="text-2xl italic font-light"
              style={{ color: "#00D4FF", textShadow: "0 0 20px rgba(0,212,255,0.4)" }}>
              {t("about.final")}
            </p>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t py-6 text-center text-xs"
        style={{
          borderColor: "rgba(0,212,255,0.15)",
          color: "#92A1A8",
          fontFamily: fontBody,
        }}>
        {t("home.footer")}
      </footer>
    </div>
  )
}