import { formatDate, formatDateShort } from '../dateUtils';

describe('dateUtils', () => {
  describe('formatDate', () => {
    test('formats ISO date string to readable format', () => {
      const isoDate = '2024-08-19T14:23:11Z';
      const result = formatDate(isoDate);
      expect(result).toBe('19 Aug 2024');
    });

    test('handles different months correctly', () => {
      expect(formatDate('2024-01-15T10:00:00Z')).toBe('15 Jan 2024');
      expect(formatDate('2024-12-25T18:30:00Z')).toBe('25 Dec 2024');
    });

    test('handles different years correctly', () => {
      expect(formatDate('2023-06-10T12:00:00Z')).toBe('10 Jun 2023');
      expect(formatDate('2025-03-05T09:15:00Z')).toBe('5 Mar 2025');
    });

    test('handles single digit days correctly', () => {
      expect(formatDate('2024-08-01T14:23:11Z')).toBe('1 Aug 2024');
      expect(formatDate('2024-08-09T14:23:11Z')).toBe('9 Aug 2024');
    });

    test('handles timezone differences', () => {
      // Different timezone, same date
      expect(formatDate('2024-08-19T23:59:59Z')).toBe('19 Aug 2024');
      expect(formatDate('2024-08-19T00:00:01Z')).toBe('19 Aug 2024');
    });
  });

  describe('formatDateShort', () => {
    test('formats ISO date string to short format without year', () => {
      const isoDate = '2024-08-19T14:23:11Z';
      const result = formatDateShort(isoDate);
      expect(result).toBe('19 Aug');
    });

    test('handles different months correctly', () => {
      expect(formatDateShort('2024-01-15T10:00:00Z')).toBe('15 Jan');
      expect(formatDateShort('2024-12-25T18:30:00Z')).toBe('25 Dec');
    });

    test('handles single digit days correctly', () => {
      expect(formatDateShort('2024-08-01T14:23:11Z')).toBe('1 Aug');
      expect(formatDateShort('2024-08-09T14:23:11Z')).toBe('9 Aug');
    });

    test('year does not affect short format output', () => {
      expect(formatDateShort('2023-06-10T12:00:00Z')).toBe('10 Jun');
      expect(formatDateShort('2025-06-10T12:00:00Z')).toBe('10 Jun');
    });

    test('handles edge case dates', () => {
      expect(formatDateShort('2024-02-29T12:00:00Z')).toBe('29 Feb'); // Leap year
      expect(formatDateShort('2024-11-30T23:59:59Z')).toBe('30 Nov');
    });
  });

  describe('error handling', () => {
    test('formatDate handles invalid date strings gracefully', () => {
      // This will depend on how you want to handle errors
      // For now, we expect it to return "Invalid Date" or throw
      expect(() => formatDate('invalid-date')).not.toThrow();
    });

    test('formatDateShort handles invalid date strings gracefully', () => {
      expect(() => formatDateShort('invalid-date')).not.toThrow();
    });

    test('both functions handle empty strings', () => {
      expect(() => formatDate('')).not.toThrow();
      expect(() => formatDateShort('')).not.toThrow();
    });
  });
});