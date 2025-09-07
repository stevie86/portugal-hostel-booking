'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Header from './Header';
import Footer from './Footer';

export default function PropertyDetailClient({ hostel }) {
  const router = useRouter();
  const t = useTranslations();

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const handleBooking = () => {
    // Navigate to booking page with parameters
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests: guests.toString()
    });
    router.push(`/booking/${hostel.id}?${params}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="md:col-span-2">
            <img
              src={hostel.images[0]}
              alt={hostel.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          {hostel.images.slice(1).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${hostel.name} ${index + 2}`}
              className="w-full h-48 object-cover rounded-lg"
            />
          ))}
        </div>

        {/* Property Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{hostel.name}</h1>
            <p className="text-gray-600 mb-4">{hostel.location}</p>

            <div className="flex items-center mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1 text-lg font-semibold">{hostel.rating}</span>
              </div>
              <span className="ml-2 text-gray-600">({hostel.reviews} reviews)</span>
            </div>

            <p className="text-gray-700 mb-6">{hostel.description}</p>

            {/* Amenities */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">{t('dashboard.amenities')}</h2>
              <div className="flex flex-wrap gap-2">
                {hostel.amenities.map((amenity, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Rooms */}
            <div>
              <h2 className="text-xl font-semibold mb-3">{t('dashboard.availability')}</h2>
              <div className="space-y-4">
                {hostel.rooms.map((room, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{room.type} {t('dashboard.roomType')}</h3>
                        <p className="text-gray-600">{room.beds} {room.beds === 1 ? t('booking.bed') : t('booking.beds')}</p>
                        <p className="text-sm text-gray-500">
                          {t('booking.bathroom')}: {room.bathroom === 'private' ? t('booking.private') : t('booking.shared')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">€{room.price}</p>
                        <p className="text-sm text-gray-600">{t('booking.perNight')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">{t('booking.bookYourStay')}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('search.checkIn')}
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('search.checkOut')}
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('search.guests')}
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? t('search.guest') : t('search.guestsPlural')}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleBooking}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  {t('booking.requestBooking')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}