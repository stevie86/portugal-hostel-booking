'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import { lisbonHostels } from '../lib/mockData';

export default function BookingConfirmationClient({ bookingId }) {
  const router = useRouter();
  const [bookingData, setBookingData] = useState(null);
  const [hostel, setHostel] = useState(null);

  useEffect(() => {
    // Get booking data from localStorage
    const storedBooking = localStorage.getItem('lastBooking');
    if (storedBooking) {
      const data = JSON.parse(storedBooking);
      setBookingData(data);

      // Find the hostel
      const foundHostel = lisbonHostels.find(h => h.id === data.hostelId);
      setHostel(foundHostel);
    }
  }, []);

  if (!bookingData || !hostel) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const paymentMethodNames = {
    mbway: 'MB WAY',
    multibanco: 'Multibanco',
    creditcard: 'Credit Card'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your booking has been submitted successfully.</p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Booking Details</h2>
            <span className="text-sm text-gray-500">ID: {bookingId}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Guest Information */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Guest Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {bookingData.firstName} {bookingData.lastName}</p>
                <p><span className="font-medium">Email:</span> {bookingData.email}</p>
                {bookingData.phone && <p><span className="font-medium">Phone:</span> {bookingData.phone}</p>}
                <p><span className="font-medium">Guests:</span> {bookingData.guests}</p>
              </div>
            </div>

            {/* Stay Details */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Stay Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Check-in:</span> {new Date(bookingData.checkIn).toLocaleDateString()}</p>
                <p><span className="font-medium">Check-out:</span> {new Date(bookingData.checkOut).toLocaleDateString()}</p>
                <p><span className="font-medium">Room Type:</span> {bookingData.roomType}</p>
                <p><span className="font-medium">Payment:</span> {paymentMethodNames[bookingData.paymentMethod]}</p>
              </div>
            </div>
          </div>

          {bookingData.specialRequests && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-2">Special Requests</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{bookingData.specialRequests}</p>
            </div>
          )}
        </div>

        {/* Property Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={hostel.images[0]}
              alt={hostel.name}
              className="w-20 h-20 object-cover rounded-md"
            />
            <div>
              <h3 className="text-lg font-semibold">{hostel.name}</h3>
              <p className="text-gray-600">{hostel.location}</p>
              <div className="flex items-center mt-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < Math.floor(hostel.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-sm text-gray-600">({hostel.reviews} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Pricing Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Room Rate</span>
              <span>€{bookingData.total}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total</span>
              <span className="text-blue-600">€{bookingData.total}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">No hidden fees - what you see is what you pay</p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">What Happens Next?</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>1. You'll receive a confirmation email with your booking details</p>
            <p>2. The hostel will review and confirm your booking</p>
            <p>3. Payment will be processed via {paymentMethodNames[bookingData.paymentMethod]}</p>
            <p>4. You'll receive check-in instructions from the hostel</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push('/')}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Book Another Stay
          </button>
          <button
            onClick={() => router.push(`/property/${hostel.id}`)}
            className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          >
            View Property
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}