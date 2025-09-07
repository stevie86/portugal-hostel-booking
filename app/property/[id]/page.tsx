import React from 'react';
import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import PropertyDetailClient from '../../../components/PropertyDetailClient';
import { lisbonHostels } from '../../../lib/mockData';

interface PropertyPageProps {
  params: {
    id: string;
  };
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const t = useTranslations();
  const hostel = lisbonHostels.find(h => h.id === parseInt(params.id));

  if (!hostel) {
    notFound();
  }

  return <PropertyDetailClient hostel={hostel} />;
}

export async function generateMetadata({ params }: PropertyPageProps) {
  const hostel = lisbonHostels.find(h => h.id === parseInt(params.id));

  if (!hostel) {
    return {
      title: 'Property Not Found',
    };
  }

  return {
    title: `${hostel.name} - Portugal Hostel Booking`,
    description: hostel.description,
  };
}