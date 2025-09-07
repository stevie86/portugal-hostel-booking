import React from 'react'
import type { Metadata } from 'next'
import { AuthProvider } from '../lib/auth-context'
import '../global.css'

export const metadata: Metadata = {
  title: 'Portugal Hostel Booking',
  description: 'Book your bed in Portugal hostels',
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}