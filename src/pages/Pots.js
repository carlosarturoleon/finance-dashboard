import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import PotCard from '../components/pots/PotCard';
import PotFormModal from '../components/pots/PotFormModal';
import PotDeleteModal from '../components/pots/PotDeleteModal';
import PotMoneyModal from '../components/pots/PotMoneyModal';
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
  
  const handleAddPot = () => {
    setIsAddingPot(true);
  };
  
  const handleEditPot = (pot) => {
    setIsEditingPot(true);
    setCurrentPot(pot);
  };
  
  const handleDeletePot = (pot) => {
    setIsDeletingPot(true);
    setCurrentPot(pot);
  };
  
  const handleAddMoney = (pot) => {
    setIsAddingMoney(true);
    setCurrentPot(pot);
  };
  
  const handleWithdrawMoney = (pot) => {
    setIsWithdrawingMoney(true);
    setCurrentPot(pot);
  };
  
  const handleSubmit = (values) => {
    if (isEditingPot) {
      updatePot({ ...currentPot, ...values }, currentPot.name);
      setIsEditingPot(false);
    } else {
      addPot({ ...values, total: 0 });
      setIsAddingPot(false);
    }

    setCurrentPot(null);
  };
  
  const handleConfirmDelete = () => {
    deletePot(currentPot.name);
    setIsDeletingPot(false);
    setCurrentPot(null);
  };
  
  const handleConfirmAddMoney = (amount) => {
    addToPot(currentPot.name, amount);
    setIsAddingMoney(false);
    setCurrentPot(null);
  };
  
  const handleConfirmWithdrawMoney = (amount) => {
    withdrawFromPot(currentPot.name, amount);
    setIsWithdrawingMoney(false);
    setCurrentPot(null);
  };
  
  const handleCancel = () => {
    setIsAddingPot(false);
    setIsEditingPot(false);
    setIsDeletingPot(false);
    setIsAddingMoney(false);
    setIsWithdrawingMoney(false);
    setCurrentPot(null);
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
      <PotFormModal
        isOpen={isAddingPot || isEditingPot}
        mode={isEditingPot ? 'edit' : 'add'}
        pot={isEditingPot ? currentPot : null}
        onSubmit={handleSubmit}
        onClose={handleCancel}
      />
      
      {/* Delete Pot Confirmation Modal */}
      <PotDeleteModal
        pot={isDeletingPot ? currentPot : null}
        onConfirm={handleConfirmDelete}
        onClose={handleCancel}
      />
      
      {/* Add Money Modal */}
      <PotMoneyModal
        mode="add"
        pot={isAddingMoney ? currentPot : null}
        balance={data.balance.current}
        onConfirm={handleConfirmAddMoney}
        onClose={handleCancel}
      />
      
      {/* Withdraw Money Modal */}
      <PotMoneyModal
        mode="withdraw"
        pot={isWithdrawingMoney ? currentPot : null}
        onConfirm={handleConfirmWithdrawMoney}
        onClose={handleCancel}
      />
    </div>
  );
};

export default Pots;