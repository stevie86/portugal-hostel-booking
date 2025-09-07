import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Lisbon Hostel Booking</h3>
          <p className="text-gray-300 mb-4">
            Fair, local, hostel-first bookings in Lisbon — no hidden fees.
          </p>
          <div className="flex justify-center space-x-6 mb-4">
            <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
            <Link href="/properties" className="text-gray-300 hover:text-white">Properties</Link>
            <Link href="/about" className="text-gray-300 hover:text-white">About</Link>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 Lisbon Hostel Booking. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}