import React from 'react';
import { render, screen } from '@testing-library/react';
import Properties from '../../pages/properties';

describe('Properties Page', () => {
  it('renders the page title', () => {
    render(<Properties />);

    expect(screen.getByText('Hostels in Lisbon')).toBeInTheDocument();
  });

  it('renders the page description', () => {
    render(<Properties />);

    expect(screen.getByText(/Discover the best hostels in Lisbon/)).toBeInTheDocument();
  });

  it('renders property cards', () => {
    render(<Properties />);

    // Should render multiple property cards (we have 5 mock hostels)
    const propertyCards = screen.getAllByRole('img'); // Images in property cards
    expect(propertyCards.length).toBeGreaterThan(0);
  });

  it('renders property names as links', () => {
    render(<Properties />);

    // Check if property names are rendered as links
    const propertyLinks = screen.getAllByRole('link').filter(link =>
      link.getAttribute('href')?.startsWith('/property/')
    );
    expect(propertyLinks.length).toBeGreaterThan(0);
  });
});