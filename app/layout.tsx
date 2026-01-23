import type { Metadata } from 'next'
import AuthProvider from '@/components/providers/AuthProvider'
import { TourProvider } from '@/components/providers/TourContext'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hunnimoon - Wedding Planning Made Simple',
  description: 'Plan your perfect wedding with guest management, RSVPs, budget tracking, and more. Free 7-day trial included.',
  keywords: ['wedding planning', 'guest management', 'RSVP tracking', 'budget tracking', 'vendor organization', 'wedding timeline', 'wedding planner'],
  authors: [{ name: 'Hunnimoon' }],
  creator: 'Hunnimoon',
  publisher: 'Hunnimoon',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://hunnimoon.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Hunnimoon',
    title: 'Hunnimoon - Wedding Planning Made Simple',
    description: 'Plan your perfect wedding with guest management, RSVPs, budget tracking, and more. Free 7-day trial included.',
    images: [
      {
        url: '/Social Preview.png',
        width: 1200,
        height: 630,
        alt: 'Hunnimoon Wedding Planning',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hunnimoon - Wedding Planning Made Simple',
    description: 'Plan your perfect wedding with guest management, RSVPs, budget tracking, and more. Free 7-day trial included.',
    images: ['/Social Preview.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/New Favicon.png',
    apple: '/Apple Touch Icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <TourProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              success: {
                iconTheme: {
                  primary: '#C2185B',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </TourProvider>
        <Analytics />
      </body>
    </html>
  )
}
