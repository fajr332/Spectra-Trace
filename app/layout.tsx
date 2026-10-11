import type { Metadata } from "next"
import { Cairo, Montserrat, Michroma } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/lib/language-context"

const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo" })
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
})
const michroma = Michroma({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-michroma",
})

export const metadata: Metadata = {
  title: "Spectra Trace | Document Leak Tracking",
  description: "Advanced platform for document protection and leak tracing",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.variable} ${montserrat.variable} ${michroma.variable} antialiased min-h-screen`}
        style={{ backgroundColor: "#011627", color: "#FDFFFC" }}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}