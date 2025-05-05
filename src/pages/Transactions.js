import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Card } from '../components/common';
import './Transactions.css';

// Import SVG icons from assets
import { ReactComponent as SearchIcon } from '../assets/images/icon-search.svg';
import { ReactComponent as CaretDownIcon } from '../assets/images/icon-caret-down.svg';
import { ReactComponent as CaretLeftIcon } from '../assets/images/icon-caret-left.svg';
import { ReactComponent as CaretRightIcon } from '../assets/images/icon-caret-right.svg';

const Transactions = () => {
  const { getFilteredTransactions, data } = useData();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [category, setCategory] = useState('All Transactions');
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(10);

  // Get filtered and paginated transactions
  const { transactions, totalPages, totalCount } = getFilteredTransactions(
    search, 
    sortBy, 
    category, 
    currentPage,
    resultsPerPage
  );

  const CustomDropdown = ({ value, onChange, options, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
  
    const selectedOption = options.find(option => option.value === value);
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
  
    const handleOptionClick = (optionValue) => {
      onChange(optionValue);
      setIsOpen(false);
    };
  
    return (
      <div className="custom-dropdown" ref={dropdownRef}>
        <div className="dropdown-wrapper">
          <div 
            className="selected-option" 
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>{selectedOption ? selectedOption.label : placeholder}</span>
            <CaretDownIcon />
          </div>
          
          <div className={`dropdown-menu ${isOpen ? 'active' : ''}`}>
            {options.map(option => (
              <div className={`dropdown-menu ${isOpen ? 'active' : ''}`}>
                {options.map(option => (
                  <div
                    key={option.value}
                    className={`dropdown-item ${value === option.value ? 'selected' : ''}`}
                    onClick={() => handleOptionClick(option.value)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };  

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
  const categories = [
    'All Transactions',
    ...new Set(data.transactions.map(t => t.category))
  ].sort((a, b) => {
    if (a === 'All Transactions') return -1;
    if (b === 'All Transactions') return 1;
    return a.localeCompare(b);
  });

  // Sort options
  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'a-z', label: 'A to Z' },
    { value: 'z-a', label: 'Z to A' },
    { value: 'highest', label: 'Highest' },
    { value: 'lowest', label: 'Lowest' }
  ];

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  // Generate pagination buttons
  const getPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5; // Maximum number of buttons to show
    
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button 
          key={i} 
          onClick={() => handlePageClick(i)}
          className={i === currentPage ? 'active' : ''}
        >
          {i}
        </button>
      );
    }
    
    return buttons;
  };

  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="transactions-page">
      <h1>Transactions</h1>
      
      <Card light className="transactions-card">
        <div className="filters-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search transaction"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <SearchIcon className="search-icon" />
          </div>
          
          <div className="filter-controls">
            <div className="sort-filter">
              <span className="filter-label">Sort by</span>
              <CustomDropdown
                value={sortBy}
                onChange={setSortBy}
                options={sortOptions}
                placeholder="Select sort"
              />
            </div>

            <div className="category-filter">
              <span className="filter-label">Category</span>
              <CustomDropdown
                value={category}
                onChange={setCategory}
                options={categories.map(cat => ({ value: cat, label: cat }))}
                placeholder="Select category"
              />
            </div>            
          </div>
        </div>
        
        <div className="transactions-table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th className="recipient-column">Recipient / Sender</th>
                <th className="category-column">Category</th>
                <th className="date-column">Transaction Date</th>
                <th className="amount-column">Amount</th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((transaction, index) => (
                <tr key={`${transaction.name}-${transaction.date}-${index}`}>
                  <td className="recipient-column">
                    <div className="transaction-name">
                      <div className="avatar">
                        {transaction.avatar ? (
                          <img 
                            src={transaction.avatar} 
                            alt={`${transaction.name}'s avatar`}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentNode.textContent = transaction.name.charAt(0);
                            }}
                          />
                        ) : (
                          transaction.name.charAt(0)
                        )}
                      </div>
                      <span className="name-text">{transaction.name}</span>
                    </div>
                  </td>
                  <td className="category-column">{transaction.category}</td>
                  <td className="date-column">{formatDate(transaction.date)}</td>
                  <td className={`amount-column ${transaction.amount < 0 ? 'negative' : 'positive'}`}>
                    {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {totalPages > 0 && (
          <div className="pagination">
            <button 
              onClick={handlePrevPage} 
              disabled={currentPage === 1}
              className="pagination-control prev-btn"
              aria-label="Previous page"
            >
              <CaretLeftIcon />
              <span>Prev</span>
            </button>
            
            <div className="pagination-buttons">
              {getPaginationButtons()}
            </div>
            
            <button 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages}
              className="pagination-control next-btn"
              aria-label="Next page"
            >
              <span>Next</span>
              <CaretRightIcon />
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Transactions;