import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Card from '../components/common/Card';
import './Dashboard.css';

const Dashboard = () => {
  const { data } = useData();
  const { balance, transactions, budgets, pots } = data;
  
  // Get the 5 most recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  
  // Total saved in pots
  const totalSaved = pots.reduce((total, pot) => total + pot.total, 0);
  
  // Calculate amount spent in each budget category for current month
  const calculateSpent = (category) => {
    const currentMonth = 8; // August
    const currentYear = 2024;
    
    return transactions
      .filter(transaction => 
        transaction.category === category && 
        transaction.amount < 0 &&
        new Date(transaction.date).getMonth() + 1 === currentMonth &&
        new Date(transaction.date).getFullYear() === currentYear
      )
      .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
  };

  // Calculate total spent across all budget categories
  const totalBudgeted = budgets.reduce((total, budget) => total + budget.maximum, 0);
  const totalSpent = budgets.reduce((total, budget) => total + calculateSpent(budget.category), 0);

  // Recurring bills stats
  const recurringBills = transactions.filter(transaction => transaction.recurring);
  const paidBills = 190.00; // Hardcoded for demo, should be calculated
  const upcomingBills = 194.98; // Hardcoded for demo, should be calculated
  const dueSoon = 59.98; // Hardcoded for demo, should be calculated

  return (
    <div className="dashboard">
      <h1>Overview</h1>
      
      <div className="dashboard-grid">
        {/* Balance Section */}
        <div className="balance-section">
          <Card dark className="balance-card">
            <p className="balance-title">Current Balance</p>
            <p className="balance-amount">${balance.current.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </Card>
          
          <Card className="balance-card">
            <p className="balance-title">Income</p>
            <p className="income-amount">${balance.income.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </Card>
          
          <Card className="balance-card">
            <p className="balance-title">Expenses</p>
            <p className="expenses-amount">${balance.expenses.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </Card>
        </div>
        
        {/* Pots and Budgets Section */}
        <div className="mid-section">
          {/* Pots Section */}
          <div className="section-container">
            <div className="section-header">
              <h2>Pots</h2>
              <Link to="/pots" className="see-details-link">
                See Details
                <span className="arrow-icon">›</span>
              </Link>
            </div>
            
            <div className="pots-container">
              <Card light className="total-saved-card">
                <div className="icon-container">
                  <div className="pot-icon">💰</div>
                </div>
                <p className="card-subtitle">Total Saved</p>
                <p className="card-amount">${totalSaved.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
              </Card>
              
              <div className="pots-list">
                {pots.slice(0, 4).map(pot => (
                  <div key={pot.name} className="pot-item" style={{ borderColor: pot.theme }}>
                    <p className="pot-name">{pot.name}</p>
                    <p className="pot-amount">${pot.total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Budgets Section */}
          <div className="section-container">
            <div className="section-header">
              <h2>Budgets</h2>
              <Link to="/budgets" className="see-details-link">
                See Details
                <span className="arrow-icon">›</span>
              </Link>
            </div>
            
            <div className="budgets-container">
              <div className="budget-chart">
                <div className="chart-center">
                  <p className="chart-amount">${totalSpent.toFixed(0)}</p>
                  <p className="chart-label">of ${totalBudgeted.toFixed(0)} limit</p>
                </div>
              </div>
              
              <div className="budget-categories">
                {budgets.map(budget => {
                  const spent = calculateSpent(budget.category);
                  return (
                    <div key={budget.category} className="budget-category">
                      <div className="category-color" style={{ backgroundColor: budget.theme }}></div>
                      <p className="category-name">{budget.category}</p>
                      <p className="category-amount">${budget.maximum.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Transactions Section */}
        <div className="section-container transactions-section">
          <div className="section-header">
            <h2>Transactions</h2>
            <Link to="/transactions" className="see-details-link">
              View All
              <span className="arrow-icon">›</span>
            </Link>
          </div>
          
          <Card noBackground>
            <div className="transactions-list">
              {recentTransactions.map((transaction, index) => (
                <div key={index} className="transaction-item">
                  <div className="transaction-details">
                    <div className="avatar">
                      {/* Use first letter as placeholder, you'll replace with actual images */}
                      {transaction.name.charAt(0)}
                    </div>
                    <p className="transaction-name">{transaction.name}</p>
                  </div>
                  
                  <div className="transaction-info">
                    <p className={`transaction-amount ${transaction.amount < 0 ? 'negative' : 'positive'}`}>
                      {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </p>
                    <p className="transaction-date">
                      {new Date(transaction.date).toLocaleDateString('en-US', { 
                        day: 'numeric', 
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Recurring Bills Section */}
        <div className="section-container bills-section">
          <div className="section-header">
            <h2>Recurring Bills</h2>
            <Link to="/recurring" className="see-details-link">
              See Details
              <span className="arrow-icon">›</span>
            </Link>
          </div>
          
          <div className="bills-summary">
            <Card light accentColor="var(--color-green)" className="bill-summary-card">
              <p className="bill-type">Paid Bills</p>
              <p className="bill-amount">${paidBills.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            </Card>
            
            <Card light accentColor="var(--color-yellow)" className="bill-summary-card">
              <p className="bill-type">Total Upcoming</p>
              <p className="bill-amount">${upcomingBills.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            </Card>
            
            <Card light accentColor="var(--color-cyan)" className="bill-summary-card">
              <p className="bill-type">Due Soon</p>
              <p className="bill-amount">${dueSoon.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;