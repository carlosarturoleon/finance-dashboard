import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SignUp from '../SignUp';

const renderSignUp = () =>
  render(
    <MemoryRouter initialEntries={['/signup']}>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<p>Overview page</p>} />
      </Routes>
    </MemoryRouter>
  );

describe('SignUp Page', () => {
  test('shows the form fields, the password hint and the login link', () => {
    renderSignUp();

    expect(screen.getByRole('heading', { name: 'Sign Up' })).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText('Create Password')).toHaveAttribute('type', 'password');
    expect(screen.getByLabelText('Create Password')).toHaveAccessibleDescription(
      'Passwords must be at least 8 characters'
    );
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/login');
  });

  test('toggles the password visibility', () => {
    renderSignUp();
    const password = screen.getByLabelText('Create Password');

    fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
    expect(password).toHaveAttribute('type', 'text');

    fireEvent.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(password).toHaveAttribute('type', 'password');
  });

  test('updates the fields as the user types', () => {
    renderSignUp();

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText('Create Password'), { target: { value: 'secret123' } });

    expect(screen.getByLabelText('Name')).toHaveValue('Ana');
    expect(screen.getByLabelText('Email')).toHaveValue('a@b.com');
    expect(screen.getByLabelText('Create Password')).toHaveValue('secret123');
  });

  test('goes to the overview page on submit', () => {
    renderSignUp();

    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
    expect(screen.getByText('Overview page')).toBeInTheDocument();
  });
});
