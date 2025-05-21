import React from 'react';
import PropTypes from 'prop-types';
import './TransactionRow.css';

const TransactionRow = ({ transaction, index }) => {
  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };
  
  return (
    <tr className="transaction-row">
      <td className="transactions__table-cell transactions__table-cell--recipient">
        <div className="transaction-name">
          <div className="transaction-avatar">
            {transaction.avatar ? (
              <img 
                src={transaction.avatar} 
                alt={`${transaction.name}'s avatar`}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.textContent = transaction.name.charAt(0);
                }}
              />
            ) : (
              transaction.name.charAt(0)
            )}
          </div>
          <span className="transaction-name__text">{transaction.name}</span>
        </div>
      </td>
      <td className="transactions__table-cell transactions__table-cell--category transaction-category">
        {transaction.category}
      </td>
      <td className="transactions__table-cell transactions__table-cell--date transaction-date">
        {formatDate(transaction.date)}
      </td>
      <td className={`transactions__table-cell transactions__table-cell--amount transaction-amount ${
        transaction.amount < 0 ? 'transaction-amount--negative' : 'transaction-amount--positive'}`}>
        {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
      </td>
    </tr>
  );
};

TransactionRow.propTypes = {
  transaction: PropTypes.shape({
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    avatar: PropTypes.string
  }).isRequired,
  index: PropTypes.number.isRequired
};

export default TransactionRow;