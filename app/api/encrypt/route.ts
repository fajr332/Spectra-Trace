import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateToken, hashDocument } from "@/lib/encryption"
import { embedTokenInPDF } from "@/lib/pdf-watermarker"
import { embedTokenInOfficeFile, getFileType, getMimeType } from "@/lib/office-watermarker"

async function extractTextFromPDF(pdfBytes: Uint8Array): Promise<string> {
  try {
    const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js')
    pdfjsLib.GlobalWorkerOptions.workerSrc = ''

    const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise
    let fullText = ""

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const pageText = content.items.map((item: any) => item.str).join(" ")
      fullText += pageText + "\n"
    }

    return fullText.trim()
  } catch {
    return ""
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const empId = request.headers.get("X-Employee-ID")
    const fileNameEncoded = request.headers.get("X-File-Name")
    if (!empId || !fileNameEncoded)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })

    const fileName = decodeURIComponent(fileNameEncoded)
    const fileType = getFileType(fileName)

    if (fileType === 'unknown')
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })

    const arrayBuffer = await request.arrayBuffer()
    const fileBytes = Buffer.from(arrayBuffer)

    const { data: emp } = await supabase
      .from("employees")
      .select("*")
      .eq("id", empId)
      .single()

    if (!emp)
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })

    const tempToken = generateToken(emp.id, "temp-" + Date.now())

    let protectedFile: Uint8Array
    if (fileType === 'pdf') {
      protectedFile = await embedTokenInPDF(new Uint8Array(fileBytes), tempToken, emp.name)
    } else {
      protectedFile = await embedTokenInOfficeFile(new Uint8Array(fileBytes), tempToken, emp.name)
    }

    let { data: doc } = await supabase
      .from("protected_documents")
      .select("*")
      .eq("original_filename", fileName)
      .eq("user_id", user?.id || null)
      .maybeSingle()

    if (!doc) {
      let textContent = ""
      if (fileType === 'pdf') {
        textContent = await extractTextFromPDF(new Uint8Array(fileBytes))
      }

      const { data: newDoc, error: docError } = await supabase
        .from("protected_documents")
        .insert({
          user_id: user?.id || null,
          original_filename: fileName,
          document_hash: hashDocument(Buffer.from(protectedFile).toString("base64")),
          total_copies: 1,
          text_content: textContent,
        })
        .select()
        .single()

      if (docError)
        return NextResponse.json({ error: "Failed to save document: " + docError.message }, { status: 500 })
      doc = newDoc
    }

    const finalToken = generateToken(emp.id, doc.id)

    let finalFile: Uint8Array
    if (fileType === 'pdf') {
      finalFile = await embedTokenInPDF(new Uint8Array(fileBytes), finalToken, emp.name)
    } else {
      finalFile = await embedTokenInOfficeFile(new Uint8Array(fileBytes), finalToken, emp.name)
    }

    const finalHash = hashDocument(Buffer.from(finalFile).toString("base64"))

    await supabase
      .from("protected_documents")
      .update({ document_hash: finalHash })
      .eq("id", doc.id)

    const { error: copyError } = await supabase
      .from("document_copies")
      .upsert(
        {
          document_id: doc.id,
          employee_id: emp.id,
          token: finalToken,
          user_id: user?.id || null,
          dct_signature: emp.id,
        },
        { onConflict: "document_id,employee_id" }
      )

    if (copyError)
      return NextResponse.json({ error: "Failed to register copy: " + copyError.message }, { status: 500 })

    return new NextResponse(Buffer.from(finalFile) as any, {
      headers: { "Content-Type": getMimeType(fileType) },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}