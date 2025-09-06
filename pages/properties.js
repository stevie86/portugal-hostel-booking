import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';
import { lisbonHostels } from '../lib/mockData';

export default function Properties() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Hostels in Lisbon</h1>
          <p className="text-gray-600">
            Discover the best hostels in Lisbon, from budget-friendly dorms to private rooms with stunning views.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lisbonHostels.map((hostel) => (
            <PropertyCard key={hostel.id} hostel={hostel} />
          ))}
        </div>

        {lisbonHostels.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hostels found matching your criteria.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}