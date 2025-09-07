import React from 'react';
import { notFound } from 'next/navigation';
import BookingConfirmationClient from '../../../../components/BookingConfirmationClient';

interface ConfirmationPageProps {
  params: {
    id: string;
  };
}

export default function ConfirmationPage({ params }: ConfirmationPageProps) {
  // In a real app, you'd fetch booking data from database
  // For now, we'll get it from localStorage (set by BookingFormClient)

  return <BookingConfirmationClient bookingId={params.id} />;
}

export async function generateMetadata({ params }: ConfirmationPageProps) {
  return {
    title: `Booking Confirmation ${params.id} - Portugal Hostel Booking`,
    description: 'Your booking has been confirmed',
  };
}