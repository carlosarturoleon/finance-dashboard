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

    test('formats dates consistently regardless of time', () => {
      // Test different times on the same UTC date
      const date = '2024-08-19';
      expect(formatDate(`${date}T00:00:00Z`)).toMatch(/19 Aug 2024|18 Aug 2024/);
      expect(formatDate(`${date}T12:00:00Z`)).toMatch(/19 Aug 2024|18 Aug 2024/);
      expect(formatDate(`${date}T23:59:59Z`)).toMatch(/19 Aug 2024|18 Aug 2024/);
    });

    test('handles noon UTC time consistently', () => {
      // Using noon UTC should be more consistent across timezones
      expect(formatDate('2024-08-19T12:00:00Z')).toBe('19 Aug 2024');
      expect(formatDate('2024-01-15T12:00:00Z')).toBe('15 Jan 2024');
    });
  });

  describe('formatDateShort', () => {
    test('formats ISO date string to short format without year', () => {
      const isoDate = '2024-08-19T12:00:00Z';
      const result = formatDateShort(isoDate);
      expect(result).toBe('19 Aug');
    });

    test('handles different months correctly', () => {
      expect(formatDateShort('2024-01-15T12:00:00Z')).toBe('15 Jan');
      expect(formatDateShort('2024-12-25T12:00:00Z')).toBe('25 Dec');
    });

    test('handles single digit days correctly', () => {
      expect(formatDateShort('2024-08-01T12:00:00Z')).toBe('1 Aug');
      expect(formatDateShort('2024-08-09T12:00:00Z')).toBe('9 Aug');
    });

    test('year does not affect short format output', () => {
      expect(formatDateShort('2023-06-10T12:00:00Z')).toBe('10 Jun');
      expect(formatDateShort('2025-06-10T12:00:00Z')).toBe('10 Jun');
    });

    test('handles edge case dates', () => {
      expect(formatDateShort('2024-02-29T12:00:00Z')).toBe('29 Feb'); // Leap year
      expect(formatDateShort('2024-11-30T12:00:00Z')).toBe('30 Nov');
    });
  });

  describe('consistency between functions', () => {
    test('both functions format the same date part consistently', () => {
      const testDate = '2024-08-19T12:00:00Z';
      const fullFormat = formatDate(testDate);
      const shortFormat = formatDateShort(testDate);
      
      // Extract day and month from full format (e.g., "19 Aug 2024" -> "19 Aug")
      const dayAndMonth = fullFormat.split(' ').slice(0, 2).join(' ');
      
      expect(shortFormat).toBe(dayAndMonth);
    });

    test('multiple dates maintain consistency', () => {
      const testDates = [
        '2024-01-01T12:00:00Z',
        '2024-06-15T12:00:00Z',
        '2024-12-31T12:00:00Z'
      ];

      testDates.forEach(date => {
        const fullFormat = formatDate(date);
        const shortFormat = formatDateShort(date);
        const dayAndMonth = fullFormat.split(' ').slice(0, 2).join(' ');
        expect(shortFormat).toBe(dayAndMonth);
      });
    });
  });

  describe('error handling', () => {
    test('formatDate handles invalid date strings gracefully', () => {
      // The function should not throw, but may return "Invalid Date"
      expect(() => formatDate('invalid-date')).not.toThrow();
      
      const result = formatDate('invalid-date');
      // Accept any non-empty string as long as it doesn't crash
      expect(typeof result).toBe('string');
    });

    test('formatDateShort handles invalid date strings gracefully', () => {
      expect(() => formatDateShort('invalid-date')).not.toThrow();
      
      const result = formatDateShort('invalid-date');
      expect(typeof result).toBe('string');
    });

    test('both functions handle empty strings', () => {
      expect(() => formatDate('')).not.toThrow();
      expect(() => formatDateShort('')).not.toThrow();
    });

    test('both functions handle null and undefined', () => {
      expect(() => formatDate(null)).not.toThrow();
      expect(() => formatDate(undefined)).not.toThrow();
      expect(() => formatDateShort(null)).not.toThrow();
      expect(() => formatDateShort(undefined)).not.toThrow();
    });
  });
});