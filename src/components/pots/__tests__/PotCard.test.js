import { render, screen, fireEvent } from '@testing-library/react';
import PotCard from '../PotCard';

const pot = { name: 'Savings', target: 2000, total: 159, theme: '#277C78' };

const renderPotCard = (overrides = {}) => {
  const handlers = {
    onAddMoney: jest.fn(),
    onWithdraw: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };
  render(<PotCard pot={{ ...pot, ...overrides }} {...handlers} />);
  return handlers;
};

describe('PotCard Component', () => {
  describe('Rendering', () => {
    test('shows the pot name, total saved and target', () => {
      renderPotCard();

      expect(screen.getByRole('heading', { name: 'Savings' })).toBeInTheDocument();
      expect(screen.getByText('Total Saved')).toBeInTheDocument();
      expect(screen.getByText('$159.00')).toBeInTheDocument();
      expect(screen.getByText('Target of $2,000')).toBeInTheDocument();
    });

    test('shows the percentage saved and fills the bar', () => {
      renderPotCard();

      expect(screen.getByText('7.95%')).toBeInTheDocument();
      const bar = screen.getByRole('progressbar', { name: 'Savings progress' });
      expect(bar).toHaveAttribute('aria-valuenow', '7.95');
      expect(bar.firstChild.style.width).toBe('7.95%');
    });

    test('caps the bar at 100% when the target is exceeded', () => {
      renderPotCard({ total: 3000 });
      expect(screen.getByRole('progressbar').firstChild.style.width).toBe('100%');
    });

    test('disables Withdraw when the pot is empty', () => {
      renderPotCard({ total: 0 });
      expect(screen.getByRole('button', { name: 'Withdraw' })).toBeDisabled();
    });
  });

  describe('Actions', () => {
    test('calls onAddMoney and onWithdraw with the pot', () => {
      const { onAddMoney, onWithdraw } = renderPotCard();

      fireEvent.click(screen.getByRole('button', { name: '+ Add Money' }));
      fireEvent.click(screen.getByRole('button', { name: 'Withdraw' }));

      expect(onAddMoney).toHaveBeenCalledWith(pot);
      expect(onWithdraw).toHaveBeenCalledWith(pot);
    });
  });

  describe('Options menu', () => {
    test('opens the menu and calls onEdit', () => {
      const { onEdit } = renderPotCard();
      const menuButton = screen.getByRole('button', { name: 'Options for Savings pot' });

      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      fireEvent.click(menuButton);
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');

      fireEvent.click(screen.getByRole('menuitem', { name: 'Edit Pot' }));
      expect(onEdit).toHaveBeenCalledWith(pot);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    test('calls onDelete from the menu', () => {
      const { onDelete } = renderPotCard();

      fireEvent.click(screen.getByRole('button', { name: 'Options for Savings pot' }));
      fireEvent.click(screen.getByRole('menuitem', { name: 'Delete Pot' }));

      expect(onDelete).toHaveBeenCalledWith(pot);
    });

    test('closes the menu with Escape and on outside click', () => {
      renderPotCard();
      const menuButton = screen.getByRole('button', { name: 'Options for Savings pot' });

      fireEvent.click(menuButton);
      fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();

      fireEvent.click(menuButton);
      fireEvent.mouseDown(document.body);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });
});
