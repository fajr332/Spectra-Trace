"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-card p-8 rounded-2xl border border-border">
            <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">تم إنشاء الحساب</h2>
            <p className="text-muted-foreground mb-6">
              تم إرسال رابط التأكيد إلى بريدك الإلكتروني
            </p>
            <Link
              href="/auth/login"
              className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-semibold"
            >
              العودة لتسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <span className="text-2xl font-bold">Spectra Trace</span>
          </Link>
          <h1 className="text-3xl font-bold">إنشاء حساب</h1>
          <p className="text-muted-foreground mt-2">أنشئ حسابك للبدء في حماية وثائقك</p>
        </div>

        <form onSubmit={handleSignup} className="bg-card p-8 rounded-2xl border border-border">
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-foreground mb-2 font-medium">الاسم الكامل</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-input text-foreground px-4 py-3 rounded-xl border border-border focus:border-primary focus:outline-none transition-colors"
              placeholder="أحمد محمد"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-foreground mb-2 font-medium">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-input text-foreground px-4 py-3 rounded-xl border border-border focus:border-primary focus:outline-none transition-colors"
              placeholder="example@company.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-foreground mb-2 font-medium">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-input text-foreground px-4 py-3 rounded-xl border border-border focus:border-primary focus:outline-none transition-colors"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "جارٍ إنشاء الحساب..." : "إنشاء حساب"}
          </button>

          <p className="text-center text-muted-foreground mt-6">
            لديك حساب بالفعل؟{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}