import React from 'react';
import Link from 'next/link';

export default function PropertyCard({ hostel }) {
  return (
    <div className="bg-white rounded-md shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={hostel.images[0]}
          alt={hostel.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-accent-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
          €{hostel.price}/night
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-neutral-text mb-1">
          <Link href={`/property/${hostel.id}`} className="hover:text-brand-600 transition-colors">
            {hostel.name}
          </Link>
        </h3>
        <p className="text-neutral-text-muted text-sm mb-2">{hostel.location}</p>
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-1 text-sm text-neutral-text-muted">{hostel.rating}</span>
          </div>
          <span className="ml-2 text-sm text-neutral-text-muted">({hostel.reviews} reviews)</span>
        </div>
        <p className="text-neutral-text text-sm line-clamp-2">{hostel.description}</p>
        <div className="mt-3 flex flex-wrap gap-1">
          {hostel.amenities.slice(0, 3).map((amenity, index) => (
            <span key={index} className="bg-neutral-bg-muted text-neutral-text-muted text-xs px-2 py-1 rounded">
              {amenity}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}