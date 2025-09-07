'use client'

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface Booking {
  id: string;
  guestName: string;
  propertyName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  total: number;
  createdAt: string;
}

export default function BookingsPage() {
  const t = useTranslations('dashboard');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // Mock data for demonstration - in real app, this would fetch from API
      const mockBookings: Booking[] = [
        {
          id: '1',
          guestName: 'João Silva',
          propertyName: 'Lisbon Central Hostel',
          roomName: 'Room 101',
          checkIn: '2024-09-15',
          checkOut: '2024-09-18',
          status: 'confirmed',
          total: 120,
          createdAt: '2024-09-01'
        },
        {
          id: '2',
          guestName: 'Maria Santos',
          propertyName: 'Porto River View',
          roomName: 'Dorm Room A',
          checkIn: '2024-09-20',
          checkOut: '2024-09-22',
          status: 'pending',
          total: 80,
          createdAt: '2024-09-05'
        },
        {
          id: '3',
          guestName: 'Carlos Oliveira',
          propertyName: 'Lisbon Central Hostel',
          roomName: 'Room 102',
          checkIn: '2024-09-25',
          checkOut: '2024-09-28',
          status: 'confirmed',
          total: 150,
          createdAt: '2024-09-08'
        }
      ];
      setBookings(mockBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (bookingId: string, newStatus: 'confirmed' | 'pending' | 'cancelled') => {
    setBookings(bookings.map(booking =>
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-neutral-text-muted">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-text">{t('bookings')}</h1>
          <p className="mt-2 text-neutral-text-muted">
            Manage your booking requests and reservations
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              filter === 'all'
                ? 'bg-brand-600 text-white'
                : 'bg-neutral-bg text-neutral-text hover:bg-neutral-bg-muted'
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              filter === 'confirmed'
                ? 'bg-green-600 text-white'
                : 'bg-neutral-bg text-neutral-text hover:bg-neutral-bg-muted'
            }`}
          >
            {t('confirmed')} ({bookings.filter(b => b.status === 'confirmed').length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              filter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-neutral-bg text-neutral-text hover:bg-neutral-bg-muted'
            }`}
          >
            {t('pending')} ({bookings.filter(b => b.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              filter === 'cancelled'
                ? 'bg-red-600 text-white'
                : 'bg-neutral-bg text-neutral-text hover:bg-neutral-bg-muted'
            }`}
          >
            {t('cancelled')} ({bookings.filter(b => b.status === 'cancelled').length})
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-neutral-bg-muted">
            <h2 className="text-xl font-semibold text-neutral-text">{t('bookingList')}</h2>
          </div>
          <div className="divide-y divide-neutral-bg-muted">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="p-6 hover:bg-neutral-bg-muted transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
                      <span className="text-brand-600 font-semibold text-lg">
                        {booking.guestName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-text">{booking.guestName}</h3>
                      <p className="text-sm text-neutral-text-muted">
                        {booking.propertyName} • {booking.roomName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm text-neutral-text-muted">{t('checkIn')}: {booking.checkIn}</p>
                        <p className="text-sm text-neutral-text-muted">{t('checkOut')}: {booking.checkOut}</p>
                        <p className="text-lg font-semibold text-neutral-text">€{booking.total}</p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {t(booking.status)}
                        </span>
                        {booking.status === 'pending' && (
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleStatusChange(booking.id, 'confirmed')}
                              className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleStatusChange(booking.id, 'cancelled')}
                              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-neutral-text-muted mb-4">{t('noBookings')}</p>
        </div>
      )}
    </div>
  );
}