'use client'

import React from 'react';
import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  // Mock data for demonstration
  const stats = [
    { name: t('properties'), value: '2', icon: '🏠' },
    { name: t('rooms'), value: '8', icon: '🛏️' },
    { name: t('bookings'), value: '12', icon: '📅' },
    { name: 'Revenue', value: '€2,450', icon: '💰' },
  ];

  const recentBookings = [
    { id: 1, guest: 'João Silva', property: 'Lisbon Central Hostel', checkIn: '2024-09-15', status: 'confirmed' },
    { id: 2, guest: 'Maria Santos', property: 'Porto River View', checkIn: '2024-09-18', status: 'pending' },
    { id: 3, guest: 'Carlos Oliveira', property: 'Lisbon Central Hostel', checkIn: '2024-09-20', status: 'confirmed' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-text">{t('overview')}</h1>
        <p className="mt-2 text-neutral-text-muted">
          {t('welcome')}! Here's what's happening with your properties.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-3xl mr-4">{stat.icon}</div>
              <div>
                <p className="text-sm font-medium text-neutral-text-muted">{stat.name}</p>
                <p className="text-2xl font-bold text-neutral-text">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-neutral-bg-muted">
          <h2 className="text-xl font-semibold text-neutral-text">{t('bookingList')}</h2>
        </div>
        <div className="p-6">
          {recentBookings.length > 0 ? (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border border-neutral-bg-muted rounded-md">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                      <span className="text-brand-600 font-semibold">
                        {booking.guest.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-text">{booking.guest}</p>
                      <p className="text-sm text-neutral-text-muted">{booking.property}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-text-muted">{t('checkIn')}: {booking.checkIn}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {t(booking.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-text-muted text-center py-8">{t('noBookings')}</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-neutral-text mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-brand-600 text-white px-4 py-3 rounded-md hover:bg-brand-700 transition-colors duration-200">
            {t('addProperty')}
          </button>
          <button className="bg-teal-500 text-white px-4 py-3 rounded-md hover:bg-teal-600 transition-colors duration-200">
            {t('addRoom')}
          </button>
          <button className="bg-accent-500 text-white px-4 py-3 rounded-md hover:bg-orange-600 transition-colors duration-200">
            {t('setAvailability')}
          </button>
        </div>
      </div>
    </div>
  );
}