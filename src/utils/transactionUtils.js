/**
 * Sorts transactions within the same day by time, then sorts days by date
 * @param {Array} transactionsToSort - Array of transactions to sort
 * @param {string} sortBy - Sort method ('latest', 'oldest', etc.)
 * @returns {Array} Sorted transactions
 */
export const sortTransactionsWithinSameDay = (transactionsToSort, sortBy) => {
  if (!transactionsToSort || transactionsToSort.length === 0) {
    return [];
  }

  const transactionsByDate = {};
  
  // Group transactions by date
  transactionsToSort.forEach(transaction => {
    const date = new Date(transaction.date);
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    
    if (!transactionsByDate[dateKey]) {
      transactionsByDate[dateKey] = [];
    }
    
    transactionsByDate[dateKey].push(transaction);
  });
  
  // Sort transactions within each day by time (oldest first within day)
  Object.keys(transactionsByDate).forEach(dateKey => {
    transactionsByDate[dateKey].sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return timeA - timeB;
    });
  });
  
  // Sort dates and flatten results
  const result = [];
  const sortedDateKeys = Object.keys(transactionsByDate).sort((a, b) => {
    const dateA = new Date(a.split('-').join('/'));
    const dateB = new Date(b.split('-').join('/'));
    
    if (sortBy === 'latest') {
      return dateB - dateA; // Newest dates first
    }
    if (sortBy === 'oldest') {
      return dateA - dateB; // Oldest dates first
    }
    return dateB - dateA; // Default to newest first
  });
  
  sortedDateKeys.forEach(dateKey => {
    transactionsByDate[dateKey].forEach(transaction => {
      result.push(transaction);
    });
  });
  
  return result;
};

/**
 * Validates transaction data
 * @param {Object} transaction - Transaction object to validate
 * @returns {boolean} Whether the transaction is valid
 */
export const isValidTransaction = (transaction) => {
  return (
    transaction &&
    typeof transaction.name === 'string' &&
    typeof transaction.amount === 'number' &&
    typeof transaction.date === 'string' &&
    typeof transaction.category === 'string'
  );
};

/**
 * Sanitizes search input to prevent XSS
 * @param {string} input - Raw search input
 * @returns {string} Sanitized input
 */
export const sanitizeSearchInput = (input) => {
  if (typeof input !== 'string') return '';
  
  // Remove any HTML tags and limit length
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>&"']/g, '') // Remove potentially dangerous characters
    .trim()
    .slice(0, 100); // Limit length
};