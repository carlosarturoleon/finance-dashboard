import React from 'react';
import './Auth.css';
import { ReactComponent as LogoLarge } from '../../assets/images/logo-large.svg';

// Shared shell for the Login and Sign Up pages: illustration panel + centered form
const AuthLayout = ({ children }) => (
  <div className="auth">
    <div className="auth__aside">
      <aside className="auth__panel">
        <LogoLarge className="auth__logo" aria-label="finance" role="img" />
        <div className="auth__intro">
          <p className="auth__tagline">
            Keep track of your money
            <br />
            and save for your future
          </p>
          <p className="auth__description">
            Personal finance app puts you in control of your spending. Track transactions,
            set budgets, and add to savings pots easily.
          </p>
        </div>
      </aside>
    </div>

    <main className="auth__main">{children}</main>
  </div>
);

export default AuthLayout;
