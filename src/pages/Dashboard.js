import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Card from '../components/common/Card';
import './Dashboard.css';
import { ReactComponent as PotIcon } from '../assets/images/icon-pot.svg';

const Dashboard = () => {
  const { data } = useData();
  const { balance, transactions, budgets, pots } = data;
  
  // Get the 5 most recent transactions
  // Sort by date (newest first) then by time (oldest first within same day)
  const recentTransactions = [...transactions]
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
  
  // Total saved in pots
  const totalSaved = pots.reduce((total, pot) => total + pot.total, 0);
  
  // Calculate amount spent in each budget category for current month
  const calculateSpent = (category) => {
    const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
    const currentYear = new Date().getFullYear();
    
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

  // Calculate percentage spent for each budget category and generate dynamic chart gradient
  const budgetsWithPercentages = useMemo(() => {
    // Calculate the percentage of each budget relative to the total budget
    return budgets.map(budget => ({
      ...budget,
      spent: calculateSpent(budget.category),
      percentage: (budget.maximum / totalBudgeted) * 100
    }));
  }, [budgets, totalBudgeted]);

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

  // Recurring bills stats - calculate from data instead of hardcoding
  const recurringBills = transactions.filter(transaction => transaction.recurring);
  
  // Paid bills (recurring transactions with negative amounts from the current month)
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const paidBills = recurringBills
    .filter(bill => 
      bill.amount < 0 && 
      new Date(bill.date).getMonth() + 1 === currentMonth &&
      new Date(bill.date).getFullYear() === currentYear
    )
    .reduce((total, bill) => total + Math.abs(bill.amount), 0);
    
  // Upcoming bills - assume these are bills that are recurring but haven't been paid this month
  // This is a simplification - in a real app, you'd have more sophisticated logic
  const upcomingBillsTotal = recurringBills
    .filter(bill => bill.amount < 0)
    .reduce((total, bill) => total + Math.abs(bill.amount), 0);
    
  // Due soon - for demo purposes, assume 30% of upcoming bills are due soon
  // In a real app, you would calculate this based on due dates
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
                  {pots.slice(0, 4).map((pot, index) => (
                    <div key={pot.name} className={`pot-item ${getCssColorClass(pot.theme)}`}>
                      <p className="pot-name">{pot.name}</p>
                      <p className="pot-amount">${pot.total.toLocaleString('en-US')}</p>
                    </div>
                  ))}
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
                    <p className="chart-amount">${totalSpent.toFixed(0)}</p>
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
                          ${budget.maximum.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
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

// Helper function to convert hex theme colors to CSS class names
const getCssColorClass = (hexColor) => {
  const colorMap = {
    '#277C78': 'green',
    '#626070': 'navy',
    '#82C9D7': 'cyan',
    '#F2CDAC': 'yellow',
    '#826CB0': 'purple'
  };
  
  return colorMap[hexColor] || 'green'; // Default to green if no match
};

export default Dashboard;