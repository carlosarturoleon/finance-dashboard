import React, { useState, useEffect } from 'react';
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
  const [orderedTransactions, setOrderedTransactions] = useState([]);

  // Get filtered and paginated transactions
  const { transactions, totalPages, totalCount } = getFilteredTransactions(
    search, 
    sortBy, 
    category, 
    currentPage,
    resultsPerPage
  );

  // Secondary sort: within each day, sort transactions from oldest to newest
  useEffect(() => {
    const sortTransactionsWithinSameDay = (transactions) => {
      // Group transactions by date (just the day part, not time)
      const transactionsByDate = {};
      
      transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        
        if (!transactionsByDate[dateKey]) {
          transactionsByDate[dateKey] = [];
        }
        
        transactionsByDate[dateKey].push(transaction);
      });
      
      // For each date group, sort transactions by time (oldest to newest)
      Object.keys(transactionsByDate).forEach(dateKey => {
        transactionsByDate[dateKey].sort((a, b) => {
          const timeA = new Date(a.date).getTime();
          const timeB = new Date(b.date).getTime();
          return timeA - timeB; // Ascending order (oldest first)
        });
      });
      
      // Reconstruct the array while maintaining the primary sort order
      const result = [];
      const sortedDateKeys = Object.keys(transactionsByDate).sort((a, b) => {
        // Sort date keys based on primary sort criteria
        // For 'latest', sort in descending order
        if (sortBy === 'latest') {
          return new Date(b.split('-').join('/')) - new Date(a.split('-').join('/'));
        }
        // For 'oldest', sort in ascending order
        if (sortBy === 'oldest') {
          return new Date(a.split('-').join('/')) - new Date(b.split('-').join('/'));
        }
        // Default to descending order
        return new Date(b.split('-').join('/')) - new Date(a.split('-').join('/'));
      });
      
      sortedDateKeys.forEach(dateKey => {
        transactionsByDate[dateKey].forEach(transaction => {
          result.push(transaction);
        });
      });
      
      return result;
    };

    setOrderedTransactions(sortTransactionsWithinSameDay(transactions));
  }, [transactions, sortBy]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy, category]);

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
              <div className="dropdown">
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="dropdown-select"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <CaretDownIcon className="dropdown-icon" />
              </div>
            </div>
            
            <div className="category-filter">
              <span className="filter-label">Category</span>
              <div className="dropdown">
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="dropdown-select"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <CaretDownIcon className="dropdown-icon" />
              </div>
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
              {orderedTransactions.map((transaction, index) => (
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