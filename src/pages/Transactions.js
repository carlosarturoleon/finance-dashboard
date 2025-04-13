import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import './Transactions.css';

const Transactions = () => {
  const { getFilteredTransactions } = useData();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [category, setCategory] = useState('All Transactions');
  const [currentPage, setCurrentPage] = useState(1);

  // Get filtered and paginated transactions
  const { transactions, totalPages } = getFilteredTransactions(
    search, 
    sortBy, 
    category, 
    currentPage
  );

  // Categories array from data.json
  const categories = [
    'All Transactions',
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

  return (
    <div className="transactions-page">
      <h1>Transactions</h1>
      
      <div className="filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search transactions"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <div className="sort-filter">
            <label htmlFor="sort">Sort by</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="category-filter">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="category-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="transactions-list">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Recipient/Sender</th>
              <th>Category</th>
              <th>Transaction Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>
                  <div className="transaction-name">
                    {/* Avatar placeholder - we'll add real images later */}
                    <div className="avatar">
                      {transaction.name.charAt(0)}
                    </div>
                    <span>{transaction.name}</span>
                  </div>
                </td>
                <td>{transaction.category}</td>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td className={transaction.amount < 0 ? 'negative' : 'positive'}>
                  {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="pagination">
        <button 
          onClick={handlePrevPage} 
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          Prev
        </button>
        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>
        <button 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Transactions;