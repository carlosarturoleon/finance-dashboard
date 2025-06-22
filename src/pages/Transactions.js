import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Card } from '../components/common';
import CustomDropdown from '../components/common/CustomDropdown';
import Pagination from '../components/common/Pagination';
import TransactionRow from '../components/transactions/TransactionRow';
import Modal from '../components/common/Modal';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { useMobileDetection, useDebounce } from '../hooks';
import { sortTransactionsWithinSameDay, sanitizeSearchInput } from '../utils/transactionUtils';
import { PAGINATION, DEBOUNCE_DELAYS, SORT_OPTIONS } from '../constants';
import './Transactions.css';

// Import SVG icons from assets
import { ReactComponent as SearchIcon } from '../assets/images/icon-search.svg';
import { ReactComponent as CaretDownIcon } from '../assets/images/icon-caret-down.svg';
import { ReactComponent as CaretLeftIcon } from '../assets/images/icon-caret-left.svg';
import { ReactComponent as CaretRightIcon } from '../assets/images/icon-caret-right.svg';
import { ReactComponent as SortIcon } from '../assets/images/icon-sort-mobile.svg';
import { ReactComponent as FilterIcon } from '../assets/images/icon-filter-mobile.svg';

const Transactions = () => {
  const { getFilteredTransactions, data } = useData();
  
  // State management
  const [rawSearch, setRawSearch] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [category, setCategory] = useState('All Transactions');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal states
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Custom hooks
  const isMobile = useMobileDetection();
  const debouncedSearch = useDebounce(sanitizeSearchInput(rawSearch), DEBOUNCE_DELAYS.SEARCH);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, sortBy, category]);

  // Get filtered and paginated transactions
  const { transactions, totalPages, totalCount } = getFilteredTransactions(
    debouncedSearch, 
    sortBy, 
    category, 
    currentPage,
    PAGINATION.RESULTS_PER_PAGE
  );

  // Memoized sorted transactions with extracted function
  const sortedTransactions = useMemo(() => {
    return sortTransactionsWithinSameDay(transactions, sortBy);
  }, [transactions, sortBy]);

  // Categories array from data
  const categories = useMemo(() => {
    return [
      'All Transactions',
      ...new Set(data.transactions.map(t => t.category))
    ].sort((a, b) => {
      if (a === 'All Transactions') return -1;
      if (b === 'All Transactions') return 1;
      return a.localeCompare(b);
    });
  }, [data.transactions]);

  const categoryOptions = categories.map(cat => ({ value: cat, label: cat }));

  // Modal handlers
  const handleModalClose = () => {
    setShowSortModal(false);
    setShowFilterModal(false);
  };

  const handleSortSelect = (value) => {
    setSortBy(value);
    setShowSortModal(false);
  };

  const handleCategorySelect = (value) => {
    setCategory(value);
    setShowFilterModal(false);
  };

  // Get current sort/filter labels for mobile buttons
  const currentSortLabel = SORT_OPTIONS.find(option => option.value === sortBy)?.label || 'Latest';
  const currentCategoryLabel = category.length > 12 ? `${category.substring(0, 12)}...` : category;

  // Loading state for better UX
  const isLoading = debouncedSearch !== rawSearch;

  return (
    <ErrorBoundary>
      <div className="transactions">
        <h1 className="transactions__heading">Transactions</h1>
        
        <Card light className="transactions__card">
          <div className="transactions__filters">
            <div className="transactions__search">
              <input
                type="text"
                placeholder="Search transaction"
                value={rawSearch}
                onChange={(e) => setRawSearch(e.target.value)}
                className="transactions__search-input form-control"
                aria-label="Search transactions"
                maxLength={100}
              />
              <SearchIcon className="transactions__search-icon" aria-hidden="true" />
              {isLoading && (
                <div className="transactions__search-loading" aria-label="Searching...">
                  ⋯
                </div>
              )}
            </div>
            
            {/* Desktop Filter Controls */}
            <div className="transactions__filter-controls">
              <div className="transactions__filter">
                <CustomDropdown
                  value={sortBy}
                  onChange={setSortBy}
                  options={SORT_OPTIONS}
                  placeholder="Select sort"
                  label="Sort by"
                  CaretIcon={CaretDownIcon}
                />
              </div>

              <div className="transactions__filter">
                <CustomDropdown
                  value={category}
                  onChange={setCategory}
                  options={categoryOptions}
                  placeholder="Select category"
                  label="Category"
                  CaretIcon={CaretDownIcon}
                />
              </div>            
            </div>

            {/* Mobile Filter Buttons */}
            <div className="transactions__mobile-filters">
              <button
                className="transactions__mobile-filter-btn"
                onClick={() => setShowSortModal(true)}
                aria-label={`Sort by ${currentSortLabel}`}
                type="button"
              >
                <SortIcon aria-hidden="true" />
              </button>
              
              <button
                className="transactions__mobile-filter-btn"
                onClick={() => setShowFilterModal(true)}
                aria-label={`Filter by ${currentCategoryLabel}`}
                type="button"
              >
                <FilterIcon aria-hidden="true" />
              </button>
            </div>
          </div>
          
          <div className="transactions__table-container">
            <table 
              className="transactions__table"
              role="grid"
              aria-label="Transactions table"
              aria-rowcount={totalCount + 1}
            >
              <thead>
                <tr role="row" aria-rowindex="1">
                  <th 
                    className="transactions__table-header transactions__table-header--recipient"
                    scope="col"
                    id="recipient-header"
                  >
                    Recipient / Sender
                  </th>
                  <th 
                    className="transactions__table-header transactions__table-header--category"
                    scope="col"
                    id="category-header"
                  >
                    Category
                  </th>
                  <th 
                    className="transactions__table-header transactions__table-header--date"
                    scope="col"
                    id="date-header"
                  >
                    Transaction Date
                  </th>
                  <th 
                    className="transactions__table-header transactions__table-header--amount"
                    scope="col"
                    id="amount-header"
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="transactions__no-results">
                      {isLoading ? 'Searching...' : 'No transactions found'}
                    </td>
                  </tr>
                ) : (
                  sortedTransactions.map((transaction, index) => (
                    <TransactionRow 
                      key={`${transaction.name}-${transaction.date}-${index}`}
                      transaction={transaction}
                      index={index}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              maxButtons={PAGINATION.MAX_BUTTONS}
              PrevIcon={CaretLeftIcon}
              NextIcon={CaretRightIcon}
            />
          )}
        </Card>

        {/* Sort Modal for Mobile */}
        <Modal
          isOpen={showSortModal}
          onClose={handleModalClose}
          title="Sort by"
          className="transactions__sort-modal"
        >
          <div className="transactions__filter-modal-group">
            {SORT_OPTIONS.map(option => (
              <button
                key={option.value}
                className={`transactions__filter-option ${sortBy === option.value ? 'selected' : ''}`}
                onClick={() => handleSortSelect(option.value)}
                type="button"
                aria-pressed={sortBy === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </Modal>

        {/* Category Filter Modal for Mobile */}
        <Modal
          isOpen={showFilterModal}
          onClose={handleModalClose}
          title="Filter by Category"
          className="transactions__filter-modal"
        >
          <div className="transactions__filter-modal-group">
            {categoryOptions.map(option => (
              <button
                key={option.value}
                className={`transactions__filter-option ${category === option.value ? 'selected' : ''}`}
                onClick={() => handleCategorySelect(option.value)}
                type="button"
                aria-pressed={category === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </Modal>
      </div>
    </ErrorBoundary>
  );
};

export default Transactions;