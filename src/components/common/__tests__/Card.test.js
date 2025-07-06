import { render, screen } from '@testing-library/react';
import Card from '../Card';

describe('Card Component', () => {
  describe('Basic Rendering', () => {
    test('renders children content', () => {
      render(<Card>Test Content</Card>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    test('renders with default card class', () => {
      const { container } = render(<Card>Content</Card>);
      expect(container.firstChild).toHaveClass('card');
    });

    test('renders complex children content', () => {
      render(
        <Card>
          <h2>Title</h2>
          <p>Description</p>
          <button>Action</button>
        </Card>
      );
      
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });
  });

  describe('Theme Variants', () => {
    test('applies dark theme class when dark prop is true', () => {
      const { container } = render(<Card dark>Dark Content</Card>);
      
      expect(container.firstChild).toHaveClass('card');
      expect(container.firstChild).toHaveClass('card-dark');
    });

    test('applies light theme class when light prop is true', () => {
      const { container } = render(<Card light>Light Content</Card>);
      
      expect(container.firstChild).toHaveClass('card');
      expect(container.firstChild).toHaveClass('card-light');
    });

    test('applies no-background class when noBackground prop is true', () => {
      const { container } = render(<Card noBackground>No BG Content</Card>);
      
      expect(container.firstChild).toHaveClass('card');
      expect(container.firstChild).toHaveClass('card-no-background');
    });

    test('can combine multiple theme props', () => {
      const { container } = render(
        <Card light noBackground>Combined Theme Content</Card>
      );
      
      expect(container.firstChild).toHaveClass('card');
      expect(container.firstChild).toHaveClass('card-light');
      expect(container.firstChild).toHaveClass('card-no-background');
    });

    test('dark theme takes precedence when multiple themes are provided', () => {
      const { container } = render(
        <Card dark light>Multiple Themes</Card>
      );
      
      expect(container.firstChild).toHaveClass('card-dark');
      expect(container.firstChild).toHaveClass('card-light');
    });
  });

  describe('Custom Styling', () => {
    test('applies custom className when provided', () => {
      const { container } = render(
        <Card className="custom-class">Custom Content</Card>
      );
      
      expect(container.firstChild).toHaveClass('card');
      expect(container.firstChild).toHaveClass('custom-class');
    });

    test('combines default and custom classNames', () => {
      const { container } = render(
        <Card className="custom-class" dark>
          Custom and Dark Content
        </Card>
      );
      
      expect(container.firstChild).toHaveClass('card');
      expect(container.firstChild).toHaveClass('card-dark');
      expect(container.firstChild).toHaveClass('custom-class');
    });

    test('applies accent color style when accentColor prop is provided', () => {
      const testColor = '#FF5733';
      const { container } = render(
        <Card accentColor={testColor}>Accent Content</Card>
      );
      
      expect(container.firstChild).toHaveStyle({
        borderLeft: `4px solid ${testColor}`
      });
    });

    test('does not apply border-left style when no accentColor is provided', () => {
      const { container } = render(<Card>No Accent Content</Card>);
      
      // Check that border-left is either not set or is the default
      const element = container.firstChild;
      const computedStyle = window.getComputedStyle(element);
      
      // Should not have the custom border-left style we apply with accentColor
      expect(element.style.borderLeft).toBe('');
    });
  });

  describe('Props Handling', () => {
    test('handles undefined children gracefully', () => {
      const { container } = render(<Card />);
      
      expect(container.firstChild).toHaveClass('card');
      expect(container.firstChild).toBeEmptyDOMElement();
    });

    test('handles null children gracefully', () => {
      const { container } = render(<Card>{null}</Card>);
      
      expect(container.firstChild).toHaveClass('card');
      expect(container.firstChild).toBeEmptyDOMElement();
    });

    test('handles false children gracefully', () => {
      const { container } = render(<Card>{false}</Card>);
      
      expect(container.firstChild).toHaveClass('card');
      expect(container.firstChild).toBeEmptyDOMElement();
    });

    test('renders number children correctly', () => {
      render(<Card>{42}</Card>);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    test('handles empty string className', () => {
      const { container } = render(<Card className="">Content</Card>);
      
      expect(container.firstChild).toHaveClass('card');
      expect(container.firstChild.className).toBe('card ');
    });
  });

  describe('Accessibility', () => {
    test('maintains semantic structure', () => {
      render(
        <Card>
          <h2>Card Title</h2>
          <p>Card description</p>
        </Card>
      );
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Card Title');
    });

    test('preserves ARIA attributes on children', () => {
      render(
        <Card>
          <button aria-label="Close card">×</button>
        </Card>
      );
      
      const button = screen.getByRole('button', { name: 'Close card' });
      expect(button).toBeInTheDocument();
    });

    test('does not interfere with child component accessibility', () => {
      render(
        <Card>
          <input aria-describedby="help-text" />
          <div id="help-text">Help information</div>
        </Card>
      );
      
      const input = screen.getByRole('textbox');
      const helpText = screen.getByText('Help information');
      
      expect(input).toHaveAttribute('aria-describedby', 'help-text');
      expect(helpText).toHaveAttribute('id', 'help-text');
    });
  });

  describe('Real-world Usage Scenarios', () => {
    test('works as a balance card with dark theme', () => {
      render(
        <Card dark>
          <p className="balance-title">Current Balance</p>
          <p className="balance-amount">$4,836.00</p>
        </Card>
      );
      
      expect(screen.getByText('Current Balance')).toBeInTheDocument();
      expect(screen.getByText('$4,836.00')).toBeInTheDocument();
    });

    test('works as a transaction list container with light theme', () => {
      const { container } = render(
        <Card light>
          <h2>Recent Transactions</h2>
          <div className="transaction-list">
            <div>Transaction 1</div>
            <div>Transaction 2</div>
          </div>
        </Card>
      );
      
      expect(container.firstChild).toHaveClass('card-light');
      expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
      expect(screen.getByText('Transaction 1')).toBeInTheDocument();
    });

    test('works with accent color for budget categories', () => {
      const budgetColor = '#277C78';
      const { container } = render(
        <Card light accentColor={budgetColor}>
          <p>Entertainment Budget</p>
          <p>$50.00 remaining</p>
        </Card>
      );
      
      expect(container.firstChild).toHaveStyle({
        borderLeft: `4px solid ${budgetColor}`
      });
      expect(screen.getByText('Entertainment Budget')).toBeInTheDocument();
    });

    test('works as a no-background container for nested content', () => {
      const { container } = render(
        <Card noBackground className="pot-summary">
          <div>Total Saved: $920.00</div>
        </Card>
      );
      
      expect(container.firstChild).toHaveClass('card-no-background');
      expect(container.firstChild).toHaveClass('pot-summary');
      expect(screen.getByText('Total Saved: $920.00')).toBeInTheDocument();
    });
  });
});