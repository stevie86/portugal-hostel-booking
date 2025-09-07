'use client'

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface Property {
  id: string;
  name: string;
}

interface Room {
  id: string;
  name: string;
  propertyId: string;
}

export default function CalendarPage() {
  const t = useTranslations('dashboard');
  const [properties, setProperties] = useState<Property[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<{[key: string]: 'available' | 'unavailable' | 'booked'}>({});
  const [pricing, setPricing] = useState<{[key: string]: number}>({});

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (selectedProperty) {
      fetchRooms(selectedProperty);
    }
  }, [selectedProperty]);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties');
      const data = await response.json();
      if (data.success) {
        setProperties(data.data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchRooms = async (propertyId: string) => {
    try {
      const response = await fetch(`/api/rooms?propertyId=${propertyId}`);
      const data = await response.json();
      if (data.success) {
        setRooms(data.data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const toggleAvailability = (date: Date) => {
    const key = formatDateKey(date);
    const currentStatus = availability[key] || 'available';
    const newStatus = currentStatus === 'available' ? 'unavailable' : 'available';
    setAvailability({ ...availability, [key]: newStatus });
  };

  const updatePricing = (date: Date, price: number) => {
    const key = formatDateKey(date);
    setPricing({ ...pricing, [key]: price });
  };

  const getStatusColor = (date: Date) => {
    const key = formatDateKey(date);
    const status = availability[key] || 'available';
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      case 'booked': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-text">{t('calendar')}</h1>
        <p className="mt-2 text-neutral-text-muted">
          Manage availability and pricing for your rooms
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-text mb-1">
              Property
            </label>
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600"
            >
              <option value="">Select Property</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-text mb-1">
              Room
            </label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600"
              disabled={!selectedProperty}
            >
              <option value="">Select Room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="bg-brand-600 text-white px-4 py-2 rounded-md hover:bg-brand-700 transition-colors duration-200"
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {/* Calendar */}
      {selectedRoom && (
        <div className="bg-white rounded-lg shadow-md">
          {/* Calendar Header */}
          <div className="px-6 py-4 border-b border-neutral-bg-muted flex justify-between items-center">
            <h2 className="text-xl font-semibold text-neutral-text">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                className="p-2 rounded-md hover:bg-neutral-bg-muted"
              >
                ‹
              </button>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                className="p-2 rounded-md hover:bg-neutral-bg-muted"
              >
                ›
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-2 text-center font-medium text-neutral-text-muted">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((date, index) => (
                <div key={index} className="min-h-[120px] border border-neutral-bg-muted p-2">
                  {date ? (
                    <div className="h-full">
                      <div className="text-sm font-medium text-neutral-text mb-2">
                        {date.getDate()}
                      </div>
                      <div className="space-y-2">
                        <button
                          onClick={() => toggleAvailability(date)}
                          className={`w-full text-xs px-2 py-1 rounded ${getStatusColor(date)}`}
                        >
                          {availability[formatDateKey(date)] || 'available'}
                        </button>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs">€</span>
                          <input
                            type="number"
                            value={pricing[formatDateKey(date)] || ''}
                            onChange={(e) => updatePricing(date, parseFloat(e.target.value) || 0)}
                            className="w-full text-xs px-1 py-1 border border-neutral-bg-muted rounded"
                            placeholder="25"
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!selectedRoom && (
        <div className="text-center py-12">
          <p className="text-neutral-text-muted">
            Select a property and room to view the availability calendar
          </p>
        </div>
      )}
    </div>
  );
}