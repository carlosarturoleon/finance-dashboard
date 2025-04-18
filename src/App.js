import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { Navigation } from './components/common';
import { Dashboard, Transactions, Budgets, Pots, RecurringBills } from './pages';
import './App.css';

function App() {
  const [sidebarMinimized, setSidebarMinimized] = useState(false);

  const handleSidebarToggle = (isMinimized) => {
    setSidebarMinimized(isMinimized);
  };

  return (
    <DataProvider>
      <Router>
        <div className="app">
          <Navigation onToggleMinimize={handleSidebarToggle} />
          <main className={`main-content ${sidebarMinimized ? 'sidebar-minimized' : ''}`}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/pots" element={<Pots />} />
              <Route path="/recurring" element={<RecurringBills />} />
            </Routes>
          </main>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;