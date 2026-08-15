import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

test('does not render when totalPages is 1', () => {
  const { container } = render(
    <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
  );
  expect(container.firstChild).toBeNull();
});

test('disables Previous button on first page', () => {
  render(<Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />);
  expect(screen.getByText('Previous')).toBeDisabled();
});

test('disables Next button on last page', () => {
  render(<Pagination currentPage={10} totalPages={10} onPageChange={() => {}} />);
  expect(screen.getByText('Next')).toBeDisabled();
});

test('calls onPageChange with correct page when clicking a number', () => {
  const mockChange = jest.fn();
  render(<Pagination currentPage={1} totalPages={5} onPageChange={mockChange} />);
  fireEvent.click(screen.getByText('3'));
  expect(mockChange).toHaveBeenCalledWith(3);
});

test('shows ellipsis for large page counts', () => {
  render(<Pagination currentPage={5} totalPages={20} onPageChange={() => {}} />);
  const ellipses = screen.getAllByText('...');
  expect(ellipses.length).toBeGreaterThan(0);
});

test('highlights current page as active', () => {
  render(<Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />);
  const activeButton = screen.getByText('3');
  expect(activeButton).toHaveClass('active');
});