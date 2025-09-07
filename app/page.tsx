import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import { lisbonHostels } from '../lib/mockData';

export default function Home() {
  const featuredHostels = lisbonHostels.slice(0, 3);

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-brand-50 to-teal-50 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Perfect Hostel in Lisbon
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Fair, local, hostel-first bookings — no hidden fees.
            </p>
            <SearchBar />
          </div>
        </section>

        {/* Featured Properties */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Hostels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredHostels.map((hostel) => (
                <PropertyCard key={hostel.id} hostel={hostel} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/properties">
                <button className="bg-brand-600 text-white px-6 py-3 rounded-md hover:bg-brand-700">
                  View All Properties
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}