import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout, PasswordField } from '../components/auth';

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Front end only: there is no auth backend yet, so a submit just enters the app
  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/');
  };

  return (
    <AuthLayout>
      <form className="auth__card" onSubmit={handleSubmit} noValidate>
        <h1 className="auth__title">Sign Up</h1>

        <div className="auth__fields">
          <div className="auth__field">
            <label className="auth__label" htmlFor="signup-name">Name</label>
            <input
              id="signup-name"
              className="auth__input"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="auth__field">
            <label className="auth__label" htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              className="auth__input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <PasswordField
            id="signup-password"
            label="Create Password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            hint="Passwords must be at least 8 characters"
          />
        </div>

        <button type="submit" className="auth__submit">Create Account</button>

        <p className="auth__switch">
          Already have an account?
          <Link to="/login" className="auth__switch-link">Login</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
