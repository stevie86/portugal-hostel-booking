import React from 'react'
import type { Metadata } from 'next'
import '../global.css'

export const metadata: Metadata = {
  title: 'Lisbon Hostel Booking',
  description: 'Book your bed in Lisbon hostels',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}