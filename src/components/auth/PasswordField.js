import React, { useState } from 'react';
import { ReactComponent as ShowPasswordIcon } from '../../assets/images/icon-show-password.svg';
import { ReactComponent as HidePasswordIcon } from '../../assets/images/icon-hide-password.svg';

const PasswordField = ({ id, label, value, onChange, autoComplete, hint }) => {
  const [showPassword, setShowPassword] = useState(false);
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div className="auth__field">
      <label className="auth__label" htmlFor={id}>{label}</label>
      <div className="auth__password">
        <input
          id={id}
          className="auth__input auth__input--password"
          type={showPassword ? 'text' : 'password'}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          aria-describedby={hintId}
        />
        <button
          type="button"
          className="auth__toggle-password"
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
      {hint && <p id={hintId} className="auth__hint">{hint}</p>}
    </div>
  );
};

export default PasswordField;
