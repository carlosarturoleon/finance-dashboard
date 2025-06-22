import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../utils/dateUtils';
import { isValidTransaction } from '../../utils/transactionUtils';
import './TransactionRow.css';

const TransactionRow = ({ transaction, index }) => {
  const [imageError, setImageError] = useState(false);

  // Validate transaction data
  if (!isValidTransaction(transaction)) {
    console.warn('Invalid transaction data:', transaction);
    return null;
  }

  const formattedAmount = `${transaction.amount < 0 ? '-' : '+'}$${Math.abs(transaction.amount).toFixed(2)}`;
  const amountClass = transaction.amount < 0 ? 'transaction-amount--negative' : 'transaction-amount--positive';
  
  const handleImageError = () => {
    setImageError(true);
  };

  const renderAvatar = () => {
    if (!transaction.avatar || imageError) {
      return transaction.name.charAt(0);
    }

    return (
      <img 
        src={transaction.avatar} 
        alt=""
        role="presentation"
        onError={handleImageError}
        loading="lazy"
      />
    );
  };
  
  return (
    <tr 
      className="transaction-row"
      role="row"
      aria-rowindex={index + 2} // +2 because header row is index 1
    >
      <td 
        className={`transactions__table-cell transactions__table-cell--recipient ${amountClass}`}
        data-amount={formattedAmount}
        role="gridcell"
        aria-describedby={`transaction-${index}-details`}
      >
        <div className="transaction-name">
          <div 
            className="transaction-avatar"
            aria-hidden="true"
          >
            {renderAvatar()}
          </div>
          <span 
            className="transaction-name__text"
            id={`transaction-${index}-name`}
          >
            {transaction.name}
          </span>
        </div>
      </td>
      <td 
        className="transactions__table-cell transactions__table-cell--category transaction-category"
        data-date={formatDate(transaction.date)}
        role="gridcell"
      >
        <span id={`transaction-${index}-category`}>
          {transaction.category}
        </span>
      </td>
      <td 
        className="transactions__table-cell transactions__table-cell--date transaction-date"
        role="gridcell"
      >
        <time 
          dateTime={transaction.date}
          id={`transaction-${index}-date`}
        >
          {formatDate(transaction.date)}
        </time>
      </td>
      <td 
        className={`transactions__table-cell transactions__table-cell--amount transaction-amount ${amountClass}`}
        role="gridcell"
        aria-label={`${transaction.amount < 0 ? 'Expense' : 'Income'} of ${formattedAmount}`}
      >
        <span id={`transaction-${index}-amount`}>
          {formattedAmount}
        </span>
      </td>
      
      {/* Hidden element for screen readers to describe the full transaction */}
      <div 
        id={`transaction-${index}-details`} 
        className="visually-hidden"
      >
        {transaction.amount < 0 ? 'Expense' : 'Income'} transaction of {formattedAmount} 
        to {transaction.name} in {transaction.category} category on {formatDate(transaction.date)}
      </div>
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