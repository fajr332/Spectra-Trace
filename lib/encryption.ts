import CryptoJS from "crypto-js"

const SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY || "spectra-trace-default-key"

export function encrypt(data: string): string {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString()
}

export function decrypt(encryptedData: string): string | null {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    return decrypted || null
  } catch {
    return null
  }
}

export function generateToken(employeeId: string, documentId: string): string {
  const payload = JSON.stringify({
    e: employeeId,
    d: documentId,
    t: Date.now(),
  })
  return encrypt(payload)
}

export function parseToken(token: string): { employeeId: string; documentId: string } | null {
  const decrypted = decrypt(token)
  if (!decrypted) return null
  
  try {
    const data = JSON.parse(decrypted)
    return { employeeId: data.e, documentId: data.d }
  } catch {
    return null
  }
}

export function hashDocument(content: string): string {
  return CryptoJS.SHA256(content).toString()
}