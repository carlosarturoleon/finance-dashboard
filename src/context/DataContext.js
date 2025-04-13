import React, { createContext, useState, useContext, useEffect } from 'react';
import financeData from '../data/data.json'

// Create the context
const DataContext = createContext();

// Custom hook to use the context
export const useData = () => useContext(DataContext);

// Provider component
export const DataProvider = ({ children }) => {
  // Initialize state with data from JSON file or localStorage if available
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('financeData');
    return savedData ? JSON.parse(savedData) : financeData;
  });

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('financeData', JSON.stringify(data));
  }, [data]);

  // Function to add a new transaction
  const addTransaction = (transaction) => {
    setData(prevData => ({
      ...prevData,
      transactions: [transaction, ...prevData.transactions]
    }));
  };

  // Function to add a new budget
  const addBudget = (budget) => {
    setData(prevData => ({
      ...prevData,
      budgets: [...prevData.budgets, budget]
    }));
  };

  // Function to update a budget
  const updateBudget = (updatedBudget) => {
    setData(prevData => ({
      ...prevData,
      budgets: prevData.budgets.map(budget => 
        budget.category === updatedBudget.category ? updatedBudget : budget
      )
    }));
  };

  // Function to delete a budget
  const deleteBudget = (category) => {
    setData(prevData => ({
      ...prevData,
      budgets: prevData.budgets.filter(budget => budget.category !== category)
    }));
  };

  // Function to add a new pot
  const addPot = (pot) => {
    setData(prevData => ({
      ...prevData,
      pots: [...prevData.pots, pot]
    }));
  };

  // Function to update a pot
  const updatePot = (updatedPot) => {
    setData(prevData => ({
      ...prevData,
      pots: prevData.pots.map(pot => 
        pot.name === updatedPot.name ? updatedPot : pot
      )
    }));
  };

  // Function to delete a pot
  const deletePot = (name) => {
    const potToDelete = data.pots.find(pot => pot.name === name);
    
    if (potToDelete) {
      setData(prevData => ({
        ...prevData,
        balance: {
          ...prevData.balance,
          current: prevData.balance.current + potToDelete.total
        },
        pots: prevData.pots.filter(pot => pot.name !== name)
      }));
    }
  };

  // Function to add money to a pot
  const addToPot = (name, amount) => {
    setData(prevData => {
      const updatedPots = prevData.pots.map(pot => {
        if (pot.name === name) {
          return {
            ...pot,
            total: pot.total + amount
          };
        }
        return pot;
      });

      return {
        ...prevData,
        balance: {
          ...prevData.balance,
          current: prevData.balance.current - amount
        },
        pots: updatedPots
      };
    });
  };

  // Function to withdraw money from a pot
  const withdrawFromPot = (name, amount) => {
    setData(prevData => {
      const updatedPots = prevData.pots.map(pot => {
        if (pot.name === name) {
          return {
            ...pot,
            total: pot.total - amount
          };
        }
        return pot;
      });

      return {
        ...prevData,
        balance: {
          ...prevData.balance,
          current: prevData.balance.current + amount
        },
        pots: updatedPots
      };
    });
  };

  // Get transactions for a specific budget category
  const getTransactionsByCategory = (category) => {
    return data.transactions.filter(transaction => 
      transaction.category === category
    );
  };

  // Get latest transactions for a specific budget category
  const getLatestTransactionsByCategory = (category, limit = 3) => {
    return data.transactions
      .filter(transaction => transaction.category === category)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  };

  // Calculate amount spent in a category for the current month
  const getMonthlySpentByCategory = (category) => {
    const currentMonth = 8; // August (0-indexed would be 7, but we're using 1-indexed)
    const currentYear = 2024;
    
    return data.transactions
      .filter(transaction => 
        transaction.category === category && 
        transaction.amount < 0 &&
        new Date(transaction.date).getMonth() + 1 === currentMonth &&
        new Date(transaction.date).getFullYear() === currentYear
      )
      .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
  };

  // Get recurring bills
  const getRecurringBills = () => {
    const recurringTransactions = data.transactions.filter(
      transaction => transaction.recurring
    );
    
    // Group by vendor name to ensure only one item per vendor
    const billsByVendor = {};
    
    recurringTransactions.forEach(transaction => {
      if (!billsByVendor[transaction.name] || 
          new Date(transaction.date) > new Date(billsByVendor[transaction.name].date)) {
        billsByVendor[transaction.name] = transaction;
      }
    });
    
    return Object.values(billsByVendor);
  };

  // Filter transactions with pagination
  const getFilteredTransactions = (search = '', sortBy = 'latest', category = 'All Transactions', page = 1, limit = 10) => {
    let filtered = [...data.transactions];
    
    // Apply search filter
    if (search) {
      filtered = filtered.filter(transaction => 
        transaction.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply category filter
    if (category !== 'All Transactions') {
      filtered = filtered.filter(transaction => transaction.category === category);
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'a-z':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'z-a':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'highest':
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case 'lowest':
        filtered.sort((a, b) => a.amount - b.amount);
        break;
      case 'latest':
      default:
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
    }
    
    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTransactions = filtered.slice(startIndex, endIndex);
    
    return {
      transactions: paginatedTransactions,
      totalPages: Math.ceil(filtered.length / limit),
      totalCount: filtered.length
    };
  };

  return (
    <DataContext.Provider value={{
      data,
      addTransaction,
      addBudget,
      updateBudget,
      deleteBudget,
      addPot,
      updatePot,
      deletePot,
      addToPot,
      withdrawFromPot,
      getTransactionsByCategory,
      getLatestTransactionsByCategory,
      getMonthlySpentByCategory,
      getRecurringBills,
      getFilteredTransactions
    }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;