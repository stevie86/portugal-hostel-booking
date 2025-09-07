import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { lisbonHostels } from '../../lib/mockData';

export default function PropertiesPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('header.properties')} in Lisbon
          </h1>
          <p className="text-gray-600">
            Discover the best hostels in Lisbon, from budget-friendly dorms to private rooms with stunning views.
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lisbonHostels.map((hostel) => (
            <div key={hostel.id} className="bg-white rounded-md shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Property Image */}
              <div className="relative">
                <img
                  src={hostel.images[0]}
                  alt={hostel.name}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                  €{Math.min(...hostel.rooms.map(r => r.price))}/night
                </div>
              </div>

              {/* Property Details */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  <Link
                    href={`/property/${hostel.id}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {hostel.name}
                  </Link>
                </h3>

                <p className="text-gray-600 text-sm mb-2">
                  {hostel.location}
                </p>

                {/* Rating and Reviews */}
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm text-gray-600">{hostel.rating}</span>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">({hostel.reviews} reviews)</span>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm line-clamp-2 mb-3" title={hostel.description}>
                  {hostel.description}
                </p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1">
                  {hostel.amenities.slice(0, 3).map((amenity, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                    >
                      {amenity}
                    </span>
                  ))}
                  {hostel.amenities.length > 3 && (
                    <span className="text-gray-600 text-xs px-2 py-1">
                      +{hostel.amenities.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {lisbonHostels.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No hostels found.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export async function generateMetadata() {
  return {
    title: 'Hostels in Lisbon - Portugal Hostel Booking',
    description: 'Discover the best hostels in Lisbon with our curated selection of budget-friendly accommodations.',
  };
}