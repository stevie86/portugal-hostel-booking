'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Header from './Header';
import Footer from './Footer';

export default function BookingFormClient({
  hostel,
  initialCheckIn,
  initialCheckOut,
  initialGuests
}) {
  const router = useRouter();
  const t = useTranslations();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    checkIn: initialCheckIn,
    checkOut: initialCheckOut,
    guests: initialGuests,
    roomType: '',
    specialRequests: '',
    paymentMethod: ''
  });

  const [currentStep, setCurrentStep] = useState(1); // 1: Guest Info, 2: Payment

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

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate guest info
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.checkIn || !formData.checkOut || !formData.roomType) {
        alert('Please fill in all required fields');
        return;
      }
      setCurrentStep(2);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    // Mock booking submission
    const bookingData = {
      ...formData,
      hostelId: hostel.id,
      total: calculateTotal(),
      bookingId: Math.random().toString(36).substr(2, 9).toUpperCase()
    };

    // Store booking data in localStorage for confirmation page
    localStorage.setItem('lastBooking', JSON.stringify(bookingData));

    router.push(`/booking/confirmation/${bookingData.bookingId}`);
  };

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('booking.bookYourStay')}</h1>
          <p className="text-gray-600">{t('booking.requestBooking')} {hostel.name}</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-4 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
              2
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-600">{t('booking.guestInformation')}</span>
            <span className="text-sm text-gray-600">{t('booking.paymentMethod')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {currentStep === 1 && (
              <>
                <h2 className="text-xl font-semibold mb-6">{t('booking.guestInformation')}</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('booking.firstName')} *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('booking.lastName')} *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('booking.email')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('booking.phone')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('booking.checkInDate')} *
                      </label>
                      <input
                        type="date"
                        id="checkIn"
                        name="checkIn"
                        required
                        value={formData.checkIn}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('booking.checkOutDate')} *
                      </label>
                      <input
                        type="date"
                        id="checkOut"
                        name="checkOut"
                        required
                        value={formData.checkOut}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('booking.numberOfGuests')} *
                    </label>
                    <select
                      id="guests"
                      name="guests"
                      required
                      value={formData.guests}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? t('search.guest') : t('search.guestsPlural')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('booking.roomType')} *
                    </label>
                    <select
                      id="roomType"
                      name="roomType"
                      required
                      value={formData.roomType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">{t('booking.roomType')}</option>
                      {hostel.rooms.map((room, index) => (
                        <option key={index} value={room.type}>
                          {room.type} - €{room.price}/{t('booking.perNight')} ({room.beds} {room.beds === 1 ? t('booking.bed') : t('booking.beds')}, {room.bathroom === 'private' ? t('booking.private') : t('booking.shared')} {t('booking.bathroom')})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('booking.specialRequests')}
                    </label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      rows={3}
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      placeholder={t('booking.specialRequestsPlaceholder')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    {t('booking.continueToPayment')}
                  </button>
                </form>
              </>
            )}

            {currentStep === 2 && (
              <>
                <h2 className="text-xl font-semibold mb-6">{t('booking.paymentMethod')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {t('booking.selectPaymentMethod')} *
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="mbway"
                          checked={formData.paymentMethod === 'mbway'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium">{t('booking.mbway')}</div>
                          <div className="text-sm text-gray-600">{t('booking.mbwayDescription')}</div>
                        </div>
                      </label>

                      <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="multibanco"
                          checked={formData.paymentMethod === 'multibanco'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium">{t('booking.multibanco')}</div>
                          <div className="text-sm text-gray-600">{t('booking.multibancoDescription')}</div>
                        </div>
                      </label>

                      <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="creditcard"
                          checked={formData.paymentMethod === 'creditcard'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium">{t('booking.creditCard')}</div>
                          <div className="text-sm text-gray-600">{t('booking.creditCardDescription')}</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      {t('booking.back')}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      {t('booking.completeBooking')}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Property Summary & Pricing */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">{t('booking.bookingSummary')}</h2>
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

                {formData.roomType && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">{t('booking.roomDetails')}</h4>
                    <p className="text-sm text-gray-600">{formData.roomType}</p>
                    <p className="text-sm text-gray-600">
                      {formData.guests} {formData.guests === 1 ? t('search.guest') : t('search.guestsPlural')}
                    </p>
                    {formData.checkIn && formData.checkOut && (
                      <p className="text-sm text-gray-600">
                        {new Date(formData.checkIn).toLocaleDateString()} - {new Date(formData.checkOut).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}

                {total > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">{t('booking.total')}</span>
                      <span className="text-2xl font-bold text-blue-600">€{total}</span>
                    </div>
                    <p className="text-xs text-gray-500">{t('booking.noHiddenFees')}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>{t('common.error')}:</strong> {t('booking.bookingRequestNote')}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}