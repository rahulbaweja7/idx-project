import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ListingsPage from './pages/ListingsPage';

test('renders property listings heading', () => {
  render(
    <MemoryRouter>
      <ListingsPage />
    </MemoryRouter>
  );
  const heading = screen.getByText(/property listings/i);
  expect(heading).toBeInTheDocument();
});