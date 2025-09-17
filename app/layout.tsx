"use client";
import type React from "react"
import { Inter, Noto_Sans_KR } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/components/language-provider"
import { AuthProvider } from "@/components/auth-provider" 
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import ConfigureAmplifyClientSide from "@/components/ConfigureAmplify";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans-kr",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSansKR.variable}`}>
      <body>
        <ConfigureAmplifyClientSide />
        <AuthProvider>
          <LanguageProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}