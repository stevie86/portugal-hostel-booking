import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 bg-white border-b border-neutral-bg-muted shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-brand-600 hover:text-brand-700">
              Portugal Hostels
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-neutral-text-muted hover:text-brand-600 hover:underline hover:underline-offset-4 hover:decoration-accent-500">
              Home
            </Link>
            <Link href="/properties" className="text-neutral-text-muted hover:text-brand-600 hover:underline hover:underline-offset-4 hover:decoration-accent-500">
              Properties
            </Link>
            <Link href="/about" className="text-neutral-text-muted hover:text-brand-600 hover:underline hover:underline-offset-4 hover:decoration-accent-500">
              About
            </Link>
            <Link href="/contact" className="text-neutral-text-muted hover:text-brand-600 hover:underline hover:underline-offset-4 hover:decoration-accent-500">
              Contact
            </Link>
          </nav>
          <div className="md:hidden">
            <button className="text-neutral-text-muted hover:text-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}