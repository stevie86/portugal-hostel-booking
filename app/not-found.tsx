import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-6xl mb-4">🏨</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Where would you like to go?</h3>
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              🏠 Go to Homepage
            </Link>
            <Link
              href="/rooms"
              className="block w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 font-medium"
            >
              🛏️ View Available Rooms
            </Link>
            <Link
              href="/admin"
              className="block w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition-colors duration-200 font-medium"
            >
              ⚙️ Admin Dashboard
            </Link>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Need Help?</h4>
          <p className="text-sm text-blue-800">
            If you believe this is an error, please check the URL or contact support.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Portugal Hostel Booking Platform</p>
        </div>
      </div>
    </div>
  );
}