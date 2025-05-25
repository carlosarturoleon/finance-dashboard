import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import './RecurringBills.css';
import { formatDateShort } from '../utils/dateUtils';

const RecurringBills = () => {
  const { getRecurringBills, data } = useData();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  // Get all recurring bills
  const recurringBills = getRecurringBills();
  
  // Get the latest transaction date (used to determine which bills are due soon)
  const latestTransactionDate = useMemo(() => {
    const dates = data.transactions.map(t => new Date(t.date));
    return new Date(Math.max(...dates));
  }, [data.transactions]);
  
  // Filter and sort bills
  const filteredBills = useMemo(() => {
    let filtered = [...recurringBills];
    
    // Apply search filter
    if (search) {
      filtered = filtered.filter(bill => 
        bill.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => {
          const dateA = new Date(a.date).getDate();
          const dateB = new Date(b.date).getDate();
          return dateA - dateB;
        });
        break;
      case 'a-z':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'z-a':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'highest':
        filtered.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
        break;
      case 'lowest':
        filtered.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount));
        break;
      case 'latest':
      default:
        filtered.sort((a, b) => {
          const dateA = new Date(a.date).getDate();
          const dateB = new Date(b.date).getDate();
          return dateA - dateB;
        });
        break;
    }
    
    return filtered;
  }, [recurringBills, search, sortBy]);
  
  // Calculate bills statistics
  const billStats = useMemo(() => {
    const currentMonth = 8; // August
    const currentYear = 2024;
    
    const paidBills = recurringBills.filter(bill => {
      const billDate = new Date(bill.date);
      return billDate.getMonth() + 1 === currentMonth && 
             billDate.getFullYear() === currentYear;
    });
    
    const upcomingBills = recurringBills.filter(bill => {
      const billDate = new Date(bill.date);
      // If the bill month is in the future or this month but with a date in the future
      return (billDate.getMonth() + 1 > currentMonth && billDate.getFullYear() === currentYear) || 
             (billDate.getMonth() + 1 === currentMonth && billDate.getFullYear() === currentYear && 
              billDate > new Date());
    });
    
    const dueSoonBills = upcomingBills.filter(bill => {
      const billDate = new Date(bill.date);
      const daysDifference = Math.ceil((billDate - latestTransactionDate) / (1000 * 60 * 60 * 24));
      return daysDifference <= 5 && daysDifference >= 0;
    });
    
    const totalUpcoming = upcomingBills.reduce((total, bill) => total + Math.abs(bill.amount), 0);
    
    return {
      total: recurringBills.length,
      paid: paidBills.length,
      upcoming: totalUpcoming.toFixed(2),
      dueSoon: dueSoonBills.length
    };
  }, [recurringBills, latestTransactionDate]);
  
  // Sort options
  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'a-z', label: 'A to Z' },
    { value: 'z-a', label: 'Z to A' },
    { value: 'highest', label: 'Highest' },
    { value: 'lowest', label: 'Lowest' }
  ];
  
  // Check if a bill is paid for the current month
  const isBillPaid = (bill) => {
    const billDate = new Date(bill.date);
    const currentDate = new Date(latestTransactionDate);
    
    // Consider paid if the bill date is in the past compared to latest transaction
    return billDate <= currentDate;
  };
  
  // Check if a bill is due soon (within 5 days of latest transaction)
  const isBillDueSoon = (bill) => {
    const billDate = new Date(bill.date);
    const daysDifference = Math.ceil((billDate - latestTransactionDate) / (1000 * 60 * 60 * 24));
    return daysDifference <= 5 && daysDifference >= 0 && !isBillPaid(bill);
  };
  
  return (
    <div className="recurring-bills-page">
      <h1>Recurring Bills</h1>
      
      <div className="bills-summary">
        <div className="summary-card total-bills">
          <h2>Total Bills</h2>
          <p className="summary-value">{billStats.total}</p>
        </div>
        
        <div className="summary-details">
          <div className="summary-item">
            <span className="summary-label">Paid Bills</span>
            <span className="summary-number">{billStats.paid}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Upcoming</span>
            <span className="summary-number">${billStats.upcoming}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Due Soon</span>
            <span className="summary-number">{billStats.dueSoon}</span>
          </div>
        </div>
      </div>
      
      <div className="filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search bills"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        
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
      </div>
      
      <div className="bills-list">
        {filteredBills.length === 0 ? (
          <div className="no-bills">
            <p>No recurring bills found.</p>
          </div>
        ) : (
          filteredBills.map((bill, index) => (
            <div 
              key={index} 
              className={`bill-item ${isBillPaid(bill) ? 'paid' : isBillDueSoon(bill) ? 'due-soon' : ''}`}
            >
              <div className="bill-info">
                <div className="avatar">
                  {bill.name.charAt(0)}
                </div>
                <div className="bill-details">
                  <span className="bill-name">{bill.name}</span>
                  <span className="bill-category">{bill.category}</span>
                </div>
              </div>
              
              <div className="bill-date">
                <span className="date-text">
                  {formatDateShort(bill.date)}
                </span>
                <span className="status">
                  {isBillPaid(bill) ? 'Paid' : isBillDueSoon(bill) ? 'Due Soon' : 'Upcoming'}
                </span>
              </div>
              
              <div className="bill-amount">
                ${Math.abs(bill.amount).toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecurringBills;