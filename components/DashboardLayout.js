'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth-context';

export default function DashboardLayout({ children }) {
  const t = useTranslations('dashboard');
  const router = useRouter();
  const { logout, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { name: t('overview'), href: '/dashboard', icon: '📊' },
    { name: t('properties'), href: '/dashboard/properties', icon: '🏠' },
    { name: t('rooms'), href: '/dashboard/rooms', icon: '🛏️' },
    { name: t('bookings'), href: '/dashboard/bookings', icon: '📅' },
    { name: t('calendar'), href: '/dashboard/calendar', icon: '📆' },
    { name: t('settings'), href: '/dashboard/settings', icon: '⚙️' },
  ];

  const handleLogout = async () => {
    try {
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout API error:', error);
    }

    // Clear auth state and redirect
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-neutral-bg-muted">
            <Link href="/" className="text-xl font-bold text-brand-600">
              {t('title')}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-4 py-3 text-sm font-medium text-neutral-text-muted rounded-md hover:bg-brand-50 hover:text-brand-600 transition-colors duration-200"
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-neutral-bg-muted">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-neutral-text-muted rounded-md hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
            >
              <span className="mr-3">🚪</span>
              {t('logout')}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-neutral-bg-muted shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-neutral-text-muted hover:text-brand-600 hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-neutral-text-muted">
                {t('welcome')}
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}