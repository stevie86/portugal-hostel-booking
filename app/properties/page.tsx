import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PropertyCard from '../../components/PropertyCard';
import { lisbonHostels } from '../../lib/mockData';

export default function PropertiesPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Hostels in Lisbon
          </h1>
          <p className="text-gray-600">
            Discover the best hostels in Lisbon, from budget-friendly dorms to private rooms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lisbonHostels.map((hostel) => (
            <PropertyCard key={hostel.id} hostel={hostel} />
          ))}
        </div>

        {lisbonHostels.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hostels found.</p>
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