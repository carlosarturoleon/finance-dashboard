import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <nav className={`navigation ${isMinimized ? 'minimized' : ''}`}>
      <div className="nav-header">
        <h2 className="logo">Finance</h2>
        <button 
          className="minimize-btn"
          onClick={() => setIsMinimized(!isMinimized)}
          aria-label={isMinimized ? "Expand menu" : "Minimize menu"}
        >
          {isMinimized ? '→' : '←'} {!isMinimized && <span className="minimize-text">Minimize Menu</span>}
        </button>
      </div>

      <ul className="nav-links">
        <li>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon">📊</span>
            {!isMinimized && <span className="link-text">Overview</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/transactions" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon">💸</span>
            {!isMinimized && <span className="link-text">Transactions</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/budgets" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon">📈</span>
            {!isMinimized && <span className="link-text">Budgets</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/pots" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon">🏺</span>
            {!isMinimized && <span className="link-text">Pots</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/recurring" className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon">🔄</span>
            {!isMinimized && <span className="link-text">Recurring Bills</span>}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;