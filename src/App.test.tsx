import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('Loading screen is shown on initial load', () => {
  render(<App />);
  const loading = screen.getByText(/loading/i);
  expect(loading).toBeInTheDocument();
});
