import { render, screen, fireEvent } from '@testing-library/react';
import PotMoneyModal from '../PotMoneyModal';

const pot = { name: 'Savings', total: 159, target: 2000 };

const renderModal = (props = {}) => {
  const handlers = { onConfirm: jest.fn(), onClose: jest.fn() };
  render(<PotMoneyModal pot={pot} {...handlers} {...props} />);
  return handlers;
};

const typeAmount = (value) =>
  fireEvent.change(screen.getByLabelText('Amount to Withdraw'), { target: { value } });

describe('PotMoneyModal Component', () => {
  test('shows the title, current amount and target', () => {
    renderModal();

    expect(screen.getByRole('heading', { name: 'Withdraw from ‘Savings’' })).toBeInTheDocument();
    expect(screen.getByText('New Amount')).toBeInTheDocument();
    expect(screen.getByText('$159.00')).toBeInTheDocument();
    expect(screen.getByText('7.95%')).toBeInTheDocument();
    expect(screen.getByText('Target of $2,000')).toBeInTheDocument();
  });

  test('renders nothing without a pot', () => {
    renderModal({ pot: null });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('previews the new amount and percentage while typing', () => {
    renderModal();
    typeAmount('20');

    expect(screen.getByText('$139.00')).toBeInTheDocument();
    expect(screen.getByText('6.95%')).toHaveClass('pot-money__percentage--withdraw');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '6.95');
  });

  test('confirms the amount to withdraw', () => {
    const { onConfirm } = renderModal();
    typeAmount('20');
    fireEvent.click(screen.getByRole('button', { name: 'Confirm Withdrawal' }));
    expect(onConfirm).toHaveBeenCalledWith(20);
  });

  test('blocks withdrawing more than the pot has', () => {
    const { onConfirm } = renderModal();
    typeAmount('500');

    expect(screen.getByRole('alert')).toHaveTextContent('You can withdraw up to $159.00');
    expect(screen.getByRole('button', { name: 'Confirm Withdrawal' })).toBeDisabled();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  test('the button is disabled until an amount is entered', () => {
    renderModal();
    expect(screen.getByRole('button', { name: 'Confirm Withdrawal' })).toBeDisabled();
  });
});

describe('PotMoneyModal Component in add mode', () => {
  const renderAddModal = (props = {}) =>
    renderModal({ mode: 'add', balance: 4836, ...props });

  const typeAddAmount = (value) =>
    fireEvent.change(screen.getByLabelText('Amount to Add'), { target: { value } });

  test('shows the add title and button', () => {
    renderAddModal();

    expect(screen.getByRole('heading', { name: 'Add to ‘Savings’' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm Addition' })).toBeDisabled();
  });

  test('previews the new amount and percentage while typing', () => {
    renderAddModal();
    typeAddAmount('400');

    expect(screen.getByText('$559.00')).toBeInTheDocument();
    expect(screen.getByText('27.95%')).toHaveClass('pot-money__percentage--add');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '27.95');
  });

  test('confirms the amount to add', () => {
    const { onConfirm } = renderAddModal();
    typeAddAmount('400');
    fireEvent.click(screen.getByRole('button', { name: 'Confirm Addition' }));
    expect(onConfirm).toHaveBeenCalledWith(400);
  });

  test('blocks adding more than the current balance', () => {
    const { onConfirm } = renderAddModal({ balance: 100 });
    typeAddAmount('400');

    expect(screen.getByRole('alert')).toHaveTextContent('You can add up to $100.00');
    expect(screen.getByRole('button', { name: 'Confirm Addition' })).toBeDisabled();
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
