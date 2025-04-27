import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Card from '../components/common/Card';
import './Dashboard.css';
import { ReactComponent as PotIcon } from '../assets/images/icon-pot.svg';

const Dashboard = () => {
  const { data } = useData();
  const { balance, transactions, budgets, pots } = data;
  
  // Get the 5 most recent transactions from August 2024
  const recentTransactions = [...transactions]
    .filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() + 1 === 8 && // August
        transactionDate.getFullYear() === 2024
      );
    })
    .sort((a, b) => {
      // Convert dates to objects for easier comparison
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      // Extract just the date parts (year, month, day)
      const dayA = new Date(dateA.getFullYear(), dateA.getMonth(), dateA.getDate());
      const dayB = new Date(dateB.getFullYear(), dateB.getMonth(), dateB.getDate());
      
      // First compare by day (newest first)
      const dayComparison = dayB - dayA;
      
      if (dayComparison !== 0) {
        // Different days, return the day comparison (newest day first)
        return dayComparison;
      } else {
        // Same day, sort by time (oldest first)
        return dateA - dateB;
      }
    })
    .slice(0, 5);
  
  // Total saved in pots - Calculate by summing all pot totals
  const totalSaved = pots.reduce((total, pot) => total + pot.total, 0);
  
  // Calculate amount spent in each budget category for the latest month (August 2024)
  const calculateSpent = (category) => {
    // Hard-coded latest month (August 2024) based on the data
    const latestMonth = 8; // August
    const latestYear = 2024;
    
    return transactions
      .filter(transaction => 
        transaction.category === category && 
        transaction.amount < 0 &&
        new Date(transaction.date).getMonth() + 1 === latestMonth &&
        new Date(transaction.date).getFullYear() === latestYear
      )
      .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
  };

  // Calculate total spent across all budget categories
  const totalBudgeted = budgets.reduce((total, budget) => total + budget.maximum, 0);
  
  // Calculate total spent in budget categories
  const totalSpentInBudgetCategories = budgets
    .map(budget => budget.category)
    .reduce((total, category) => total + calculateSpent(category), 0);
    
  // Calculate pots - transactions on displayed categories
  const totalSpent = totalSaved - totalSpentInBudgetCategories;

  // Calculate percentage spent for each budget category and generate dynamic chart gradient
  const budgetsWithPercentages = useMemo(() => {
    // Calculate the percentage of each budget relative to the total budget
    return budgets.map(budget => {
      const spent = calculateSpent(budget.category);
      const remaining = budget.maximum - spent;
      // Calculate the "pots - transactions" for this category
      return {
        ...budget,
        spent: spent,
        remaining: remaining,
        percentage: (budget.maximum / totalBudgeted) * 100
      };
    });
  }, [budgets, totalBudgeted, calculateSpent]);

  // Generate dynamic conic gradient for the chart
  const chartGradient = useMemo(() => {
    let gradient = 'conic-gradient(';
    let currentPercentage = 0;
    
    budgetsWithPercentages.forEach((budget, index) => {
      const nextPercentage = currentPercentage + budget.percentage;
      
      // Add to gradient string
      gradient += `${budget.theme} ${currentPercentage}% ${nextPercentage}%`;
      
      // Add comma if not the last item
      if (index < budgetsWithPercentages.length - 1) {
        gradient += ', ';
      }
      
      currentPercentage = nextPercentage;
    });
    
    gradient += ')';
    return gradient;
  }, [budgetsWithPercentages]);

  // Recurring bills stats specifically for August 2024
  // Paid bills - from August data
  const paidBills = transactions
    .filter(transaction => 
      transaction.recurring && 
      transaction.amount < 0 &&
      new Date(transaction.date).getMonth() + 1 === 8 && // August
      new Date(transaction.date).getFullYear() === 2024
    )
    .reduce((total, bill) => total + Math.abs(bill.amount), 0);
    
  // Upcoming bills - only August recurring bills
  const upcomingBillsTotal = transactions
    .filter(transaction => 
      transaction.recurring && 
      transaction.amount < 0 &&
      new Date(transaction.date).getMonth() + 1 === 8 && // August
      new Date(transaction.date).getFullYear() === 2024
    )
    .reduce((total, bill) => total + Math.abs(bill.amount), 0);
    
  // Due soon - for August (30% of August upcoming bills)
  const dueSoon = upcomingBillsTotal * 0.3;

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
          
          <Card light className="balance-card">
            <p className="balance-title">Income</p>
            <p className="income-amount">${balance.income.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </Card>
          
          <Card light className="balance-card">
            <p className="balance-title">Expenses</p>
            <p className="expenses-amount">${balance.expenses.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </Card>
        </div>
        
        {/* Two Column Layout */}
        <div className="mid-section">
          {/* Left Column: Pots and Transactions */}
          <div className="column-container">
            {/* Pots Section */}
            <Card light className="section-card">
              <div className="section-header">
                <h2>Pots</h2>
                <Link to="/pots" className="see-details-link">
                  See Details
                  <span className="arrow-icon">›</span>
                </Link>
              </div>
              
              <div className="pots-grid">
                {/* Left column - Total Saved card */}
                <div className="total-saved-wrapper">
                  <Card noBackground light className="total-saved-card">
                    <div className="total-saved-grid">
                      <div className="icon-column">
                        <PotIcon />
                      </div>
                      <div className="content-column">
                        <p className="card-subtitle">Total Saved</p>
                        <p className="card-amount">${totalSaved.toLocaleString('en-US')}</p>
                      </div>
                    </div>
                  </Card>
                </div>
                
                {/* Right column - Pot items in 2 columns */}
                <div className="pots-list-grid">
                  {/* Display pots in specific order: Savings, Concert Ticket, Gift, New Laptop */}
                  {['Savings', 'Gift', 'Concert Ticket', 'New Laptop'].map(potName => {
                    const pot = pots.find(p => p.name === potName);
                    if (!pot) return null;
                    
                    return (
                      <div 
                        key={pot.name} 
                        className="pot-item"
                        style={{ 
                          "--pot-color": pot.theme 
                        }}
                      >
                        <p className="pot-name">{pot.name}</p>
                        <p className="pot-amount">${pot.total.toLocaleString('en-US')}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
            
            {/* Transactions Section */}
            <Card light className="section-card">
              <div className="section-header">
                <h2>Transactions</h2>
                <Link to="/transactions" className="see-details-link">
                  View All
                  <span className="arrow-icon">›</span>
                </Link>
              </div>
              
              <div className="transactions-list">
                {recentTransactions.map((transaction, index) => (
                  <div key={index} className="transaction-item">
                    <div className="transaction-details">
                      {transaction.avatar ? (
                        <div className="avatar">
                          <img 
                            src={transaction.avatar} 
                            alt={`${transaction.name}'s avatar`}
                            onError={(e) => {
                              // If image fails to load, replace with first letter
                              e.target.style.display = 'none';
                              e.target.parentNode.textContent = transaction.name.charAt(0);
                            }}
                          />
                        </div>
                      ) : (
                        <div className="avatar">
                          {transaction.name.charAt(0)}
                        </div>
                      )}
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
          
          {/* Right Column: Budgets and Recurring Bills */}
          <div className="column-container">
            
          {/* Budgets Section */}
          <Card light className="section-card">
            <div className="section-header">
              <h2>Budgets</h2>
              <Link to="/budgets" className="see-details-link">
                See Details
                <span className="arrow-icon">›</span>
              </Link>
            </div>
            
            <div className="budgets-container">
              <div className="budget-chart-container">
                <div className="budget-chart" style={{ background: chartGradient }}>
                  <div className="chart-center">
                    <p className="chart-amount">${Math.max(0, totalSpent).toFixed(0)}</p>
                    <p className="chart-label">of ${totalBudgeted.toFixed(0)} limit</p>
                  </div>
                </div>
              </div>
              
              <div className="budget-categories-container">
                <div className="budget-categories">
                  {budgetsWithPercentages.map(budget => (
                  <div key={budget.category} className="budget-category">
                      <div className="category-color" style={{ backgroundColor: budget.theme }}></div>
                      <div className="category-info">
                        <p className="category-name">{budget.category}</p>
                        <p className="category-amount">
                          ${budget.remaining.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
            
            {/* Recurring Bills Section */}
            <Card light className="section-card">
              <div className="section-header">
                <h2>Recurring Bills</h2>
                <Link to="/recurring" className="see-details-link">
                  See Details
                  <span className="arrow-icon">›</span>
                </Link>
              </div>
              
              <div className="bills-container">
                <Card noBackground accentColor="var(--color-green)" className="bill-summary-card">
                  <div className="bill-content-wrapper">
                    <p className="bill-type">Paid Bills</p>
                    <p className="bill-amount">${paidBills.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                  </div>  
                </Card>
                
                <Card noBackground accentColor="var(--color-yellow)" className="bill-summary-card">
                  <div className="bill-content-wrapper">
                    <p className="bill-type">Total Upcoming</p>
                    <p className="bill-amount">${upcomingBillsTotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                  </div>  
                </Card>
                
                <Card noBackground accentColor="var(--color-cyan)" className="bill-summary-card">
                  <div className="bill-content-wrapper">
                    <p className="bill-type">Due Soon</p>
                    <p className="bill-amount">${dueSoon.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                  </div>  
                </Card>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};



export default Dashboard;