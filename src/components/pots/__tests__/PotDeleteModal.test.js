import { render, screen, fireEvent } from '@testing-library/react';
import PotDeleteModal from '../PotDeleteModal';
import { useMobileDetection } from '../../../hooks';

jest.mock('../../../hooks', () => ({ useMobileDetection: jest.fn(() => false) }));

const renderModal = (pot = { name: 'Savings' }) => {
  const handlers = { onConfirm: jest.fn(), onClose: jest.fn() };
  render(<PotDeleteModal pot={pot} {...handlers} />);
  return handlers;
};

describe('PotDeleteModal Component', () => {
  test('shows the pot name in the title and the warning text', () => {
    renderModal();

    expect(screen.getByRole('heading', { name: 'Delete ‘Savings’?' })).toBeInTheDocument();
    expect(screen.getByText(/This action cannot be reversed/)).toBeInTheDocument();
  });

  test('renders nothing without a pot', () => {
    renderModal(null);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('confirming calls onConfirm', () => {
    const { onConfirm, onClose } = renderModal();
    fireEvent.click(screen.getByRole('button', { name: 'Yes, Confirm Deletion' }));
    expect(onConfirm).toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  test('going back calls onClose', () => {
    const { onConfirm, onClose } = renderModal();
    fireEvent.click(screen.getByRole('button', { name: 'No, Go Back' }));
    expect(onClose).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  test('uses the mobile design text on mobile', () => {
    useMobileDetection.mockReturnValue(true);
    renderModal();
    expect(screen.getByText(/delete this budget\?/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'No, I want to go back' })).toBeInTheDocument();
    useMobileDetection.mockReturnValue(false);
  });
});
