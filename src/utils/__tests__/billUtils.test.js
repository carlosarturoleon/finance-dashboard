import {
  BILL_STATUS,
  formatCurrency,
  formatDueDate,
  formatOrdinal,
  getBillStatus,
  getBillSummary,
  sortBills
} from '../billUtils';

const today = new Date('2024-08-19T20:23:11Z');

const bills = [
  { name: 'Charlie', date: '2024-08-11T18:45:38Z', amount: -10 },
  { name: 'Alpha', date: '2024-07-21T10:05:42Z', amount: -9.99 },
  { name: 'Bravo', date: '2024-08-02T09:25:11Z', amount: -100 },
  { name: 'Delta', date: '2024-07-30T13:20:14Z', amount: -1250 }
];

describe('billUtils', () => {
  describe('getBillStatus', () => {
    test('a bill on or before today is paid', () => {
      expect(getBillStatus('2024-08-02T09:25:11Z', today)).toBe(BILL_STATUS.PAID);
      expect(getBillStatus('2024-07-19T09:00:00Z', today)).toBe(BILL_STATUS.PAID);
    });

    test('a bill within five days is due soon', () => {
      expect(getBillStatus('2024-07-21T10:05:42Z', today)).toBe(BILL_STATUS.DUE_SOON);
      expect(getBillStatus('2024-07-24T10:05:42Z', today)).toBe(BILL_STATUS.DUE_SOON);
    });

    test('a later bill is upcoming', () => {
      expect(getBillStatus('2024-07-25T10:05:42Z', today)).toBe(BILL_STATUS.UPCOMING);
    });
  });

  describe('formatting', () => {
    test.each([
      [1, '1st'], [2, '2nd'], [3, '3rd'], [4, '4th'],
      [11, '11th'], [12, '12th'], [13, '13th'],
      [21, '21st'], [22, '22nd'], [23, '23rd'], [30, '30th']
    ])('formatOrdinal(%i) is %s', (day, expected) => {
      expect(formatOrdinal(day)).toBe(expected);
    });

    test('formatDueDate shows the monthly day', () => {
      expect(formatDueDate('2024-08-02T09:25:11Z')).toBe('Monthly - 2nd');
    });

    test('formatCurrency drops the sign and adds separators', () => {
      expect(formatCurrency(-1250)).toBe('$1,250.00');
      expect(formatCurrency(9.99)).toBe('$9.99');
    });
  });

  describe('sortBills', () => {
    const names = (sortBy) => sortBills(bills, sortBy).map((b) => b.name);

    test('latest follows the day of the month', () => {
      expect(names('latest')).toEqual(['Bravo', 'Charlie', 'Alpha', 'Delta']);
    });

    test('oldest reverses that order', () => {
      expect(names('oldest')).toEqual(['Delta', 'Alpha', 'Charlie', 'Bravo']);
    });

    test('sorts by name', () => {
      expect(names('a-z')).toEqual(['Alpha', 'Bravo', 'Charlie', 'Delta']);
      expect(names('z-a')).toEqual(['Delta', 'Charlie', 'Bravo', 'Alpha']);
    });

    test('sorts by amount', () => {
      expect(names('highest')).toEqual(['Delta', 'Bravo', 'Charlie', 'Alpha']);
      expect(names('lowest')).toEqual(['Alpha', 'Charlie', 'Bravo', 'Delta']);
    });

    test('does not change the original array', () => {
      sortBills(bills, 'a-z');
      expect(bills[0].name).toBe('Charlie');
    });
  });

  describe('getBillSummary', () => {
    test('totals paid, upcoming and due soon bills', () => {
      const summary = getBillSummary(bills, today);

      expect(summary.total).toBeCloseTo(1369.99);
      expect(summary.paid).toEqual({ count: 2, amount: 110 });
      expect(summary.upcoming.count).toBe(2);
      expect(summary.upcoming.amount).toBeCloseTo(1259.99);
      expect(summary.dueSoon).toEqual({ count: 1, amount: 9.99 });
    });
  });
});
