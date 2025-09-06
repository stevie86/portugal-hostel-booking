import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';

/**
 * Properties Page Component
 * Displays a grid of hostel properties fetched from the CMS
 * Uses server-side rendering for better SEO and performance
 */
export default function Properties({ properties = [] }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Hostels in Lisbon
          </h1>
          <p className="text-gray-600">
            Discover the best hostels in Lisbon, from budget-friendly dorms to private rooms with stunning views.
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} hostel={property} />
          ))}
        </div>

        {/* Empty State */}
        {properties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No hostels found matching your criteria.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

/**
 * Server-Side Data Fetching
 * Fetches properties from the CMS API before rendering the page
 * Provides better SEO and initial page load performance
 */
export async function getServerSideProps() {
  try {
    // Fetch properties from CMS API
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/properties`, {
      // Add timeout for production stability
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!res.ok) {
      throw new Error(`API responded with status: ${res.status}`);
    }

    const data = await res.json();

    return {
      props: {
        properties: data.docs || [],
      },
    };
  } catch (error) {
    console.error('Error fetching properties:', error);

    // Return empty array on error to prevent page crash
    return {
      props: {
        properties: [],
      },
    };
  }
}