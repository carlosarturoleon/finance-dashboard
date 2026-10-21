import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Modal from '../common/Modal';
import { useMobileDetection } from '../../hooks';
import { ReactComponent as CaretDownIcon } from '../../assets/images/icon-caret-down.svg';
import './PotModal.css';
import './PotFormModal.css';

export const NAME_MAX_LENGTH = 30;

export const THEME_COLORS = [
  { name: 'Green', color: '#277C78' },
  { name: 'Yellow', color: '#F4BC52' },
  { name: 'Cyan', color: '#82C9D7' },
  { name: 'Navy', color: '#626070' },
  { name: 'Red', color: '#E36666' },
  { name: 'Purple', color: '#826CB0' },
  { name: 'Turquoise', color: '#5AC5C5' },
  { name: 'Brown', color: '#BA9367' },
  { name: 'Magenta', color: '#AD5D79' },
  { name: 'Blue', color: '#5C7BC3' },
  { name: 'Navy Grey', color: '#4B4D58' },
  { name: 'Army Green', color: '#636E51' },
  { name: 'Pink', color: '#E2949B' },
  { name: 'Gold', color: '#D5A44A' },
  { name: 'Orange', color: '#E98852' }
];

const EMPTY_FORM = { name: '', target: '', theme: THEME_COLORS[0].color };

const COPY = {
  add: {
    title: 'Add New Pot',
    text: 'Create a pot to set savings targets. These can help keep you on track as you save for special purchases.',
    submit: 'Add Pot'
  },
  edit: {
    title: 'Edit Pot',
    text: 'If your saving targets change, feel free to update your pots.',
    submit: 'Save Changes'
  }
};

/**
 * Dropdown to pick a pot's theme color
 */
const ThemeSelect = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const selected = THEME_COLORS.find(theme => theme.color === value) || THEME_COLORS[0];

  // Close the list when clicking outside of it
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Keep Escape from also closing the modal while the list is open
  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && isOpen) {
      event.stopPropagation();
      setIsOpen(false);
    }
  };

  const handleSelect = (color) => {
    onChange(color);
    setIsOpen(false);
  };

  return (
    <div className="pot-form__theme" ref={containerRef} onKeyDown={handleKeyDown}>
      <button
        type="button"
        id="pot-theme"
        className="pot-form__field pot-form__theme-button"
        onClick={() => setIsOpen(open => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="pot-theme-label pot-theme"
      >
        <span className="pot-form__theme-dot" style={{ backgroundColor: selected.color }} aria-hidden="true" />
        <span className="pot-form__theme-name">{selected.name}</span>
        <CaretDownIcon className="pot-form__caret" aria-hidden="true" />
      </button>

      {isOpen && (
        <ul className="pot-form__theme-list" role="listbox" aria-labelledby="pot-theme-label">
          {THEME_COLORS.map(theme => (
            <li key={theme.color} role="none">
              <button
                type="button"
                role="option"
                aria-selected={theme.color === selected.color}
                className="pot-form__theme-option"
                onClick={() => handleSelect(theme.color)}
              >
                <span className="pot-form__theme-dot" style={{ backgroundColor: theme.color }} aria-hidden="true" />
                {theme.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

ThemeSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

/**
 * Modal with the form to add a new pot or edit an existing one
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is shown
 * @param {'add'|'edit'} props.mode - Add a new pot or edit an existing one
 * @param {Object} [props.pot] - Pot being edited
 * @param {Function} props.onSubmit - Called with { name, target, theme }
 * @param {Function} props.onClose - Called when the modal is closed
 */
const PotFormModal = ({ isOpen, mode, pot, onSubmit, onClose }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const copy = COPY[mode];
  const isMobile = useMobileDetection();

  // Reset the form each time the modal opens
  useEffect(() => {
    if (!isOpen) return;
    setForm(pot ? { name: pot.name, target: pot.target.toFixed(2), theme: pot.theme } : EMPTY_FORM);
  }, [isOpen, pot]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ name: form.name.trim(), target: Number(form.target), theme: form.theme });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={copy.title} className="pot-modal">
      <p className="pot-modal__text">{copy.text}</p>

      <form onSubmit={handleSubmit} className="pot-form">
        <div className="pot-form__group">
          <label htmlFor="pot-name" className="pot-form__label">Pot Name</label>
          <input
            type="text"
            id="pot-name"
            name="name"
            className="pot-form__field pot-form__input"
            value={form.name}
            onChange={handleChange}
            maxLength={NAME_MAX_LENGTH}
            placeholder="e.g. Rainy Days"
            aria-describedby="pot-name-count"
            required
          />
          <p id="pot-name-count" className="pot-form__hint">
            {/* The mobile design also shows the limit */}
            {NAME_MAX_LENGTH - form.name.length}{isMobile && ` of ${NAME_MAX_LENGTH}`} characters left
          </p>
        </div>

        <div className="pot-form__group">
          <label htmlFor="pot-target" className="pot-form__label">Target</label>
          <div className="pot-form__field pot-form__money">
            <span className="pot-form__currency" aria-hidden="true">$</span>
            <input
              type="text"
              inputMode="decimal"
              id="pot-target"
              name="target"
              className="pot-form__input"
              value={form.target}
              onChange={handleChange}
              // Text instead of number so the decimal point doesn't follow the browser language
              pattern="(?!0+(\.0+)?$)\d+(\.\d{1,2})?"
              title="Enter an amount greater than 0, e.g. 2000 or 110.50"
              placeholder="e.g. 2000"
              required
            />
          </div>
        </div>

        <div className="pot-form__group">
          <span id="pot-theme-label" className="pot-form__label">
            {/* The mobile design names this field differently */}
            {isMobile ? 'Color Tag' : 'Theme'}
          </span>
          <ThemeSelect
            value={form.theme}
            onChange={theme => setForm(prev => ({ ...prev, theme }))}
          />
        </div>

        <button type="submit" className="pot-form__submit">{copy.submit}</button>
      </form>
    </Modal>
  );
};

PotFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['add', 'edit']).isRequired,
  pot: PropTypes.shape({
    name: PropTypes.string,
    target: PropTypes.number,
    theme: PropTypes.string
  }),
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default PotFormModal;
