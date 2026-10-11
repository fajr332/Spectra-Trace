"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useLang } from "@/lib/language-context"

export default function LoginPage() {
  const router = useRouter()
  const { isRTL } = useLang()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fontBody = isRTL ? "var(--font-cairo)" : "var(--font-montserrat)"
  const fontLogo = "var(--font-michroma)"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(isRTL ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" : "Invalid email or password")
      setLoading(false)
      return
    }

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      dir={isRTL ? "rtl" : "ltr"}
      style={{ backgroundColor: "#011627", fontFamily: fontBody }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)" }}>
              <span className="font-bold text-2xl" style={{ color: "#00D4FF", fontFamily: fontLogo }}>S</span>
            </div>
            <span className="text-2xl tracking-widest"
              style={{ color: "#f5f5f0", fontFamily: fontLogo, textShadow: "0 0 20px rgba(245,245,240,0.3)" }}>
              SPECTRA TRACE
            </span>
          </Link>
          <h1 className="text-3xl font-light" style={{ color: "#f5f5f0" }}>
            {isRTL ? "تسجيل الدخول" : "Login"}
          </h1>
          <p className="mt-2" style={{ color: "#92A1A8" }}>
            {isRTL ? "أدخل بياناتك للوصول إلى حسابك" : "Enter your credentials to access your account"}
          </p>
        </div>

        <form onSubmit={handleLogin}
          className="p-8 rounded-2xl backdrop-blur-md"
          style={{
            backgroundColor: "rgba(2,43,72,0.5)",
            border: "1px solid rgba(0,212,255,0.15)",
          }}>
          {error && (
            <div className="px-4 py-3 mb-6 text-center rounded-lg"
              style={{
                backgroundColor: "rgba(255,80,80,0.1)",
                color: "#ff7070",
                border: "1px solid rgba(255,80,80,0.3)",
              }}>
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block mb-2 font-light" style={{ color: "#f5f5f0" }}>
              {isRTL ? "البريد الإلكتروني" : "Email"}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 focus:outline-none transition-colors"
              style={{
                backgroundColor: "#0C2E47",
                color: "#f5f5f0",
                border: "1px solid rgba(146,161,168,0.4)",
                borderRadius: "12px",
                fontFamily: fontBody,
              }}
              placeholder="example@company.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-light" style={{ color: "#f5f5f0" }}>
              {isRTL ? "كلمة المرور" : "Password"}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 focus:outline-none transition-colors"
              style={{
                backgroundColor: "#0C2E47",
                color: "#f5f5f0",
                border: "1px solid rgba(146,161,168,0.4)",
                borderRadius: "12px",
                fontFamily: fontBody,
              }}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
            style={{
              backgroundColor: "#f5f5f0",
              color: "#011627",
              borderRadius: "12px",
              boxShadow: "0 0 15px rgba(245,245,240,0.4)",
              fontFamily: fontBody,
              fontWeight: 600,
            }}
          >
            {loading
              ? (isRTL ? "جارٍ تسجيل الدخول..." : "Logging in...")
              : (isRTL ? "تسجيل الدخول" : "Login")
            }
          </button>

          <p className="text-center mt-6" style={{ color: "#92A1A8" }}>
            {isRTL ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
            <Link href="/auth/signup" className="hover:underline" style={{ color: "#00D4FF" }}>
              {isRTL ? "إنشاء حساب جديد" : "Create new account"}
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}