import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../../pages/index';

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />);

    expect(screen.getByText('Discover Portugal\'s Best Hostels')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<Home />);

    expect(screen.getByText(/Find affordable, authentic accommodations/)).toBeInTheDocument();
  });

  it('renders the search bar', () => {
    render(<Home />);

    expect(screen.getByText('Search Hostels')).toBeInTheDocument();
  });

  it('renders featured hostels section', () => {
    render(<Home />);

    expect(screen.getByText('Featured Hostels in Lisbon')).toBeInTheDocument();
  });

  it('renders "Why Choose Portugal Hostels?" section', () => {
    render(<Home />);

    expect(screen.getByText('Why Choose Portugal Hostels?')).toBeInTheDocument();
  });

  it('renders benefit items', () => {
    render(<Home />);

    expect(screen.getByText('Affordable Rates')).toBeInTheDocument();
    expect(screen.getByText('Prime Locations')).toBeInTheDocument();
    expect(screen.getByText('Authentic Experience')).toBeInTheDocument();
  });

  it('renders "View All Hostels" button', () => {
    render(<Home />);

    const viewAllButton = screen.getByText('View All Hostels');
    expect(viewAllButton).toBeInTheDocument();
    expect(viewAllButton.closest('a')).toHaveAttribute('href', '/properties');
  });
});