// Bills are monthly, so their status depends only on the day of the month
// compared with the latest transaction date ("today" in the sample data).
export const DUE_SOON_DAYS = 5;

export const BILL_STATUS = {
  PAID: 'paid',
  DUE_SOON: 'due-soon',
  UPCOMING: 'upcoming'
};

const getDay = (dateString) => new Date(dateString).getUTCDate();

/**
 * Get a bill's status for the month of the reference date
 * @param {string} billDate - ISO date of the bill's latest payment
 * @param {Date} referenceDate - The current date
 * @returns {string} One of BILL_STATUS
 */
export const getBillStatus = (billDate, referenceDate) => {
  const billDay = getDay(billDate);
  const today = referenceDate.getUTCDate();

  if (billDay <= today) return BILL_STATUS.PAID;
  if (billDay - today <= DUE_SOON_DAYS) return BILL_STATUS.DUE_SOON;
  return BILL_STATUS.UPCOMING;
};

/**
 * Add the English ordinal suffix to a day: 1st, 2nd, 3rd, 4th, 11th, 21st...
 * @param {number} day
 * @returns {string}
 */
export const formatOrdinal = (day) => {
  const lastTwo = day % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return `${day}th`;

  switch (day % 10) {
    case 1: return `${day}st`;
    case 2: return `${day}nd`;
    case 3: return `${day}rd`;
    default: return `${day}th`;
  }
};

/**
 * Format a bill's due date as "Monthly - 2nd"
 * @param {string} billDate - ISO date string
 * @returns {string}
 */
export const formatDueDate = (billDate) => `Monthly - ${formatOrdinal(getDay(billDate))}`;

/**
 * Format an amount as "$1,234.56"
 * @param {number} value
 * @returns {string}
 */
export const formatCurrency = (value) =>
  `$${Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

/**
 * Sort bills. "Latest" follows the order bills come due in the month.
 * @param {Array} bills
 * @param {string} sortBy - A SORT_OPTIONS value
 * @returns {Array} A new sorted array
 */
export const sortBills = (bills, sortBy) => {
  const sorted = [...bills];
  const byDay = (a, b) => getDay(a.date) - getDay(b.date);

  switch (sortBy) {
    case 'oldest':
      return sorted.sort((a, b) => byDay(b, a));
    case 'a-z':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'z-a':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'highest':
      return sorted.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
    case 'lowest':
      return sorted.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount));
    case 'latest':
    default:
      return sorted.sort(byDay);
  }
};

/**
 * Totals for the summary cards
 * @param {Array} bills
 * @param {Date} referenceDate
 * @returns {{ total: number, paid: Object, upcoming: Object, dueSoon: Object }}
 */
export const getBillSummary = (bills, referenceDate) => {
  const empty = () => ({ count: 0, amount: 0 });
  const summary = { total: 0, paid: empty(), upcoming: empty(), dueSoon: empty() };

  bills.forEach((bill) => {
    const amount = Math.abs(bill.amount);
    const status = getBillStatus(bill.date, referenceDate);
    const group = status === BILL_STATUS.PAID ? summary.paid : summary.upcoming;

    summary.total += amount;
    group.count += 1;
    group.amount += amount;

    if (status === BILL_STATUS.DUE_SOON) {
      summary.dueSoon.count += 1;
      summary.dueSoon.amount += amount;
    }
  });

  return summary;
};
