import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { ReactComponent as LogoLarge } from '../assets/images/logo-large.svg';
import { ReactComponent as ShowPasswordIcon } from '../assets/images/icon-show-password.svg';
import { ReactComponent as HidePasswordIcon } from '../assets/images/icon-hide-password.svg';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Front end only: there is no auth backend yet, so a submit just enters the app
  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/');
  };

  return (
    <div className="login">
      <div className="login__aside">
        <aside className="login__panel">
          <LogoLarge className="login__logo" aria-label="finance" role="img" />
          <div className="login__intro">
            <p className="login__tagline">
              Keep track of your money
              <br />
              and save for your future
            </p>
            <p className="login__description">
              Personal finance app puts you in control of your spending. Track transactions,
              set budgets, and add to savings pots easily.
            </p>
          </div>
        </aside>
      </div>

      <main className="login__main">
        <form className="login__card" onSubmit={handleSubmit} noValidate>
          <h1 className="login__title">Login</h1>

          <div className="login__fields">
            <div className="login__field">
              <label className="login__label" htmlFor="login-email">Email</label>
              <input
                id="login-email"
                className="login__input"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="login__field">
              <label className="login__label" htmlFor="login-password">Password</label>
              <div className="login__password">
                <input
                  id="login-password"
                  className="login__input login__input--password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="login__toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <HidePasswordIcon aria-hidden="true" />
                  ) : (
                    <ShowPasswordIcon aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button type="submit" className="login__submit">Login</button>

          <p className="login__signup">
            Need to create an account?
            <Link to="/signup" className="login__signup-link">Sign Up</Link>
          </p>
        </form>
      </main>
    </div>
  );
};

export default Login;
