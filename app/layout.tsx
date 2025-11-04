import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/useAuth"
import { Toaster } from "@/components/Toast"
import Footer from "@/components/Footer"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "PixPro - Procesamiento inteligente de imágenes con IA",
  description: "Rápido, elegante y seguro",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable}`}>
      <body suppressHydrationWarning={true}>
        <AuthProvider>
          <main className="min-h-screen flex flex-col">
            <div className="flex-grow">{children}</div>
            <Footer />
          </main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
