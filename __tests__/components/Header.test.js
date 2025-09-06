import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../../components/Header';

describe('Header', () => {
  it('renders the header with logo and navigation', () => {
    render(<Header />);

    // Check if logo is present
    expect(screen.getByText('Portugal Hostels')).toBeInTheDocument();

    // Check if navigation links are present
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Properties')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('has correct navigation links', () => {
    render(<Header />);

    const homeLink = screen.getByText('Home');
    const propertiesLink = screen.getByText('Properties');
    const aboutLink = screen.getByText('About');
    const contactLink = screen.getByText('Contact');

    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
    expect(propertiesLink.closest('a')).toHaveAttribute('href', '/properties');
    expect(aboutLink.closest('a')).toHaveAttribute('href', '/about');
    expect(contactLink.closest('a')).toHaveAttribute('href', '/contact');
  });

  it('renders mobile menu button', () => {
    render(<Header />);

    // Check if mobile menu button exists
    const mobileButton = screen.getByRole('button');
    expect(mobileButton).toBeInTheDocument();
  });
});