import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Portugal Hostels</h3>
            <p className="text-gray-300">
              Your gateway to authentic hostel experiences across Portugal.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link href="/properties" className="text-gray-300 hover:text-white">Properties</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-white">About</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Destinations</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Lisbon</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Porto</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Algarve</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Coimbra</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">FAQ</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 Portugal Hostels. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}