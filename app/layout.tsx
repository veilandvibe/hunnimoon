import type { Metadata } from 'next'
import AuthProvider from '@/components/providers/AuthProvider'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hunnimoon - Wedding Planning Made Simple',
  description: 'Plan your perfect wedding with guest management, RSVPs, budget tracking, and more.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
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
      </body>
    </html>
  )
}
