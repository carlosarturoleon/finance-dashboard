import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import PotCard from '../components/pots/PotCard';
import Modal from '../components/common/Modal';
import BudgetSelect from '../components/budgets/BudgetSelect';
import './Pots.css';

const POT_NAME_MAX_LENGTH = 30;

// Same palette as the budgets form, so existing pot themes show as selected
const THEME_COLORS = [
  { name: 'Green', color: '#277C78' },
  { name: 'Yellow', color: '#F2CDAC' },
  { name: 'Cyan', color: '#82C9D7' },
  { name: 'Navy', color: '#626070' },
  { name: 'Red', color: '#C94736' },
  { name: 'Purple', color: '#826CB0' },
  { name: 'Turquoise', color: '#597C7C' },
  { name: 'Brown', color: '#93674F' },
  { name: 'Magenta', color: '#934F6F' },
  { name: 'Blue', color: '#3F82B2' },
  { name: 'Navy Grey', color: '#97A0AC' },
  { name: 'Army Green', color: '#7F9161' },
  { name: 'Gold', color: '#CAB361' },
  { name: 'Orange', color: '#BE6C49' }
];

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
  
  // Colors taken by other pots can't be picked again
  const usedThemes = pots
    .filter(pot => !currentPot || pot.name !== currentPot.name)
    .map(pot => pot.theme);

  const firstFreeTheme = () =>
    (THEME_COLORS.find(theme => !usedThemes.includes(theme.color)) || THEME_COLORS[0]).color;

  const handleAddPot = () => {
    setIsAddingPot(true);
    setFormData({
      name: '',
      target: '',
      total: 0,
      theme: firstFreeTheme()
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleMoneyAmountChange = (e) => {
    setMoneyAmount(e.target.value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const pot = { ...formData, target: Number(formData.target) };

    if (isEditingPot) {
      updatePot(pot);
      setIsEditingPot(false);
    } else {
      addPot({
        ...pot,
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
    <div className="pots">
      <div className="pots__header">
        <h1 className="pots__heading">Pots</h1>
        <button onClick={handleAddPot} className="pots__add-button">
          + Add New Pot
        </button>
      </div>

      {pots.length === 0 ? (
        <div className="no-pots">
          <p>You haven't created any pots yet. Add a pot to start saving toward your goals.</p>
        </div>
      ) : (
        <div className="pots__grid">
          {pots.map(pot => (
            <PotCard
              key={pot.name}
              pot={pot}
              onAddMoney={handleAddMoney}
              onWithdraw={handleWithdrawMoney}
              onEdit={handleEditPot}
              onDelete={handleDeletePot}
            />
          ))}
        </div>
      )}
      
      {/* Add/Edit Pot Modal */}
      <Modal
        isOpen={isAddingPot || isEditingPot}
        onClose={handleCancel}
        title={isAddingPot ? 'Add New Pot' : 'Edit Pot'}
        className="pots__modal"
      >
        <p className="pots__modal-text">
          {isAddingPot
            ? 'Create a pot to set savings targets. These can help keep you on track as you save for special purchases.'
            : 'If your saving targets change, feel free to update your pots.'}
        </p>

        <form onSubmit={handleSubmit} className="pots__form">
          <div className="pots__form-group">
            <label htmlFor="pot-name" className="pots__form-label">Pot Name</label>
            <input
              type="text"
              id="pot-name"
              name="name"
              className="pots__form-control"
              value={formData.name}
              onChange={handleFormChange}
              maxLength={POT_NAME_MAX_LENGTH}
              aria-describedby="pot-name-count"
              disabled={isEditingPot}
              required
            />
            <p id="pot-name-count" className="pots__form-hint">
              {POT_NAME_MAX_LENGTH - formData.name.length} of {POT_NAME_MAX_LENGTH} characters left
            </p>
          </div>

          <div className="pots__form-group">
            <label htmlFor="pot-target" className="pots__form-label">Target</label>
            <div className="pots__form-money">
              <span className="pots__form-currency" aria-hidden="true">$</span>
              {/* Text input so the amount keeps a "." decimal separator in every browser locale */}
              <input
                type="text"
                inputMode="decimal"
                id="pot-target"
                name="target"
                className="pots__form-control pots__form-control--money"
                value={formData.target}
                onChange={handleFormChange}
                pattern="(?!0+(\.0+)?$)\d+(\.\d{1,2})?"
                title="Enter an amount greater than 0, e.g. 2000 or 49.99"
                required
              />
            </div>
          </div>

          <div className="pots__form-group">
            <label id="pot-theme-label" htmlFor="pot-theme" className="pots__form-label">Color Tag</label>
            <BudgetSelect
              id="pot-theme"
              labelId="pot-theme-label"
              value={formData.theme}
              options={THEME_COLORS.map(theme => ({ value: theme.color, label: theme.name, color: theme.color }))}
              disabledValues={usedThemes}
              onChange={theme => setFormData(prev => ({ ...prev, theme }))}
            />
          </div>

          <button type="submit" className="pots__primary-button">
            {isAddingPot ? 'Add Pot' : 'Save Changes'}
          </button>
        </form>
      </Modal>

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