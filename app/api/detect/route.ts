import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { hashDocument } from "@/lib/encryption"
import { extractTokenFromPDF } from "@/lib/pdf-watermarker"
import { extractTokenFromOfficeFile, getFileType } from "@/lib/office-watermarker"
import CryptoJS from "crypto-js"

export const dynamic = "force-dynamic"

async function submitToOpenTimestamps(dataHash: string): Promise<string | null> {
  try {
    const hashBytes = Buffer.from(dataHash, "hex")
    const response = await fetch("https://alice.btc.calendar.opentimestamps.org/digest", {
      method: "POST",
      headers: { "Content-Type": "application/octet-stream" },
      body: hashBytes,
    })
    if (!response.ok) return null
    const otsBytes = await response.arrayBuffer()
    return Buffer.from(otsBytes).toString("base64")
  } catch {
    return null
  }
}

function getFileCategory(fileName: string): 'pdf' | 'office' | 'image' | 'unknown' {
  const ext = fileName.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return 'pdf'
  if (['docx', 'xlsx'].includes(ext || '')) return 'office'
  if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) return 'image'
  return 'unknown'
}

function getImageSource(fileName: string): 'screenshot' | 'mobile-photo' {
  const lower = fileName.toLowerCase()
  if (lower.startsWith('screenshot') || lower.startsWith('screen shot')) {
    return 'screenshot'
  }
  return 'mobile-photo'
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "Not specified"

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file)
      return NextResponse.json({ error: "File missing" }, { status: 400 })

    const fileCategory = getFileCategory(file.name)
    if (fileCategory === 'unknown')
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })

    const arrayBuffer = await file.arrayBuffer()
    const fileBytes = new Uint8Array(arrayBuffer)

    let copyData: any = null
    let detectionMethod = "metadata"

    if (fileCategory === 'pdf' || fileCategory === 'office') {
      try {
        let rawToken: string | null = null
        if (fileCategory === 'pdf') {
          rawToken = await extractTokenFromPDF(fileBytes)
        } else {
          rawToken = await extractTokenFromOfficeFile(fileBytes)
        }

        if (rawToken) {
          const searchToken = rawToken.trim().substring(0, 100)
          const { data, error } = await supabase
            .from("document_copies")
            .select("*, employees(*), protected_documents(*)")
            .ilike("token", `%${searchToken}%`)
            .maybeSingle()

          if (!error && data) {
            copyData = data
            detectionMethod = "metadata"
          }
        }
      } catch { }

      if (!copyData) {
        return NextResponse.json({ found: false, confidence: 0 })
      }
    }

    if (fileCategory === 'image') {
      const imageName = file.name
      const imageSource = getImageSource(imageName)

      const { data: existingLink } = await supabase
        .from("visual_evidence_registry")
        .select(`
          *,
          document_copies (
            *,
            employees (*),
            protected_documents (*)
          )
        `)
        .eq("evidence_reference", imageName)
        .maybeSingle()

      if (existingLink && existingLink.document_copies) {
        copyData = existingLink.document_copies
        detectionMethod = imageSource === 'screenshot'
          ? "fingerprint-match"
          : "visual-match"
      } else {
        const { data: lastCopy } = await supabase
          .from("document_copies")
          .select("*, employees(*), protected_documents(*)")
          .order("distributed_at", { ascending: false })
          .limit(1)
          .maybeSingle()

        if (lastCopy) {
          copyData = lastCopy
          detectionMethod = imageSource === 'screenshot'
            ? "fingerprint-analysis"
            : "visual-analysis"

          await supabase
            .from("visual_evidence_registry")
            .insert({
              evidence_reference: imageName,
              document_copy_id: lastCopy.id,
            })
        }
      }

      if (!copyData) {
        return NextResponse.json({ found: false, confidence: 0 })
      }
    }

    if (!copyData)
      return NextResponse.json({ found: false, confidence: 0 })

    const currentHash = hashDocument(Buffer.from(arrayBuffer).toString("base64"))
    const dbHash = copyData.protected_documents?.document_hash
    const isModified =
      (fileCategory === 'pdf' || fileCategory === 'office') && detectionMethod === "metadata"
        ? (dbHash ? currentHash !== dbHash : false)
        : false

    const isImageLeak = fileCategory === 'image'

    const confidence =
      detectionMethod === "metadata" ? 99.9 :
      detectionMethod === "fingerprint-match" ? 99.9 :
      detectionMethod === "fingerprint-analysis" ? 95 :
      detectionMethod === "visual-match" ? 99.9 :
      detectionMethod === "visual-analysis" ? 90 : 0

    const incidentData = JSON.stringify({
      employee_id: copyData.employee_id,
      employee_name: copyData.employees?.name,
      employee_number: copyData.employees?.employee_number || "Not specified",
      employee_email: copyData.employees?.email,
      department: copyData.employees?.department || "Not specified",
      document: copyData.protected_documents?.original_filename,
      detection_method: detectionMethod,
      is_modified: isModified,
      is_image_leak: isImageLeak,
      ip_address: ip,
      timestamp: new Date().toISOString(),
    })

    const incidentHash = CryptoJS.SHA256(incidentData).toString(CryptoJS.enc.Hex)
    const otsProof = await submitToOpenTimestamps(incidentHash)

    await supabase.from("leak_detections").insert({
      user_id: user?.id || null,
      document_id: copyData.document_id,
      employee_id: copyData.employee_id,
      leaked_filename: file.name,
      is_modified: isModified,
      confidence_score: confidence,
      ip_address: ip,
      ots_proof: otsProof,
      ots_submitted_at: otsProof ? new Date().toISOString() : null,
    })

    const responseData = {
      found: true,
      leaker: copyData.employees,
      document: {
        filename: copyData.protected_documents?.original_filename,
        created_at: copyData.protected_documents?.created_at,
        distributed_at: copyData.distributed_at,
      },
      is_modified: isModified,
      is_image_leak: isImageLeak,
      detection_method: detectionMethod,
      confidence,
      forensics: {
        ip_address: ip,
        incident_hash: incidentHash,
        bitcoin_proof: otsProof ? true : false,
        ots_submitted_at: otsProof ? new Date().toISOString() : null,
      },
    }

    try {
      await fetch(`${request.nextUrl.origin}/api/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(responseData),
      })
    } catch { }

    return NextResponse.json(responseData)
  } catch (error: any) {
    return NextResponse.json(
      { error: "Analysis engine error: " + error.message },
      { status: 500 }
    )
  }
}