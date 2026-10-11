import { PDFDocument, StandardFonts } from 'pdf-lib'
export async function embedTokenInPDF(
  pdfBytes: Uint8Array,
  token: string,
  empName: string
): Promise<Uint8Array> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes, {
      ignoreEncryption: true,
      throwOnInvalidObject: false,
    })

    const forensicTag = `Spectra-Trace:${token}`
    pdfDoc.setAuthor(forensicTag)
    pdfDoc.setSubject(forensicTag)
    pdfDoc.setKeywords([token, 'forensic', empName])
    pdfDoc.setProducer(`Forensic-Engine-${token}`)
    pdfDoc.setCreator(`Spectra-Vault-${token.slice(-8)}`)

    return await pdfDoc.save()
  } catch (error: any) {
    throw new Error(`فشل الحقن: ${error.message}`)
  }
}

export async function extractTokenFromPDF(
  pdfBytes: Uint8Array
): Promise<string | null> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes, {
      ignoreEncryption: true,
      throwOnInvalidObject: false,
    })

    const fields = [
      pdfDoc.getAuthor(),
      pdfDoc.getSubject(),
      pdfDoc.getKeywords() || "",
      pdfDoc.getProducer(),
      pdfDoc.getCreator(),
    ]

    const tokenRegex = /[A-Za-z0-9+/]{30,}={0,2}/

    for (const field of fields) {
      if (!field) continue
      if (field.includes("Spectra-Trace:")) {
        return field.split("Spectra-Trace:")[1].trim()
      }
      const match = field.match(tokenRegex)
      if (match) return match[0]
    }

    return null
  } catch {
    const rawContent = new TextDecoder().decode(pdfBytes.slice(0, 5000))
    const rawMatch = rawContent.match(/[A-Za-z0-9+/]{30,}={0,2}/)
    return rawMatch ? rawMatch[0] : null
  }
}