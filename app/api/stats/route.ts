import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { count: totalDocuments } = await supabase
    .from("protected_documents")
    .select("*", { count: "exact", head: true })

  const { count: totalEmployees } = await supabase
    .from("employees")
    .select("*", { count: "exact", head: true })

  const { count: totalLeaks } = await supabase
    .from("leak_detections")
    .select("*", { count: "exact", head: true })

  const { data: recentActivity } = await supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  return NextResponse.json({
    totalDocuments: totalDocuments || 0,
    totalEmployees: totalEmployees || 0,
    totalLeaks: totalLeaks || 0,
    recentActivity: recentActivity || [],
  })
}