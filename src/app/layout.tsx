import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Shoutout Marketplace - Persönliche Video-Grüße von deinen Lieblings-Influencern',
  description: 'Erhalte personalisierte Shoutouts und Video-Nachrichten von deinen Lieblings-Content-Creators',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <Suspense>
          {children}
          </Suspense>
        </div>
      </body>
    </html>
  )
}