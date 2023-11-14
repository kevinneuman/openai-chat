import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OpenAI Chat',
  description:
    'A cost-effective, mobile-first chat UI, designed with OpenAI API, Next.js, and Tailwind CSS, uses credits for a cheaper alternative to costly subscriptions.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/logo64.png',
    apple: '/icons/logo192.png',
  },
}

export const viewport: Viewport = {
  themeColor: 'black',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
