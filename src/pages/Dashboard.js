import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import './Dashboard.css';

const Dashboard = () => {
  const { data } = useData();
  const { balance, transactions, budgets, pots } = data;
  
  // Get the 5 most recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
    
  // Get recurring bills
  const recurringBills = transactions.filter(transaction => transaction.recurring);
  
  // Calculate amount spent in each budget category for current month (August 2024)
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

  return (
    <div className="dashboard">
      <h1>Overview</h1>
      
      <div className="dashboard-grid">
        {/* Balance Card */}
        <div className="card balance-card">
          <h2>Current Balance</h2>
          <p className="balance">${balance.current.toFixed(2)}</p>
          
          <div className="balance-details">
            <div className="income">
              <h3>Income</h3>
              <p className="income-amount">${balance.income.toFixed(2)}</p>
            </div>
            <div className="expenses">
              <h3>Expenses</h3>
              <p className="expenses-amount">${balance.expenses.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        {/* Pots Summary Card */}
        <div className="card pots-card">
          <div className="card-header">
            <h2>Pots</h2>
            <Link to="/pots" className="see-all-link">See Details</Link>
          </div>
          
          <div className="pots-summary">
            <h3>Total Saved</h3>
            <p className="total-saved">
              ${pots.reduce((total, pot) => total + pot.total, 0).toFixed(2)}
            </p>
            
            <div className="pots-preview">
              {pots.slice(0, 3).map(pot => (
                <div className="pot-preview" key={pot.name} style={{ borderColor: pot.theme }}>
                  <div className="pot-name">{pot.name}</div>
                  <div className="pot-amount">${pot.total.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Budgets Summary Card */}
        <div className="card budgets-card">
          <div className="card-header">
            <h2>Budgets</h2>
            <Link to="/budgets" className="see-all-link">See Details</Link>
          </div>
          
          <div className="budgets-summary">
            {budgets.slice(0, 2).map(budget => {
              const spent = calculateSpent(budget.category);
              const percentSpent = (spent / budget.maximum) * 100;
              
              return (
                <div className="budget-preview" key={budget.category}>
                  <div className="budget-header">
                    <div className="budget-name">{budget.category}</div>
                    <div className="budget-amount">${budget.maximum.toFixed(2)}</div>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${Math.min(100, percentSpent)}%`, 
                        backgroundColor: budget.theme 
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Recent Transactions Card */}
        <div className="card transactions-card">
          <div className="card-header">
            <h2>Transactions</h2>
            <Link to="/transactions" className="see-all-link">View All</Link>
          </div>
          
          <div className="recent-transactions">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction, index) => (
                  <tr key={index}>
                    <td>
                      <div className="transaction-name">
                        {/* Avatar placeholder - you'll add actual images later */}
                        <div className="avatar">
                          {transaction.name.charAt(0)}
                        </div>
                        {transaction.name}
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
        </div>
        
        {/* Recurring Bills Card */}
        <div className="card bills-card">
          <div className="card-header">
            <h2>Recurring Bills</h2>
            <Link to="/recurring" className="see-all-link">See Details</Link>
          </div>
          
          <div className="bills-summary">
            <div className="bill-item">
              <p>Total Bills</p>
              <p className="bill-count">{recurringBills.length}</p>
            </div>
            
            <div className="bill-item">
              <p>Paid Bills</p>
              <p className="bill-count">
                {recurringBills.filter(bill => {
                  const billDate = new Date(bill.date);
                  const currentDate = new Date();
                  return billDate <= currentDate;
                }).length}
              </p>
            </div>
            
            <div className="bill-item">
              <p>Due Soon</p>
              <p className="bill-count">
                {recurringBills.filter(bill => {
                  const billDate = new Date(bill.date);
                  const currentDate = new Date();
                  const fiveDaysLater = new Date();
                  fiveDaysLater.setDate(currentDate.getDate() + 5);
                  return billDate > currentDate && billDate <= fiveDaysLater;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;