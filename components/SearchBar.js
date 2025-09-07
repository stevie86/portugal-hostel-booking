'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function SearchBar() {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const t = useTranslations('search');

  const handleSearch = (e) => {
    e.preventDefault();
    // For mock, just navigate to properties page
    window.location.href = '/properties';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="location" className="block text-sm font-medium text-neutral-text mb-1">
            {t('location')}
          </label>
          <input
            type="text"
            id="location"
            placeholder={t('locationPlaceholder')}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600 min-h-[44px]"
          />
        </div>
        <div>
          <label htmlFor="checkin" className="block text-sm font-medium text-neutral-text mb-1">
            {t('checkIn')}
          </label>
          <input
            type="date"
            id="checkin"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600 min-h-[44px]"
          />
        </div>
        <div>
          <label htmlFor="checkout" className="block text-sm font-medium text-neutral-text mb-1">
            {t('checkOut')}
          </label>
          <input
            type="date"
            id="checkout"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600 min-h-[44px]"
          />
        </div>
        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-neutral-text mb-1">
            {t('guests')}
          </label>
          <select
            id="guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600 min-h-[44px]"
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>
                {num} {num > 1 ? t('guestsPlural') : t('guest')}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-5 flex justify-center">
          <Link href="/properties">
            <button
              type="submit"
              className="bg-brand-600 text-white px-8 py-3 rounded-md hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 transition-colors duration-200 min-h-[44px]"
            >
              {t('searchHostels')}
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}