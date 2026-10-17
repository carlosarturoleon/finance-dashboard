import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout, PasswordField } from '../components/auth';

const Login = () => {
  const navigate = useNavigate();
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
        <h1 className="auth__title">Login</h1>

        <div className="auth__fields">
          <div className="auth__field">
            <label className="auth__label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              className="auth__input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <PasswordField
            id="login-password"
            label="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="auth__submit">Login</button>

        <p className="auth__switch">
          Need to create an account?
          <Link to="/signup" className="auth__switch-link">Sign Up</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
