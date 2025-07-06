import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the data.json import to avoid issues with the JSON file
jest.mock('./data/data.json', () => ({
  balance: {
    current: 4836.00,
    income: 3814.25,
    expenses: 1700.50
  },
  transactions: [],
  budgets: [],
  pots: []
}));

describe('App Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('renders the app without crashing', () => {
    render(<App />);
    
    // Check if the app renders the main navigation
    expect(document.querySelector('.navigation')).toBeInTheDocument();
  });

  test('renders the overview page by default', () => {
    render(<App />);
    
    // Should show the Overview heading (from Dashboard component)
    expect(screen.getByText('Overview')).toBeInTheDocument();
  });

  test('renders main layout structure', () => {
    const { container } = render(<App />);
    
    // Check for main app structure
    expect(container.querySelector('.app')).toBeInTheDocument();
    expect(container.querySelector('.main-content')).toBeInTheDocument();
    expect(container.querySelector('.navigation')).toBeInTheDocument();
  });

  test('handles sidebar toggle functionality', () => {
    const { container } = render(<App />);
    
    const mainContent = container.querySelector('.main-content');
    expect(mainContent).toBeInTheDocument();
    
    // Initially should not have minimized class
    expect(mainContent).not.toHaveClass('sidebar-minimized');
  });

  test('applies correct responsive classes', () => {
    const { container } = render(<App />);
    
    const mainContent = container.querySelector('.main-content');
    expect(mainContent).toHaveClass('main-content');
  });
});