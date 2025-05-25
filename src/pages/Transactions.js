import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Card } from '../components/common';
import CustomDropdown from '../components/common/CustomDropdown';
import Pagination from '../components/common/Pagination';
import TransactionRow from '../components/transactions/TransactionRow';
import './Transactions.css';

// Import SVG icons from assets
import { ReactComponent as SearchIcon } from '../assets/images/icon-search.svg';
import { ReactComponent as CaretDownIcon } from '../assets/images/icon-caret-down.svg';
import { ReactComponent as CaretLeftIcon } from '../assets/images/icon-caret-left.svg';
import { ReactComponent as CaretRightIcon } from '../assets/images/icon-caret-right.svg';
import { ReactComponent as SortIcon } from '../assets/images/icon-sort-mobile.svg';
import { ReactComponent as FilterIcon } from '../assets/images/icon-filter-mobile.svg';

// Constants
const RESULTS_PER_PAGE = 10;
const MAX_PAGINATION_BUTTONS = 5;

const Transactions = () => {
  const { getFilteredTransactions, data } = useData();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [category, setCategory] = useState('All Transactions');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Mobile filter modal states
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy, category]);

  // Get filtered and paginated transactions
  const { transactions, totalPages, totalCount } = getFilteredTransactions(
    search, 
    sortBy, 
    category, 
    currentPage,
    RESULTS_PER_PAGE
  );

  const sortedTransactions = useMemo(() => {
    const sortTransactionsWithinSameDay = (transactionsToSort) => {
      const transactionsByDate = {};
      
      transactionsToSort.forEach(transaction => {
        const date = new Date(transaction.date);
        const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        
        if (!transactionsByDate[dateKey]) {
          transactionsByDate[dateKey] = [];
        }
        
        transactionsByDate[dateKey].push(transaction);
      });
      
      Object.keys(transactionsByDate).forEach(dateKey => {
        transactionsByDate[dateKey].sort((a, b) => {
          const timeA = new Date(a.date).getTime();
          const timeB = new Date(b.date).getTime();
          return timeA - timeB;
        });
      });
      
      const result = [];
      const sortedDateKeys = Object.keys(transactionsByDate).sort((a, b) => {
        if (sortBy === 'latest') {
          return new Date(b.split('-').join('/')) - new Date(a.split('-').join('/'));
        }
        if (sortBy === 'oldest') {
          return new Date(a.split('-').join('/')) - new Date(b.split('-').join('/'));
        }
        return new Date(b.split('-').join('/')) - new Date(a.split('-').join('/'));
      });
      
      sortedDateKeys.forEach(dateKey => {
        transactionsByDate[dateKey].forEach(transaction => {
          result.push(transaction);
        });
      });
      
      return result;
    };
    
    return sortTransactionsWithinSameDay(transactions);
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

  // Sort options
  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'a-z', label: 'A to Z' },
    { value: 'z-a', label: 'Z to A' },
    { value: 'highest', label: 'Highest' },
    { value: 'lowest', label: 'Lowest' }
  ];

  const categoryOptions = categories.map(cat => ({ value: cat, label: cat }));

  // Handle modal close
  const handleModalClose = () => {
    setShowSortModal(false);
    setShowFilterModal(false);
  };

  // Handle sort selection in modal
  const handleSortSelect = (value) => {
    setSortBy(value);
    setShowSortModal(false);
  };

  // Handle category selection in modal
  const handleCategorySelect = (value) => {
    setCategory(value);
    setShowFilterModal(false);
  };

  // Get current sort/filter labels for mobile buttons
  const currentSortLabel = sortOptions.find(option => option.value === sortBy)?.label || 'Latest';
  const currentCategoryLabel = category.length > 12 ? `${category.substring(0, 12)}...` : category;

  // Handle keyboard events for modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleModalClose();
      }
    };

    if (showSortModal || showFilterModal) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showSortModal, showFilterModal]);

  return (
    <div className="transactions">
      <h1 className="transactions__heading">Transactions</h1>
      
      <Card light className="transactions__card">
        <div className="transactions__filters">
          <div className="transactions__search">
            <input
              type="text"
              placeholder="Search transaction"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="transactions__search-input form-control"
              aria-label="Search transactions"
            />
            <SearchIcon className="transactions__search-icon" aria-hidden="true" />
          </div>
          
          {/* Desktop Filter Controls */}
          <div className="transactions__filter-controls">
            <div className="transactions__filter">
              <CustomDropdown
                value={sortBy}
                onChange={setSortBy}
                options={sortOptions}
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
            >
              <SortIcon aria-hidden="true" />
            </button>
            
            <button
              className="transactions__mobile-filter-btn"
              onClick={() => setShowFilterModal(true)}
              aria-label={`Filter by ${currentCategoryLabel}`}
            >
              <FilterIcon aria-hidden="true" />
            </button>
          </div>
        </div>
        
        <div className="transactions__table-container">
          <table className="transactions__table">
            <thead>
              <tr>
                <th className="transactions__table-header transactions__table-header--recipient">
                  Recipient / Sender
                </th>
                <th className="transactions__table-header transactions__table-header--category">
                  Category
                </th>
                <th className="transactions__table-header transactions__table-header--date">
                  Transaction Date
                </th>
                <th className="transactions__table-header transactions__table-header--amount">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((transaction, index) => (
                <TransactionRow 
                  key={`${transaction.name}-${transaction.date}-${index}`}
                  transaction={transaction}
                  index={index}
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            maxButtons={MAX_PAGINATION_BUTTONS}
            PrevIcon={CaretLeftIcon}
            NextIcon={CaretRightIcon}
          />
        )}
      </Card>

      {/* Sort Modal for Mobile */}
      <div 
        className={`transactions__filter-modal ${showSortModal ? 'transactions__filter-modal--active' : ''}`}
        onClick={(e) => e.target === e.currentTarget && handleModalClose()}
      >
        <div className="transactions__filter-modal-content">
          <div className="transactions__filter-modal-header">
            <h3 className="transactions__filter-modal-title">Sort by</h3>
            <button 
              className="transactions__filter-modal-close"
              onClick={handleModalClose}
              aria-label="Close sort modal"
            >
              ×
            </button>
          </div>
          
          <div className="transactions__filter-modal-group">
            {sortOptions.map(option => (
              <div 
                key={option.value}
                className={`transactions__filter-option ${sortBy === option.value ? 'selected' : ''}`}
                onClick={() => handleSortSelect(option.value)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSortSelect(option.value);
                  }
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Filter Modal for Mobile */}
      <div 
        className={`transactions__filter-modal ${showFilterModal ? 'transactions__filter-modal--active' : ''}`}
        onClick={(e) => e.target === e.currentTarget && handleModalClose()}
      >
        <div className="transactions__filter-modal-content">
          <div className="transactions__filter-modal-header">
            <h3 className="transactions__filter-modal-title">Filter by Category</h3>
            <button 
              className="transactions__filter-modal-close"
              onClick={handleModalClose}
              aria-label="Close filter modal"
            >
              ×
            </button>
          </div>
          
          <div className="transactions__filter-modal-group">
            {categoryOptions.map(option => (
              <div 
                key={option.value}
                className={`transactions__filter-option ${category === option.value ? 'selected' : ''}`}
                onClick={() => handleCategorySelect(option.value)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCategorySelect(option.value);
                  }
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;