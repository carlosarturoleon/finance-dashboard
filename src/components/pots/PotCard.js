import React, { useState, useRef, useEffect } from 'react';
import Card from '../common/Card';
import { ReactComponent as EllipsisIcon } from '../../assets/images/icon-ellipsis.svg';
import './PotCard.css';

const formatCurrency = (amount) =>
  amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

const formatTarget = (amount) =>
  amount.toLocaleString('en-US', { maximumFractionDigits: 2 });

/**
 * Card showing a savings pot with its progress toward the target
 *
 * @param {Object} props
 * @param {Object} props.pot - Pot with name, total, target and theme
 * @param {Function} props.onAddMoney - Called when "Add Money" is clicked
 * @param {Function} props.onWithdraw - Called when "Withdraw" is clicked
 * @param {Function} props.onEdit - Called when "Edit Pot" is chosen in the menu
 * @param {Function} props.onDelete - Called when "Delete Pot" is chosen in the menu
 */
const PotCard = ({ pot, onAddMoney, onWithdraw, onEdit, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const percentage = pot.target > 0 ? (pot.total / pot.target) * 100 : 0;
  const barWidth = Math.min(100, percentage);

  // Close the menu when clicking outside of it
  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleMenuKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsMenuOpen(false);
    }
  };

  const handleMenuAction = (action) => {
    setIsMenuOpen(false);
    action(pot);
  };

  return (
    <Card light className="pot-card">
      <div className="pot-card__header">
        <div className="pot-card__title">
          <span
            className="pot-card__dot"
            style={{ backgroundColor: pot.theme }}
            aria-hidden="true"
          />
          <h2 className="pot-card__name">{pot.name}</h2>
        </div>

        <div className="pot-card__menu" ref={menuRef} onKeyDown={handleMenuKeyDown}>
          <button
            type="button"
            className="pot-card__menu-button"
            onClick={() => setIsMenuOpen(open => !open)}
            aria-label={`Options for ${pot.name} pot`}
            aria-haspopup="true"
            aria-expanded={isMenuOpen}
          >
            <EllipsisIcon aria-hidden="true" />
          </button>

          {isMenuOpen && (
            <ul className="pot-card__menu-list" role="menu">
              <li role="none">
                <button
                  type="button"
                  role="menuitem"
                  className="pot-card__menu-item"
                  onClick={() => handleMenuAction(onEdit)}
                >
                  Edit Pot
                </button>
              </li>
              <li role="none">
                <button
                  type="button"
                  role="menuitem"
                  className="pot-card__menu-item pot-card__menu-item--danger"
                  onClick={() => handleMenuAction(onDelete)}
                >
                  Delete Pot
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>

      <div className="pot-card__progress">
        <div className="pot-card__total">
          <p className="pot-card__total-label">Total Saved</p>
          <p className="pot-card__total-amount">${formatCurrency(pot.total)}</p>
        </div>

        <div className="pot-card__bar-group">
          <div
            className="pot-card__bar"
            role="progressbar"
            aria-label={`${pot.name} progress`}
            aria-valuenow={Number(barWidth.toFixed(2))}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="pot-card__bar-fill"
              style={{ width: `${barWidth}%`, backgroundColor: pot.theme }}
            />
          </div>
          <div className="pot-card__bar-texts">
            <p className="pot-card__percentage">{percentage.toFixed(2)}%</p>
            <p className="pot-card__target">Target of ${formatTarget(pot.target)}</p>
          </div>
        </div>
      </div>

      <div className="pot-card__actions">
        <button
          type="button"
          className="pot-card__action-button"
          onClick={() => onAddMoney(pot)}
        >
          + Add Money
        </button>
        <button
          type="button"
          className="pot-card__action-button"
          onClick={() => onWithdraw(pot)}
          disabled={pot.total <= 0}
        >
          Withdraw
        </button>
      </div>
    </Card>
  );
};

export default PotCard;
