import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import './Pots.css';

const Pots = () => {
  const { data, addPot, updatePot, deletePot, addToPot, withdrawFromPot } = useData();
  const { pots } = data;
  
  const [isAddingPot, setIsAddingPot] = useState(false);
  const [isEditingPot, setIsEditingPot] = useState(false);
  const [isDeletingPot, setIsDeletingPot] = useState(false);
  const [isAddingMoney, setIsAddingMoney] = useState(false);
  const [isWithdrawingMoney, setIsWithdrawingMoney] = useState(false);
  const [currentPot, setCurrentPot] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    target: '',
    total: 0,
    theme: '#277C78' // Default theme
  });
  
  // Money operation state
  const [moneyAmount, setMoneyAmount] = useState('');
  
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
  
  const handleAddPot = () => {
    setIsAddingPot(true);
    setFormData({
      name: '',
      target: '',
      total: 0,
      theme: '#277C78'
    });
  };
  
  const handleEditPot = (pot) => {
    setIsEditingPot(true);
    setCurrentPot(pot);
    setFormData({
      name: pot.name,
      target: pot.target,
      total: pot.total,
      theme: pot.theme
    });
  };
  
  const handleDeletePot = (pot) => {
    setIsDeletingPot(true);
    setCurrentPot(pot);
  };
  
  const handleAddMoney = (pot) => {
    setIsAddingMoney(true);
    setCurrentPot(pot);
    setMoneyAmount('');
  };
  
  const handleWithdrawMoney = (pot) => {
    setIsWithdrawingMoney(true);
    setCurrentPot(pot);
    setMoneyAmount('');
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'target' ? Number(value) : value
    }));
  };
  
  const handleMoneyAmountChange = (e) => {
    setMoneyAmount(e.target.value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditingPot) {
      updatePot(formData);
      setIsEditingPot(false);
    } else {
      addPot({
        ...formData,
        total: 0
      });
      setIsAddingPot(false);
    }
    
    setCurrentPot(null);
    setFormData({
      name: '',
      target: '',
      total: 0,
      theme: '#277C78'
    });
  };
  
  const handleConfirmDelete = () => {
    deletePot(currentPot.name);
    setIsDeletingPot(false);
    setCurrentPot(null);
  };
  
  const handleConfirmAddMoney = (e) => {
    e.preventDefault();
    const amount = Number(moneyAmount);
    
    if (amount > 0 && amount <= data.balance.current) {
      addToPot(currentPot.name, amount);
      setIsAddingMoney(false);
      setCurrentPot(null);
      setMoneyAmount('');
    }
  };
  
  const handleConfirmWithdrawMoney = (e) => {
    e.preventDefault();
    const amount = Number(moneyAmount);
    
    if (amount > 0 && amount <= currentPot.total) {
      withdrawFromPot(currentPot.name, amount);
      setIsWithdrawingMoney(false);
      setCurrentPot(null);
      setMoneyAmount('');
    }
  };
  
  const handleCancel = () => {
    setIsAddingPot(false);
    setIsEditingPot(false);
    setIsDeletingPot(false);
    setIsAddingMoney(false);
    setIsWithdrawingMoney(false);
    setCurrentPot(null);
    setMoneyAmount('');
  };
  
  return (
    <div className="pots-page">
      <div className="pots-header">
        <h1>Pots</h1>
        <button onClick={handleAddPot} className="add-pot-btn">
          Add New Pot
        </button>
      </div>
      
      {pots.length === 0 ? (
        <div className="no-pots">
          <p>You haven't created any pots yet. Add a pot to start saving toward your goals.</p>
        </div>
      ) : (
        <div className="pots-grid">
          {pots.map(pot => {
            const progress = (pot.total / pot.target) * 100;
            const formattedProgress = Math.min(100, progress).toFixed(0);
            
            return (
              <div className="pot-card" key={pot.name}>
                <div className="pot-header">
                  <h2>{pot.name}</h2>
                  <div className="pot-actions">
                    <button 
                      onClick={() => handleEditPot(pot)}
                      className="icon-button edit-button"
                      aria-label={`Edit ${pot.name} pot`}
                    >
                      <span>✏️</span>
                    </button>
                    <button 
                      onClick={() => handleDeletePot(pot)}
                      className="icon-button delete-button"
                      aria-label={`Delete ${pot.name} pot`}
                    >
                      <span>🗑️</span>
                    </button>
                  </div>
                </div>
                
                <div className="pot-details">
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${formattedProgress}%`,
                          backgroundColor: pot.theme
                        }}
                      ></div>
                    </div>
                    <div className="progress-text">
                      <span>${pot.total.toFixed(2)}</span>
                      <span>${pot.target.toFixed(2)}</span>
                    </div>
                    <div className="progress-percentage">
                      {formattedProgress}% toward target
                    </div>
                  </div>
                </div>
                
                <div className="pot-actions-buttons">
                  <button 
                    onClick={() => handleAddMoney(pot)} 
                    className="action-btn add-money-btn"
                  >
                    Add Money
                  </button>
                  <button 
                    onClick={() => handleWithdrawMoney(pot)} 
                    className="action-btn withdraw-money-btn"
                    disabled={pot.total <= 0}
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Add/Edit Pot Modal */}
      {(isAddingPot || isEditingPot) && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{isAddingPot ? 'Add New Pot' : 'Edit Pot'}</h2>
            <p className="modal-subtitle">
              {isAddingPot 
                ? 'Create a pot to set savings targets. These can help keep you on track as you save for special purchases.'
                : 'If your saving targets change, feel free to update your pots.'}
            </p>
            
            <form onSubmit={handleSubmit} className="pot-form">
              <div className="form-group">
                <label htmlFor="name">Pot Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="target">Target</label>
                <input
                  type="number"
                  id="target"
                  name="target"
                  value={formData.target}
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
                  {isAddingPot ? 'Add Pot' : 'Save Changes'}
                </button>
                <button type="button" onClick={handleCancel} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Pot Confirmation Modal */}
      {isDeletingPot && currentPot && (
        <div className="modal-backdrop">
          <div className="modal delete-modal">
            <h2>Delete '{currentPot.name}'</h2>
            <p className="modal-subtitle">
              Are you sure you want to delete this pot? This action cannot be reversed, 
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
      
      {/* Add Money Modal */}
      {isAddingMoney && currentPot && (
        <div className="modal-backdrop">
          <div className="modal money-modal">
            <h2>Add to '{currentPot.name}'</h2>
            <p className="modal-subtitle">
              Add money to your pot to keep it separate from your main balance. 
              As soon as you add this money, it will be deducted from your current balance.
            </p>
            
            <form onSubmit={handleConfirmAddMoney} className="money-form">
              <div className="form-group">
                <div className="target-info">
                  <span className="label">New Amount</span>
                  <span className="value">${(currentPot.total + Number(moneyAmount || 0)).toFixed(2)}</span>
                </div>
                <div className="target-info">
                  <span className="label">Target of ${currentPot.target.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="add-amount">Amount to Add</label>
                <input
                  type="number"
                  id="add-amount"
                  value={moneyAmount}
                  onChange={handleMoneyAmountChange}
                  min="0.01"
                  max={data.balance.current}
                  step="0.01"
                  required
                />
                {Number(moneyAmount) > data.balance.current && (
                  <p className="error-message">
                    Amount exceeds your current balance of ${data.balance.current.toFixed(2)}
                  </p>
                )}
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={Number(moneyAmount) <= 0 || Number(moneyAmount) > data.balance.current}
                >
                  Confirm Addition
                </button>
                <button type="button" onClick={handleCancel} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Withdraw Money Modal */}
      {isWithdrawingMoney && currentPot && (
        <div className="modal-backdrop">
          <div className="modal money-modal">
            <h2>Withdraw from '{currentPot.name}'</h2>
            <p className="modal-subtitle">
              Withdraw from your pot to put money back in your main balance. 
              This will reduce the amount you have in this pot.
            </p>
            
            <form onSubmit={handleConfirmWithdrawMoney} className="money-form">
              <div className="form-group">
                <div className="target-info">
                  <span className="label">New Amount</span>
                  <span className="value">${Math.max(0, currentPot.total - Number(moneyAmount || 0)).toFixed(2)}</span>
                </div>
                <div className="target-info">
                  <span className="label">Target of ${currentPot.target.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="withdraw-amount">Amount to Withdraw</label>
                <input
                  type="number"
                  id="withdraw-amount"
                  value={moneyAmount}
                  onChange={handleMoneyAmountChange}
                  min="0.01"
                  max={currentPot.total}
                  step="0.01"
                  required
                />
                {Number(moneyAmount) > currentPot.total && (
                  <p className="error-message">
                    Amount exceeds your pot balance of ${currentPot.total.toFixed(2)}
                  </p>
                )}
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={Number(moneyAmount) <= 0 || Number(moneyAmount) > currentPot.total}
                >
                  Confirm Withdrawal
                </button>
                <button type="button" onClick={handleCancel} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pots;