'use client'

import React, { useState } from 'react';

// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+351 123 456 789'
  });
  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailMarketing: false,
    smsBookings: true
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update
    console.log('Profile updated:', profile);
  };

  const handleNotificationUpdate = (field: string, value: boolean) => {
    setNotifications({ ...notifications, [field]: value });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-text">Settings</h1>
        <p className="mt-2 text-neutral-text-muted">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-neutral-text mb-6">Profile</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-text mb-1">
                First Name
              </label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-text mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-text mb-1">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-text mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-brand-600 text-white px-6 py-2 rounded-md hover:bg-brand-700 transition-colors duration-200"
          >
            Update Profile
          </button>
        </form>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-neutral-text mb-6">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-neutral-text">Email notifications for bookings</h3>
              <p className="text-sm text-neutral-text-muted">Receive email updates about new bookings and changes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emailBookings}
                onChange={(e) => handleNotificationUpdate('emailBookings', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-neutral-text">Marketing emails</h3>
              <p className="text-sm text-neutral-text-muted">Receive promotional emails and newsletters</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emailMarketing}
                onChange={(e) => handleNotificationUpdate('emailMarketing', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-neutral-text">SMS notifications for bookings</h3>
              <p className="text-sm text-neutral-text-muted">Receive SMS updates about booking confirmations</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.smsBookings}
                onChange={(e) => handleNotificationUpdate('smsBookings', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}