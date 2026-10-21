import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from '../common/Modal';
import './PotModal.css';
import './PotFormModal.css';
import './PotMoneyModal.css';

const formatCurrency = (amount) =>
  amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

const formatTarget = (amount) =>
  amount.toLocaleString('en-US', { maximumFractionDigits: 2 });

const toPercent = (amount, target) => (target > 0 ? (amount / target) * 100 : 0);

const COPY = {
  add: {
    title: name => `Add to ‘${name}’`,
    text: 'Add money to your pot to keep it separate from your main balance. As soon as you add this money, it will be deducted from your current balance.',
    label: 'Amount to Add',
    error: limit => `You can add up to $${formatCurrency(limit)}`,
    button: 'Confirm Addition',
    progressLabel: name => `${name} progress after addition`
  },
  withdraw: {
    title: name => `Withdraw from ‘${name}’`,
    text: 'Withdraw from your pot to put money back in your main balance. This will reduce the amount you have in this pot.',
    label: 'Amount to Withdraw',
    error: limit => `You can withdraw up to $${formatCurrency(limit)}`,
    button: 'Confirm Withdrawal',
    progressLabel: name => `${name} progress after withdrawal`
  }
};

/**
 * Modal to add money to or withdraw money from a pot, previewing the new amount on the progress bar
 *
 * @param {Object} props
 * @param {Object|null} props.pot - Pot to change; the modal is hidden when null
 * @param {'add'|'withdraw'} props.mode - Whether money goes into or out of the pot
 * @param {number} props.balance - Current main balance, the most that can be added
 * @param {Function} props.onConfirm - Called with the amount to add or withdraw
 * @param {Function} props.onClose - Called when the modal is closed
 */
const PotMoneyModal = ({ pot, mode = 'withdraw', balance = 0, onConfirm, onClose }) => {
  const [amountText, setAmountText] = useState('');

  // Start empty each time the modal opens
  useEffect(() => {
    if (pot) setAmountText('');
  }, [pot, mode]);

  if (!pot) return null;

  const isAdding = mode === 'add';
  const copy = COPY[mode];
  const limit = isAdding ? balance : pot.total;
  const inputId = `pot-${mode}-amount`;
  const errorId = `pot-${mode}-error`;

  const amount = Number(amountText) || 0;
  const exceedsLimit = amount > limit;
  const change = Math.min(Math.max(amount, 0), limit);
  const newTotal = isAdding ? pot.total + change : pot.total - change;

  // Dark part: what stays in the pot; colored part: what is being added or withdrawn
  const keptWidth = Math.min(100, toPercent(isAdding ? pot.total : newTotal, pot.target));
  const changeWidth = Math.min(100 - keptWidth, toPercent(change, pot.target));
  const newPercentage = toPercent(newTotal, pot.target);
  const progress = Math.min(100, newPercentage);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (amount > 0 && !exceedsLimit) {
      onConfirm(amount);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title={copy.title(pot.name)} className="pot-modal">
      <p className="pot-modal__text">{copy.text}</p>

      <div className="pot-money__summary">
        <div className="pot-money__total">
          <p className="pot-money__total-label">New Amount</p>
          <p className="pot-money__total-amount">${formatCurrency(newTotal)}</p>
        </div>

        <div className="pot-money__bar-group">
          <div
            className="pot-money__bar"
            role="progressbar"
            aria-label={copy.progressLabel(pot.name)}
            aria-valuenow={Number(progress.toFixed(2))}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="pot-money__bar-kept" style={{ width: `${keptWidth}%` }} />
            {change > 0 && (
              <div className={`pot-money__bar-change pot-money__bar-change--${mode}`} style={{ width: `${changeWidth}%` }} />
            )}
          </div>
          <div className="pot-money__bar-texts">
            <p className={`pot-money__percentage ${change > 0 ? `pot-money__percentage--${mode}` : ''}`}>
              {newPercentage.toFixed(2)}%
            </p>
            <p className="pot-money__target">Target of ${formatTarget(pot.target)}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="pot-form">
        <div className="pot-form__group">
          <label htmlFor={inputId} className="pot-form__label">{copy.label}</label>
          <div className="pot-form__field pot-form__money">
            <span className="pot-form__currency" aria-hidden="true">$</span>
            <input
              type="text"
              inputMode="decimal"
              id={inputId}
              className="pot-form__input"
              value={amountText}
              onChange={event => setAmountText(event.target.value)}
              pattern="\d*(\.\d{1,2})?"
              aria-invalid={exceedsLimit}
              aria-describedby={exceedsLimit ? errorId : undefined}
              required
            />
          </div>
          {exceedsLimit && (
            <p id={errorId} className="pot-money__error" role="alert">
              {copy.error(limit)}
            </p>
          )}
        </div>

        <button type="submit" className="pot-form__submit" disabled={amount <= 0 || exceedsLimit}>
          {copy.button}
        </button>
      </form>
    </Modal>
  );
};

PotMoneyModal.propTypes = {
  pot: PropTypes.shape({
    name: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    target: PropTypes.number.isRequired
  }),
  mode: PropTypes.oneOf(['add', 'withdraw']),
  balance: PropTypes.number,
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default PotMoneyModal;
