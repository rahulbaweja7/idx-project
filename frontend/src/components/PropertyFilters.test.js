import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PropertyFilters from './PropertyFilters';

test('renders all filter inputs', () => {
  render(<PropertyFilters onSearch={() => {}} />);
  expect(screen.getByPlaceholderText('City')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('ZIP Code')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Min Price')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Max Price')).toBeInTheDocument();
  expect(screen.getByText('Any Beds')).toBeInTheDocument();
  expect(screen.getByText('Any Baths')).toBeInTheDocument();
});

test('calls onSearch with correct values on submit', () => {
  const mockSearch = jest.fn();
  render(<PropertyFilters onSearch={mockSearch} />);
  fireEvent.change(screen.getByPlaceholderText('City'), {
    target: { name: 'city', value: 'Beverly Hills' }
  });
  fireEvent.click(screen.getByText('Search'));
  expect(mockSearch).toHaveBeenCalledWith(
    expect.objectContaining({ city: 'Beverly Hills' })
  );
});

test('clear button resets form and calls onSearch with empty object', () => {
  const mockSearch = jest.fn();
  render(<PropertyFilters onSearch={mockSearch} />);
  fireEvent.change(screen.getByPlaceholderText('City'), {
    target: { name: 'city', value: 'Beverly Hills' }
  });
  fireEvent.click(screen.getByText('Clear'));
  expect(screen.getByPlaceholderText('City').value).toBe('');
  expect(mockSearch).toHaveBeenCalledWith({});
});