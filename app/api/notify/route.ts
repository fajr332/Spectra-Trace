import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

// أيقونة Check رمز SVG (مو إيموجي)
const checkIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;"><polyline points="20 6 9 17 4 12"/></svg>`

const alertIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      leaker,
      document,
      is_modified,
      is_image_leak,
      forensics,
    } = body

    const statusText = is_image_leak
      ? "Document Leaked"
      : is_modified
        ? "File Tampered"
        : "File Intact"

    const { error } = await resend.emails.send({
      from: "Spectra Trace <onboarding@resend.dev>",
      to: "alanoudalmazyad3@gmail.com",
      subject: `Security Alert: Document Leak Detected`,
      html: `
        <div dir="ltr" style="font-family: 'Montserrat', Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #011627; color: #f5f5f0; padding: 0; border-radius: 16px; overflow: hidden;">

          <!-- Header -->
          <div style="background: rgba(2,43,72,0.8); padding: 32px; text-align: center; border-bottom: 1px solid rgba(0,212,255,0.15);">
            <p style="color: #00D4FF; font-size: 11px; letter-spacing: 3px; margin: 0 0 8px 0; font-weight: bold;">SPECTRA TRACE</p>
            <h1 style="color: #f5f5f0; font-size: 22px; margin: 0; font-weight: 300;">
              ${alertIcon} &nbsp; Security Breach Detected
            </h1>
            <p style="color: #92A1A8; margin-top: 12px; font-size: 13px;">Digital Forensic Investigation System</p>
          </div>

          <!-- Content -->
          <div style="padding: 28px;">

            <!-- Leaker -->
            <div style="background: rgba(2,43,72,0.5); padding: 20px; border-radius: 12px; margin-bottom: 16px; border: 1px solid rgba(0,212,255,0.15);">
              <h2 style="color: #00D4FF; margin: 0 0 16px 0; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; font-weight: bold;">Identified Leaker</h2>
              <table style="width: 100%; font-size: 13px;">
                <tr>
                  <td style="padding: 6px 0; color: #92A1A8; width: 35%;">Name</td>
                  <td style="padding: 6px 0; color: #f5f5f0; font-weight: 600;">${leaker?.name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #92A1A8;">Employee Number</td>
                  <td style="padding: 6px 0; color: #f5f5f0; font-family: monospace;">${leaker?.employee_number || "Not specified"}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #92A1A8;">Email Address</td>
                  <td style="padding: 6px 0; color: #f5f5f0; font-family: monospace;">${leaker?.email}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #92A1A8;">Department</td>
                  <td style="padding: 6px 0; color: #f5f5f0;">${leaker?.department || "Not specified"}</td>
                </tr>
              </table>
            </div>

            <!-- Document Details -->
            <div style="background: rgba(2,43,72,0.5); padding: 20px; border-radius: 12px; margin-bottom: 16px; border: 1px solid rgba(0,212,255,0.15);">
              <h2 style="color: #00D4FF; margin: 0 0 16px 0; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; font-weight: bold;">Document Details</h2>
              <table style="width: 100%; font-size: 13px;">
                <tr>
                  <td style="padding: 6px 0; color: #92A1A8; width: 35%;">Filename</td>
                  <td style="padding: 6px 0; color: #f5f5f0; font-weight: 600;">${document?.filename}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #92A1A8;">Encryption Date</td>
                  <td style="padding: 6px 0; color: #f5f5f0;">${new Date(document?.created_at).toLocaleString("en-US")}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #92A1A8;">Document Status</td>
                  <td style="padding: 6px 0; color: #f5f5f0; font-weight: 600;">${statusText}</td>
                </tr>
              </table>
            </div>

            <!-- Forensic Evidence -->
            <div style="background: rgba(2,43,72,0.5); padding: 20px; border-radius: 12px; margin-bottom: 16px; border: 1px solid rgba(0,212,255,0.15);">
              <h2 style="color: #00D4FF; margin: 0 0 16px 0; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; font-weight: bold;">Digital Forensic Evidence</h2>
              <table style="width: 100%; font-size: 13px;">
                <tr>
                  <td style="padding: 6px 0; color: #92A1A8; width: 35%;">IP Address</td>
                  <td style="padding: 6px 0; color: #f5f5f0; font-family: monospace;">${forensics?.ip_address}</td>
                </tr>
              </table>
              <p style="margin: 12px 0 6px 0; color: #92A1A8; font-size: 13px;">Incident Hash:</p>
              <p style="background: rgba(1,22,39,0.8); padding: 10px; border-radius: 8px; font-family: monospace; font-size: 11px; word-break: break-all; color: #f5f5f0; margin: 0; border: 1px solid rgba(0,212,255,0.1);">${forensics?.incident_hash}</p>
            </div>

            <!-- Legal Statement -->
            <div style="background: rgba(0,212,255,0.05); padding: 16px; border-radius: 12px; border: 1px solid rgba(0,212,255,0.2);">
              <p style="color: #92A1A8; font-size: 12px; line-height: 1.7; margin: 0;">
                ${checkIcon} &nbsp; This record cannot be deleted or modified by any party. Valid as internationally recognized legal evidence.
              </p>
            </div>

          </div>

          <!-- Footer -->
          <div style="background: rgba(2,43,72,0.8); padding: 20px; text-align: center; border-top: 1px solid rgba(0,212,255,0.15);">
            <p style="color: #92A1A8; font-size: 11px; margin: 0;">This alert was sent automatically by Spectra Trace</p>
            <p style="color: #92A1A8; font-size: 11px; margin: 6px 0 0 0; font-family: monospace;">${new Date().toLocaleString("en-US")}</p>
          </div>

        </div>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Notify error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}