import JSZip from 'jszip'

/**
 * حقن البصمة في ملفات Word وExcel (كلهم ZIP داخلياً)
 */
export async function embedTokenInOfficeFile(
  fileBytes: Uint8Array,
  token: string,
  empName: string
): Promise<Uint8Array> {
  try {
    const zip = await JSZip.loadAsync(fileBytes)
    const forensicTag = `Spectra-Trace:${token}`

    // ملف الميتاداتا الموجود في كل Word وExcel
    const coreXmlFile = zip.file('docProps/core.xml')

    if (coreXmlFile) {
      let coreXml = await coreXmlFile.async('string')

      // حقن في حقل creator
      if (coreXml.includes('<dc:creator>')) {
        coreXml = coreXml.replace(/<dc:creator>.*?<\/dc:creator>/, `<dc:creator>${forensicTag}</dc:creator>`)
      } else {
        coreXml = coreXml.replace('</cp:coreProperties>', `<dc:creator>${forensicTag}</dc:creator></cp:coreProperties>`)
      }

      // حقن في حقل description كنسخة احتياطية
      if (coreXml.includes('<dc:description>')) {
        coreXml = coreXml.replace(/<dc:description>.*?<\/dc:description>/, `<dc:description>${forensicTag}</dc:description>`)
      } else {
        coreXml = coreXml.replace('</cp:coreProperties>', `<dc:description>${forensicTag}</dc:description></cp:coreProperties>`)
      }

      zip.file('docProps/core.xml', coreXml)
    } else {
      // لو ما في core.xml — ننشئه من الصفر
      const newCoreXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <dc:creator>${forensicTag}</dc:creator>
  <dc:description>${forensicTag}</dc:description>
</cp:coreProperties>`
      zip.file('docProps/core.xml', newCoreXml)
    }

    const result = await zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' })
    return result
  } catch (error: any) {
    throw new Error(`فشل حقن البصمة في ملف Office: ${error.message}`)
  }
}

/**
 * استخراج البصمة من ملفات Word وExcel
 */
export async function extractTokenFromOfficeFile(fileBytes: Uint8Array): Promise<string | null> {
  try {
    const zip = await JSZip.loadAsync(fileBytes)
    const coreXmlFile = zip.file('docProps/core.xml')

    if (!coreXmlFile) return null

    const coreXml = await coreXmlFile.async('string')

    if (coreXml.includes('Spectra-Trace:')) {
      const match = coreXml.match(/Spectra-Trace:([^<\s]+)/)
      if (match) return match[1].trim()
    }

    return null
  } catch {
    return null
  }
}

/**
 * تحديد نوع الملف من اسمه
 */
export function getFileType(fileName: string): 'pdf' | 'docx' | 'xlsx' | 'unknown' {
  const ext = fileName.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return 'pdf'
  if (ext === 'docx') return 'docx'
  if (ext === 'xlsx') return 'xlsx'
  return 'unknown'
}

/**
 * MIME type لكل نوع ملف
 */
export function getMimeType(fileType: 'pdf' | 'docx' | 'xlsx' | 'unknown'): string {
  const types = {
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    unknown: 'application/octet-stream',
  }
  return types[fileType]
}