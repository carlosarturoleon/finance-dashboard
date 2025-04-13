import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import './Budgets.css';

const Budgets = () => {
  const { data, addBudget, updateBudget, deleteBudget, getMonthlySpentByCategory, getLatestTransactionsByCategory } = useData();
  const { budgets } = data;
  
  const [isAddingBudget, setIsAddingBudget] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [isDeletingBudget, setIsDeletingBudget] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    category: '',
    maximum: '',
    theme: '#277C78' // Default theme
  });
  
  // Available categories (excluding ones already used)
  const allCategories = [
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
  
  const availableCategories = allCategories.filter(category => 
    !budgets.some(budget => budget.category === category) || 
    (currentBudget && currentBudget.category === category)
  );
  
  // Theme colors
  const themeColors = [
    { name: 'Green', color: '#277C78' },
    { name: 'Yellow', color: '#F4BC52' },
    { name: 'Cyan', color: '#82C9D7' },
    { name: 'Navy', color: '#626070' },
    { name: 'Red', color: '#E36666' },
    { name: 'Purple', color: '#826CB0' },
    { name: 'Turquoise', color: '#5AC5C5' },
    { name: 'Brown', color: '#BA9367' },
    { name: 'Magenta', color: '#AD5D79' },
    { name: 'Blue', color: '#5C7BC3' },
    { name: 'Navy Grey', color: '#4B4D58' },
    { name: 'Army Green', color: '#636E51' },
    { name: 'Pink', color: '#E2949B' },
    { name: 'Gold', color: '#D5A44A' },
    { name: 'Orange', color: '#E98852' }
  ];
  
  const handleAddBudget = () => {
    setIsAddingBudget(true);
    setFormData({
      category: availableCategories[0],
      maximum: '',
      theme: '#277C78'
    });
  };
  
  const handleEditBudget = (budget) => {
    setIsEditingBudget(true);
    setCurrentBudget(budget);
    setFormData({
      category: budget.category,
      maximum: budget.maximum,
      theme: budget.theme
    });
  };
  
  const handleDeleteBudget = (budget) => {
    setIsDeletingBudget(true);
    setCurrentBudget(budget);
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maximum' ? Number(value) : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditingBudget) {
      updateBudget(formData);
      setIsEditingBudget(false);
    } else {
      addBudget(formData);
      setIsAddingBudget(false);
    }
    
    setCurrentBudget(null);
    setFormData({
      category: '',
      maximum: '',
      theme: '#277C78'
    });
  };
  
  const handleConfirmDelete = () => {
    deleteBudget(currentBudget.category);
    setIsDeletingBudget(false);
    setCurrentBudget(null);
  };
  
  const handleCancel = () => {
    setIsAddingBudget(false);
    setIsEditingBudget(false);
    setIsDeletingBudget(false);
    setCurrentBudget(null);
  };
  
  return (
    <div className="budgets-page">
      <div className="budgets-header">
        <h1>Budgets</h1>
        <button onClick={handleAddBudget} className="add-budget-btn">
          Add New Budget
        </button>
      </div>
      
      {budgets.length === 0 ? (
        <div className="no-budgets">
          <p>You haven't created any budgets yet. Add a budget to start tracking your spending.</p>
        </div>
      ) : (
        <div className="budgets-grid">
          {budgets.map(budget => {
            const spent = getMonthlySpentByCategory(budget.category);
            const latestTransactions = getLatestTransactionsByCategory(budget.category, 3);
            const percentSpent = (spent / budget.maximum) * 100;
            
            return (
              <div className="budget-card" key={budget.category}>
                <div className="budget-header">
                  <h2>{budget.category}</h2>
                  <div className="budget-actions">
                    <button 
                      onClick={() => handleEditBudget(budget)}
                      className="icon-button edit-button"
                      aria-label={`Edit ${budget.category} budget`}
                    >
                      <span>✏️</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteBudget(budget)}
                      className="icon-button delete-button"
                      aria-label={`Delete ${budget.category} budget`}
                    >
                      <span>🗑️</span>
                    </button>
                  </div>
                </div>
                
                <div className="budget-details">
                  <div className="budget-chart" style={{ borderColor: budget.theme }}>
                    {/* Placeholder for the chart - we'll add a proper donut chart component later */}
                    <div className="chart-placeholder" style={{ backgroundColor: budget.theme }}>
                      <div className="chart-inner">
                        <span className="chart-percentage">{Math.round(percentSpent)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="budget-info">
                    <div className="budget-item">
                      <span className="label">Maximum</span>
                      <span className="value">${budget.maximum.toFixed(2)}</span>
                    </div>
                    <div className="budget-item">
                      <span className="label">Spent</span>
                      <span className="value">${spent.toFixed(2)}</span>
                    </div>
                    <div className="budget-item">
                      <span className="label">Remaining</span>
                      <span className="value">${(budget.maximum - spent).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="budget-transactions">
                  <div className="section-header">
                    <h3>Latest Spending</h3>
                    <Link to={`/transactions?category=${budget.category}`} className="see-all-link">
                      See All
                    </Link>
                  </div>
                  
                  <div className="transaction-list">
                    {latestTransactions.length > 0 ? (
                      latestTransactions.map((transaction, index) => (
                        <div className="transaction-item" key={index}>
                          <div className="transaction-info">
                            <div className="avatar">
                              {transaction.name.charAt(0)}
                            </div>
                            <div className="details">
                              <span className="name">{transaction.name}</span>
                              <span className="date">
                                {new Date(transaction.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <span className="amount negative">
                            -${Math.abs(transaction.amount).toFixed(2)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="no-transactions">No transactions for this category.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Add/Edit Budget Modal */}
      {(isAddingBudget || isEditingBudget) && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{isAddingBudget ? 'Add New Budget' : 'Edit Budget'}</h2>
            <p className="modal-subtitle">
              {isAddingBudget 
                ? 'Choose a category to set a spending budget. These categories can help you monitor spending.'
                : 'As your budgets change, feel free to update your spending limits.'}
            </p>
            
            <form onSubmit={handleSubmit} className="budget-form">
              <div className="form-group">
                <label htmlFor="category">Budget Category</label>
                <select 
                  id="category" 
                  name="category" 
                  value={formData.category}
                  onChange={handleFormChange}
                  disabled={isEditingBudget}
                  required
                >
                  {availableCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="maximum">Maximum Spend</label>
                <input
                  type="number"
                  id="maximum"
                  name="maximum"
                  value={formData.maximum}
                  onChange={handleFormChange}
                  min="1"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Theme</label>
                <div className="theme-colors">
                  {themeColors.map(theme => (
                    <div 
                      key={theme.color}
                      className={`theme-color ${formData.theme === theme.color ? 'selected' : ''}`}
                      style={{ backgroundColor: theme.color }}
                      onClick={() => setFormData(prev => ({ ...prev, theme: theme.color }))}
                      title={theme.name}
                    ></div>
                  ))}
                </div>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {isAddingBudget ? 'Add Budget' : 'Save Changes'}
                </button>
                <button type="button" onClick={handleCancel} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Budget Confirmation Modal */}
      {isDeletingBudget && currentBudget && (
        <div className="modal-backdrop">
          <div className="modal delete-modal">
            <h2>Delete '{currentBudget.category}'</h2>
            <p className="modal-subtitle">
              Are you sure you want to delete this budget? This action cannot be reversed, 
              and all the data inside it will be removed forever.
            </p>
            
            <div className="delete-actions">
              <button onClick={handleConfirmDelete} className="delete-confirm-btn">
                Yes, Confirm Deletion
              </button>
              <button onClick={handleCancel} className="cancel-btn">
                No, Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;