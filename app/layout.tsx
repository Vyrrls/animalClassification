import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'

import './globals.css'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const _spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

export const metadata: Metadata = {
  title: 'Faunavision AI - Klasifikasi Hewan Cerdas',
  description: 'Identifikasi dan klasifikasi jenis hewan menggunakan kecerdasan buatan. Upload foto hewan dan dapatkan informasi lengkap tentang spesies, habitat, dan karakteristiknya.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#1a8a5e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={`${_inter.variable} ${_spaceGrotesk.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
