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

  /**
   * Format time to "14:23" (24-hour) format
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted time
   */
  export const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  /**
   * Format date and time to "19 Aug 2024, 14:23" format
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date and 24-hour time
   */
  export const formatDateTime = (dateString) =>
    `${formatDate(dateString)}, ${formatTime(dateString)}`;