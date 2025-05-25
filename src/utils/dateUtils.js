/**
 * Format date to "19 Aug 2024" format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };
  
  /**
   * Format date to "19 Aug" format (without year)
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string without year
   */
  export const formatDateShort = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short'
    });
  };