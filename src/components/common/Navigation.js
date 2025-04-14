import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navigation.css";

// Import SVG icons from assets
import { ReactComponent as HomeIcon } from "../../assets/images/icon-nav-overview.svg";
import { ReactComponent as TransactionsIcon } from "../../assets/images/icon-nav-transactions.svg";
import { ReactComponent as BudgetsIcon } from "../../assets/images/icon-nav-budgets.svg";
import { ReactComponent as PotsIcon } from "../../assets/images/icon-nav-pots.svg";
import { ReactComponent as RecurringIcon } from "../../assets/images/icon-nav-recurring-bills.svg";
import { ReactComponent as LogoLarge } from "../../assets/images/logo-large.svg";
import { ReactComponent as LogoSmall } from "../../assets/images/logo-small.svg";
import { ReactComponent as ArrowLeftIcon } from "../../assets/images/icon-minimize-menu.svg";
import { ReactComponent as ArrowRightIcon } from "../../assets/images/icon-minimize-menu.svg";

const Navigation = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <nav className={`navigation ${isMinimized ? "minimized" : ""}`}>
      <div className="nav-header">
        {isMinimized ? (
          <LogoSmall className="logo logo-small" />
        ) : (
          <LogoLarge className="logo logo-large" />
        )}
      </div>

      <ul className="nav-links">
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span className="icon">
              <HomeIcon />
            </span>
            {!isMinimized && <span className="link-text">Overview</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/transactions"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span className="icon">
              <TransactionsIcon />
            </span>
            {!isMinimized && <span className="link-text">Transactions</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/budgets"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span className="icon">
              <BudgetsIcon />
            </span>
            {!isMinimized && <span className="link-text">Budgets</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/pots"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span className="icon">
              <PotsIcon />
            </span>
            {!isMinimized && <span className="link-text">Pots</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/recurring"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span className="icon">
              <RecurringIcon />
            </span>
            {!isMinimized && <span className="link-text">Recurring Bills</span>}
          </NavLink>
        </li>
      </ul>

      <div className="nav-footer">
        <button
          className="minimize-btn"
          onClick={() => setIsMinimized(!isMinimized)}
          aria-label={isMinimized ? "Expand menu" : "Minimize menu"}
        >
          {isMinimized ? <ArrowRightIcon /> : <ArrowLeftIcon />}
          {!isMinimized && <span className="minimize-text">Minimize Menu</span>}
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
