import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Portugal Hostels</h3>
            <p className="text-neutral-text-muted">
              Your gateway to authentic hostel experiences across Portugal.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-neutral-text-muted hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/properties" className="text-neutral-text-muted hover:text-white transition-colors">Properties</Link></li>
              <li><Link href="/about" className="text-neutral-text-muted hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-neutral-text-muted hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4 text-white">Destinations</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-text-muted hover:text-white transition-colors">Lisbon</a></li>
              <li><a href="#" className="text-neutral-text-muted hover:text-white transition-colors">Porto</a></li>
              <li><a href="#" className="text-neutral-text-muted hover:text-white transition-colors">Algarve</a></li>
              <li><a href="#" className="text-neutral-text-muted hover:text-white transition-colors">Coimbra</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-text-muted hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-neutral-text-muted hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-neutral-text-muted hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-neutral-text-muted hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-brand-800 mt-8 pt-8 text-center">
          <p className="text-neutral-text-muted">
            © 2024 Portugal Hostels. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}