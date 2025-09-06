import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../../components/SearchBar';

describe('SearchBar', () => {
  it('renders all form fields', () => {
    render(<SearchBar />);

    expect(screen.getByLabelText('Location')).toBeInTheDocument();
    expect(screen.getByLabelText('Check-in')).toBeInTheDocument();
    expect(screen.getByLabelText('Check-out')).toBeInTheDocument();
    expect(screen.getByLabelText('Guests')).toBeInTheDocument();
    expect(screen.getByText('Search Hostels')).toBeInTheDocument();
  });

  it('has correct input types', () => {
    render(<SearchBar />);

    expect(screen.getByLabelText('Location')).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Check-in')).toHaveAttribute('type', 'date');
    expect(screen.getByLabelText('Check-out')).toHaveAttribute('type', 'date');
  });

  it('allows user input', () => {
    render(<SearchBar />);

    const locationInput = screen.getByLabelText('Location');
    fireEvent.change(locationInput, { target: { value: 'Lisbon' } });
    expect(locationInput.value).toBe('Lisbon');
  });

  it('has correct guest options', () => {
    render(<SearchBar />);

    const guestSelect = screen.getByLabelText('Guests');
    expect(guestSelect).toHaveValue('1');

    fireEvent.change(guestSelect, { target: { value: '3' } });
    expect(guestSelect).toHaveValue('3');
  });

  it('renders search button with correct styling', () => {
    render(<SearchBar />);

    const searchButton = screen.getByText('Search Hostels');
    expect(searchButton).toBeInTheDocument();
    expect(searchButton).toHaveClass('bg-blue-600');
  });
});