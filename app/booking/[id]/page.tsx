import React from 'react';
import { notFound } from 'next/navigation';
import BookingFormClient from '../../../components/BookingFormClient';
import { lisbonHostels } from '../../../lib/mockData';

interface BookingPageProps {
  params: {
    id: string;
  };
  searchParams: {
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  };
}

export default function BookingPage({ params, searchParams }: BookingPageProps) {
  const hostel = lisbonHostels.find(h => h.id === parseInt(params.id));

  if (!hostel) {
    notFound();
  }

  return (
    <BookingFormClient
      hostel={hostel}
      initialCheckIn={searchParams.checkIn || ''}
      initialCheckOut={searchParams.checkOut || ''}
      initialGuests={parseInt(searchParams.guests || '1')}
    />
  );
}

export async function generateMetadata({ params }: BookingPageProps) {
  const hostel = lisbonHostels.find(h => h.id === parseInt(params.id));

  if (!hostel) {
    return {
      title: 'Booking Not Found',
    };
  }

  return {
    title: `Book ${hostel.name} - Portugal Hostel Booking`,
    description: `Book your stay at ${hostel.name} in ${hostel.location}`,
  };
}