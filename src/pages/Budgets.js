import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Modal from '../components/common/Modal';
import BudgetSelect from '../components/budgets/BudgetSelect';
import { formatDate } from '../utils/dateUtils';
import { sortTransactionsWithinSameDay } from '../utils/transactionUtils';
import './Budgets.css';

import { ReactComponent as EllipsisIcon } from '../assets/images/icon-ellipsis.svg';
import { ReactComponent as CaretRightIcon } from '../assets/images/icon-caret-right.svg';

const DEFAULT_THEME = '#277C78';

// Available categories for new budgets
const ALL_CATEGORIES = [
  'Entertainment',
  'Bills',
  'Groceries',
  'Dining Out',
  'Transportation',
  'Personal Care',
  'Education',
  'Lifestyle',
  'Shopping',
  'General'
];

// Theme colors
const THEME_COLORS = [
  { name: 'Green', color: '#277C78' },
  { name: 'Yellow', color: '#F2CDAC' },
  { name: 'Cyan', color: '#82C9D7' },
  { name: 'Navy', color: '#626070' },
  { name: 'Red', color: '#C94736' },
  { name: 'Purple', color: '#826CB0' },
  { name: 'Turquoise', color: '#597C7C' },
  { name: 'Brown', color: '#93674F' },
  { name: 'Magenta', color: '#934F6F' },
  { name: 'Blue', color: '#3F82B2' },
  { name: 'Navy Grey', color: '#97A0AC' },
  { name: 'Army Green', color: '#7F9161' },
  { name: 'Gold', color: '#CAB361' },
  { name: 'Orange', color: '#BE6C49' }
];

const formatMoney = (value, decimals = 2) =>
  `$${value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}`;

const formatSignedMoney = (value) =>
  `${value < 0 ? '-' : '+'}${formatMoney(Math.abs(value))}`;

// Options menu (edit / delete) shown from the ellipsis button on each budget card
const BudgetMenu = ({ category, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleSelect = (action) => {
    setIsOpen(false);
    action();
  };

  return (
    <div className="budgets__menu" ref={menuRef}>
      <button
        type="button"
        className="budgets__menu-button"
        onClick={() => setIsOpen(open => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`${category} budget options`}
      >
        <EllipsisIcon aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="budgets__menu-list" role="menu">
          <button
            type="button"
            role="menuitem"
            className="budgets__menu-item"
            onClick={() => handleSelect(onEdit)}
          >
            Edit Budget
          </button>
          <button
            type="button"
            role="menuitem"
            className="budgets__menu-item budgets__menu-item--danger"
            onClick={() => handleSelect(onDelete)}
          >
            Delete Budget
          </button>
        </div>
      )}
    </div>
  );
};

const Budgets = () => {
  const { data, addBudget, updateBudget, deleteBudget, getMonthlySpentByCategory, getTransactionsByCategory } = useData();
  const { budgets } = data;

  const [isAddingBudget, setIsAddingBudget] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [isDeletingBudget, setIsDeletingBudget] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    category: '',
    maximum: '',
    theme: DEFAULT_THEME
  });

  const availableCategories = ALL_CATEGORIES.filter(category =>
    !budgets.some(budget => budget.category === category) ||
    (currentBudget && currentBudget.category === category)
  );

  // Colors taken by other budgets can't be picked again
  const usedThemes = budgets
    .filter(budget => !currentBudget || budget.category !== currentBudget.category)
    .map(budget => budget.theme);

  // Spending per budget, plus totals for the summary chart
  const budgetsWithSpending = budgets.map(budget => ({
    ...budget,
    spent: getMonthlySpentByCategory(budget.category)
  }));

  const totalLimit = budgetsWithSpending.reduce((total, budget) => total + budget.maximum, 0);
  const totalSpent = budgetsWithSpending.reduce((total, budget) => total + budget.spent, 0);

  // Donut segments are proportional to each budget's limit
  let segmentStart = 0;
  const chartGradient = totalLimit === 0
    ? 'var(--color-beige-100)'
    : `conic-gradient(${budgetsWithSpending.map(budget => {
        const segmentEnd = segmentStart + (budget.maximum / totalLimit) * 100;
        const stop = `${budget.theme} ${segmentStart}% ${segmentEnd}%`;
        segmentStart = segmentEnd;
        return stop;
      }).join(', ')})`;

  const handleAddBudget = () => {
    setIsAddingBudget(true);
    setFormData({
      category: availableCategories[0],
      maximum: '',
      theme: (THEME_COLORS.find(theme => !usedThemes.includes(theme.color)) || THEME_COLORS[0]).color
    });
  };

  const handleEditBudget = (budget) => {
    setIsEditingBudget(true);
    setCurrentBudget(budget);
    setFormData({
      category: budget.category,
      maximum: budget.maximum.toFixed(2),
      theme: budget.theme
    });
  };

  const handleDeleteBudget = (budget) => {
    setIsDeletingBudget(true);
    setCurrentBudget(budget);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const budget = { ...formData, maximum: Number(formData.maximum) };

    if (isEditingBudget) {
      updateBudget(budget);
      setIsEditingBudget(false);
    } else {
      addBudget(budget);
      setIsAddingBudget(false);
    }

    setCurrentBudget(null);
    setFormData({
      category: '',
      maximum: '',
      theme: DEFAULT_THEME
    });
  };

  const handleConfirmDelete = () => {
    deleteBudget(currentBudget.category);
    setIsDeletingBudget(false);
    setCurrentBudget(null);
  };

  const handleCancel = () => {
    setIsAddingBudget(false);
    setIsEditingBudget(false);
    setIsDeletingBudget(false);
    setCurrentBudget(null);
  };

  return (
    <div className="budgets">
      <div className="budgets__header">
        <h1 className="budgets__heading">Budgets</h1>
        <button
          type="button"
          onClick={handleAddBudget}
          className="budgets__add-button"
          disabled={availableCategories.length === 0}
        >
          + Add New Budget
        </button>
      </div>

      {budgets.length === 0 ? (
        <div className="budgets__empty">
          <p>You haven't created any budgets yet. Add a budget to start tracking your spending.</p>
        </div>
      ) : (
        <div className="budgets__layout">
          {/* Summary: donut chart and spending per budget */}
          <section className="budgets__card budgets__summary" aria-label="Budgets summary">
            <div className="budgets__chart-wrapper">
              <div
                className="budgets__chart"
                style={{ background: chartGradient }}
                role="img"
                aria-label={`${formatMoney(totalSpent, 0)} spent of ${formatMoney(totalLimit, 0)} limit`}
              >
                <div className="budgets__chart-ring" aria-hidden="true" />
                <div className="budgets__chart-center" aria-hidden="true">
                  <span className="budgets__chart-amount">{formatMoney(totalSpent, 0)}</span>
                  <span className="budgets__chart-label">of {formatMoney(totalLimit, 0)} limit</span>
                </div>
              </div>
            </div>

            <div className="budgets__summary-details">
              <h2 className="budgets__summary-title">Spending Summary</h2>
              <ul className="budgets__summary-list">
                {budgetsWithSpending.map(budget => (
                  <li className="budgets__summary-item" key={budget.category}>
                    <span
                      className="budgets__color-bar"
                      style={{ backgroundColor: budget.theme }}
                      aria-hidden="true"
                    />
                    <span className="budgets__summary-category">{budget.category}</span>
                    <span className="budgets__summary-amount">
                      <span className="budgets__summary-spent">{formatMoney(budget.spent)}</span>
                      <span className="budgets__summary-limit">of {formatMoney(budget.maximum)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Budget cards */}
          <div className="budgets__list">
            {budgetsWithSpending.map(budget => {
              const { spent } = budget;
              const remaining = Math.max(0, budget.maximum - spent);
              const percentSpent = budget.maximum > 0
                ? Math.min(100, (spent / budget.maximum) * 100)
                : 0;
              // Same order as the Transactions page: newest day first, earliest time first within a day
              const latestTransactions = sortTransactionsWithinSameDay(
                getTransactionsByCategory(budget.category),
                'latest'
              ).slice(0, 3);

              return (
                <article className="budgets__card budget-card" key={budget.category}>
                  <div className="budget-card__header">
                    <h2 className="budget-card__title">
                      <span
                        className="budget-card__dot"
                        style={{ backgroundColor: budget.theme }}
                        aria-hidden="true"
                      />
                      {budget.category}
                    </h2>
                    <BudgetMenu
                      category={budget.category}
                      onEdit={() => handleEditBudget(budget)}
                      onDelete={() => handleDeleteBudget(budget)}
                    />
                  </div>

                  <div className="budget-card__amounts">
                    <p className="budget-card__maximum">Maximum of {formatMoney(budget.maximum)}</p>

                    <div
                      className="budget-card__bar"
                      role="progressbar"
                      aria-label={`${budget.category} spending`}
                      aria-valuemin={0}
                      aria-valuemax={budget.maximum}
                      aria-valuenow={Math.min(spent, budget.maximum)}
                    >
                      <div
                        className="budget-card__bar-fill"
                        style={{ width: `${percentSpent}%`, backgroundColor: budget.theme }}
                      />
                    </div>

                    <div className="budget-card__stats">
                      <div className="budget-card__stat">
                        <span
                          className="budgets__color-bar"
                          style={{ backgroundColor: budget.theme }}
                          aria-hidden="true"
                        />
                        <div className="budget-card__stat-texts">
                          <span className="budget-card__stat-label">Spent</span>
                          <span className="budget-card__stat-value">{formatMoney(spent)}</span>
                        </div>
                      </div>
                      <div className="budget-card__stat">
                        <span className="budgets__color-bar budgets__color-bar--neutral" aria-hidden="true" />
                        <div className="budget-card__stat-texts">
                          <span className="budget-card__stat-label">Remaining</span>
                          <span className="budget-card__stat-value">{formatMoney(remaining)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="budget-card__latest">
                    <div className="budget-card__latest-header">
                      <h3 className="budget-card__latest-title">Latest Spending</h3>
                      <Link
                        to={`/transactions?category=${encodeURIComponent(budget.category)}`}
                        className="budget-card__see-all"
                      >
                        See All
                        <span className="budget-card__see-all-icon" aria-hidden="true">
                          <CaretRightIcon />
                        </span>
                      </Link>
                    </div>

                    {latestTransactions.length > 0 ? (
                      <ul className="budget-card__transactions">
                        {latestTransactions.map((transaction, index) => (
                          <li
                            className="budget-card__transaction"
                            key={`${transaction.name}-${transaction.date}-${index}`}
                          >
                            <div className="budget-card__transaction-info">
                              <span className="budget-card__avatar" aria-hidden="true">
                                {transaction.avatar ? (
                                  <img src={transaction.avatar} alt="" loading="lazy" />
                                ) : (
                                  transaction.name.charAt(0)
                                )}
                              </span>
                              <span className="budget-card__transaction-name">{transaction.name}</span>
                            </div>
                            <div className="budget-card__transaction-meta">
                              <span
                                className={`budget-card__transaction-amount ${
                                  transaction.amount > 0 ? 'budget-card__transaction-amount--positive' : ''
                                }`}
                              >
                                {formatSignedMoney(transaction.amount)}
                              </span>
                              <time className="budget-card__transaction-date" dateTime={transaction.date}>
                                {formatDate(transaction.date)}
                              </time>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="budget-card__no-transactions">No transactions for this category yet.</p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* Add/Edit Budget Modal */}
      <Modal
        isOpen={isAddingBudget || isEditingBudget}
        onClose={handleCancel}
        title={isAddingBudget ? 'Add New Budget' : 'Edit Budget'}
        className="budgets__modal"
      >
        <p className="budgets__modal-text">
          {isAddingBudget
            ? 'Choose a category to set a spending budget. These categories can help you monitor spending.'
            : 'As your budgets change, feel free to update your spending limits.'}
        </p>

        <form onSubmit={handleSubmit} className="budgets__form">
          <div className="budgets__form-group">
            <label id="budget-category-label" htmlFor="budget-category" className="budgets__form-label">Budget Name</label>
            <BudgetSelect
              id="budget-category"
              labelId="budget-category-label"
              value={formData.category}
              options={availableCategories.map(category => ({ value: category, label: category }))}
              disabled={isEditingBudget}
              onChange={category => setFormData(prev => ({ ...prev, category }))}
            />
          </div>

          <div className="budgets__form-group">
            <label htmlFor="budget-maximum" className="budgets__form-label">Maximum Spending</label>
            <div className="budgets__form-money">
              <span className="budgets__form-currency" aria-hidden="true">$</span>
              {/* Text input so the amount keeps a "." decimal separator in every browser locale */}
              <input
                type="text"
                inputMode="decimal"
                id="budget-maximum"
                name="maximum"
                className="budgets__form-control budgets__form-control--money"
                value={formData.maximum}
                onChange={handleFormChange}
                pattern="(?!0+(\.0+)?$)\d+(\.\d{1,2})?"
                title="Enter an amount greater than 0, e.g. 2000 or 49.99"
                required
              />
            </div>
          </div>

          <div className="budgets__form-group">
            <label id="budget-theme-label" htmlFor="budget-theme" className="budgets__form-label">Color Tag</label>
            <BudgetSelect
              id="budget-theme"
              labelId="budget-theme-label"
              value={formData.theme}
              options={THEME_COLORS.map(theme => ({ value: theme.color, label: theme.name, color: theme.color }))}
              disabledValues={usedThemes}
              onChange={theme => setFormData(prev => ({ ...prev, theme }))}
            />
          </div>

          <button type="submit" className="budgets__primary-button">
            {isAddingBudget ? 'Add Budget' : 'Save Changes'}
          </button>
        </form>
      </Modal>

      {/* Delete Budget Confirmation Modal */}
      <Modal
        isOpen={isDeletingBudget && Boolean(currentBudget)}
        onClose={handleCancel}
        title={currentBudget ? `Delete ‘${currentBudget.category}’?` : ''}
        className="budgets__modal"
      >
        <p className="budgets__modal-text">
          Are you sure you want to delete this budget? This action cannot be reversed,
          and all the data inside it will be removed forever.
        </p>
        <div className="budgets__modal-actions">
          <button type="button" onClick={handleConfirmDelete} className="budgets__danger-button">
            Yes, Confirm Deletion
          </button>
          <button type="button" onClick={handleCancel} className="budgets__text-button">
            No, Go Back
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Budgets;
