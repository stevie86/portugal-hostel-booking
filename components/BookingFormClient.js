'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function BookingFormClient({
  hostel,
  initialCheckIn,
  initialCheckOut,
  initialGuests
}) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    checkIn: initialCheckIn,
    checkOut: initialCheckOut,
    guests: initialGuests,
    roomType: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    if (!formData.checkIn || !formData.checkOut || !formData.roomType) return 0;

    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    const selectedRoom = hostel.rooms.find(room => room.type === formData.roomType);
    if (!selectedRoom) return 0;

    return selectedRoom.price * nights;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.roomType) {
      alert('Please fill in all required fields');
      return;
    }

    const bookingData = {
      ...formData,
      hostelId: hostel.id,
      total: calculateTotal(),
      bookingId: Math.random().toString(36).substr(2, 9).toUpperCase()
    };

    localStorage.setItem('lastBooking', JSON.stringify(bookingData));
    router.push(`/booking/confirmation/${bookingData.bookingId}`);
  };

  const total = calculateTotal();

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Book Your Stay at {hostel.name}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Check-in *</label>
                  <input
                    type="date"
                    name="checkIn"
                    required
                    value={formData.checkIn}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Check-out *</label>
                  <input
                    type="date"
                    name="checkOut"
                    required
                    value={formData.checkOut}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Room Type *</label>
                <select
                  name="roomType"
                  required
                  value={formData.roomType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600"
                >
                  <option value="">Select room type</option>
                  {hostel.rooms.map((room, index) => (
                    <option key={index} value={room.type}>
                      {room.type} - €{room.price}/night
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-600 text-white py-3 px-4 rounded-md hover:bg-brand-700"
              >
                Complete Booking
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src={hostel.images[0]}
                  alt={hostel.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-semibold">{hostel.name}</h3>
                  <p className="text-gray-600">{hostel.location}</p>
                </div>
              </div>

              {total > 0 && (
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total</span>
                    <span className="text-xl font-bold text-brand-600">€{total}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">No hidden fees</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}