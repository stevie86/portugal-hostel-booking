import React from 'react';
import { render, screen } from '@testing-library/react';
import PropertyCard from '../../components/PropertyCard';

const mockHostel = {
  id: 1,
  name: 'Test Hostel',
  location: 'Lisbon, Portugal',
  price: 25,
  rating: 4.5,
  reviews: 128,
  images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
  description: 'A cozy hostel in the heart of Lisbon.',
  amenities: ['WiFi', 'Kitchen', 'Laundry']
};

describe('PropertyCard', () => {
  it('renders hostel information correctly', () => {
    render(<PropertyCard hostel={mockHostel} />);

    expect(screen.getByText('Test Hostel')).toBeInTheDocument();
    expect(screen.getByText('Lisbon, Portugal')).toBeInTheDocument();
    expect(screen.getByText('€25/night')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(128 reviews)')).toBeInTheDocument();
    expect(screen.getByText('A cozy hostel in the heart of Lisbon.')).toBeInTheDocument();
  });

  it('renders amenities', () => {
    render(<PropertyCard hostel={mockHostel} />);

    expect(screen.getByText('WiFi')).toBeInTheDocument();
    expect(screen.getByText('Kitchen')).toBeInTheDocument();
    expect(screen.getByText('Laundry')).toBeInTheDocument();
  });

  it('renders property image', () => {
    render(<PropertyCard hostel={mockHostel} />);

    const image = screen.getByAltText('Test Hostel');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image1.jpg');
  });

  it('has correct link to property details', () => {
    render(<PropertyCard hostel={mockHostel} />);

    const link = screen.getByText('Test Hostel').closest('a');
    expect(link).toHaveAttribute('href', '/property/1');
  });

  it('displays star rating icon', () => {
    render(<PropertyCard hostel={mockHostel} />);

    const starIcon = document.querySelector('svg');
    expect(starIcon).toBeInTheDocument();
  });
});