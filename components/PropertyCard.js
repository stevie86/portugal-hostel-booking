import React from 'react';
import Link from 'next/link';

export default function PropertyCard({ hostel }) {
  const imageUrl = hostel.images?.[0] || '/placeholder.jpg';
  const price = Math.min(...hostel.rooms.map(r => r.price));

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={imageUrl}
        alt={hostel.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">
          <Link href={`/property/${hostel.id}`} className="hover:text-brand-600">
            {hostel.name}
          </Link>
        </h3>
        <p className="text-gray-600 text-sm mb-2">{hostel.location}</p>
        <p className="text-brand-600 font-semibold">€{price}/night</p>
      </div>
    </div>
  );
}