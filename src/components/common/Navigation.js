import React, { useState, useCallback, useEffect } from "react";
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
import { ReactComponent as ArrowIcon } from "../../assets/images/icon-minimize-menu.svg";

// Navigation items configuration
const NAV_ITEMS = [
  { path: "/", exact: true, icon: HomeIcon, text: "Overview" },
  { path: "/transactions", icon: TransactionsIcon, text: "Transactions" },
  { path: "/budgets", icon: BudgetsIcon, text: "Budgets" },
  { path: "/pots", icon: PotsIcon, text: "Pots" },
  { path: "/recurring", icon: RecurringIcon, text: "Recurring Bills" }
];

const Navigation = React.memo(({ onToggleMinimize }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  
  const toggleMinimize = useCallback(() => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    if (onToggleMinimize) {
      onToggleMinimize(newState);
    }
  }, [isMinimized, onToggleMinimize]);
  
  // Notify parent component of initial state
  useEffect(() => {
    if (onToggleMinimize) {
      onToggleMinimize(isMinimized);
    }
  }, [onToggleMinimize, isMinimized]);

  return (
    <nav className={`navigation ${isMinimized ? "minimized" : ""}`}>
      <div className="nav-header">
        {isMinimized ? (
          <LogoSmall className="logo logo-small" aria-label="Company logo small" />
        ) : (
          <LogoLarge className="logo logo-large" aria-label="Company logo" />
        )}
      </div>

      <ul className="nav-links">
        {NAV_ITEMS.map(item => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              end={item.exact}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <span className="icon">
                <item.icon aria-hidden="true" />
              </span>
              {!isMinimized && <span className="link-text">{item.text}</span>}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="nav-footer">
        <button
          className="minimize-btn"
          onClick={toggleMinimize}
          aria-label={isMinimized ? "Expand menu" : "Minimize menu"}
        >
          <ArrowIcon aria-hidden="true" />
          {!isMinimized && <span className="minimize-text">Minimize Menu</span>}
        </button>
      </div>
    </nav>
  );
});

export default Navigation;