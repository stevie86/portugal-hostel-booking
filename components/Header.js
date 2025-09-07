import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-brand-600">
            Lisbon Hostel Booking
          </Link>
          <nav className="flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-brand-600">
              Home
            </Link>
            <Link href="/properties" className="text-gray-600 hover:text-brand-600">
              Properties
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-brand-600">
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}