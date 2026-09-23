import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders the sign-in screen when no session exists', () => {
  localStorage.removeItem('grocery_tracker_user');
  render(<BrowserRouter><App /></BrowserRouter>);
  expect(screen.getByText('Grocery Tracker Pro')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
});
