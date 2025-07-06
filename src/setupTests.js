// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { createLocalStorageMock } from './__mocks__/localStorage';

// Mock localStorage globally
global.localStorage = createLocalStorageMock();

// Mock sessionStorage as well
global.sessionStorage = createLocalStorageMock();

// Mock window.matchMedia (used by some responsive components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver (if you plan to add it later)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock ResizeObserver (commonly needed for responsive components)
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Clean up after each test
beforeEach(() => {
  // Reset localStorage
  global.localStorage.clear();
  global.sessionStorage.clear();
  
  // Reset all mocks
  jest.clearAllMocks();
});

// Global test utilities
global.testUtils = {
  // Helper to create mock transaction data
  createMockTransaction: (overrides = {}) => ({
    name: 'Test Transaction',
    category: 'General',
    date: '2024-08-19T14:23:11Z',
    amount: -50.00,
    recurring: false,
    avatar: null,
    ...overrides
  }),
  
  // Helper to create mock budget data
  createMockBudget: (overrides = {}) => ({
    category: 'Entertainment',
    maximum: 100.00,
    theme: '#277C78',
    ...overrides
  }),
  
  // Helper to create mock pot data
  createMockPot: (overrides = {}) => ({
    name: 'Test Pot',
    target: 1000.00,
    total: 250.00,
    theme: '#277C78',
    ...overrides
  })
};