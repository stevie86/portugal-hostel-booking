'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function PropertyDetailClient({ hostel }) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const handleBooking = () => {
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests: guests.toString()
    });
    router.push(`/booking/${hostel.id}?${params}`);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Image */}
        <img
          src={hostel.images[0]}
          alt={hostel.name}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">{hostel.name}</h1>
            <p className="text-gray-600 mb-4">{hostel.location}</p>
            <p className="text-gray-700">{hostel.description}</p>
          </div>

          {/* Simple Booking */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Book Your Stay</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Guests</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleBooking}
                className="w-full bg-brand-600 text-white py-2 px-4 rounded-md hover:bg-brand-700"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}