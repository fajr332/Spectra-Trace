"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useLang } from "@/lib/language-context"

export default function LogoutButton() {
  const supabase = createClient()
  const router = useRouter()
  const { t, isRTL } = useLang()

  const fontBody = isRTL ? "var(--font-cairo)" : "var(--font-montserrat)"

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full px-4 py-3 text-sm transition-all duration-300 active:scale-95"
      style={{
        backgroundColor: "#f5f5f0",
        color: "#011627",
        borderRadius: "9999px",
        boxShadow: "0 0 15px rgba(245,245,240,0.4)",
        fontFamily: fontBody,
        fontWeight: 600,
      }}
    >
      {t("logout")}
    </button>
  )
}