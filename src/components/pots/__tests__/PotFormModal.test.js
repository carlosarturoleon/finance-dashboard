import { render, screen, fireEvent } from '@testing-library/react';
import PotFormModal from '../PotFormModal';
import { useMobileDetection } from '../../../hooks';

jest.mock('../../../hooks', () => ({ useMobileDetection: jest.fn(() => false) }));

const renderModal = (props = {}) => {
  const handlers = { onSubmit: jest.fn(), onClose: jest.fn() };
  render(<PotFormModal isOpen mode="add" {...handlers} {...props} />);
  return handlers;
};

describe('PotFormModal Component', () => {
  describe('Rendering', () => {
    test('shows the add pot title, text, fields and button', () => {
      renderModal();

      expect(screen.getByRole('heading', { name: 'Add New Pot' })).toBeInTheDocument();
      expect(screen.getByText(/Create a pot to set savings targets/)).toBeInTheDocument();
      expect(screen.getByLabelText('Pot Name')).toHaveAttribute('placeholder', 'e.g. Rainy Days');
      expect(screen.getByLabelText('Target')).toHaveAttribute('placeholder', 'e.g. 2000');
      expect(screen.getByRole('button', { name: /Theme/ })).toHaveTextContent('Green');
      expect(screen.getByRole('button', { name: 'Add Pot' })).toBeInTheDocument();
    });

    test('shows the edit copy and fills in the pot being edited', () => {
      renderModal({
        mode: 'edit',
        pot: { name: 'Savings', target: 2000, theme: '#82C9D7' }
      });

      expect(screen.getByRole('heading', { name: 'Edit Pot' })).toBeInTheDocument();
      expect(screen.getByLabelText('Pot Name')).toHaveValue('Savings');
      expect(screen.getByLabelText('Target')).toHaveValue('2000.00');
      expect(screen.getByRole('button', { name: /Theme/ })).toHaveTextContent('Cyan');
      expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
    });

    test('renders nothing when closed', () => {
      renderModal({ isOpen: false });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Pot name', () => {
    test('counts down the characters left', () => {
      renderModal();

      expect(screen.getByText('30 characters left')).toBeInTheDocument();
      fireEvent.change(screen.getByLabelText('Pot Name'), { target: { value: 'Holiday' } });
      expect(screen.getByText('23 characters left')).toBeInTheDocument();
    });

    test('names the theme field Color Tag and shows the limit on mobile', () => {
      useMobileDetection.mockReturnValue(true);
      renderModal();
      expect(screen.getByRole('button', { name: /Color Tag/ })).toHaveTextContent('Green');
      expect(screen.getByText('30 of 30 characters left')).toBeInTheDocument();
      useMobileDetection.mockReturnValue(false);
    });

    test('limits the name to 30 characters', () => {
      renderModal();
      expect(screen.getByLabelText('Pot Name')).toHaveAttribute('maxLength', '30');
    });
  });

  describe('Theme', () => {
    test('opens the list and picks a theme', () => {
      renderModal();

      fireEvent.click(screen.getByRole('button', { name: /Theme/ }));
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('option', { name: 'Purple' }));
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Theme/ })).toHaveTextContent('Purple');
    });

    test('Escape closes the list without closing the modal', () => {
      const { onClose } = renderModal();

      fireEvent.click(screen.getByRole('button', { name: /Theme/ }));
      fireEvent.keyDown(screen.getByRole('option', { name: 'Green' }), { key: 'Escape' });

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(onClose).not.toHaveBeenCalled();
    });

    test('clicking outside closes the list', () => {
      renderModal();

      fireEvent.click(screen.getByRole('button', { name: /Theme/ }));
      fireEvent.mouseDown(screen.getByLabelText('Pot Name'));
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Submitting', () => {
    test('sends the trimmed name, numeric target and theme', () => {
      const { onSubmit } = renderModal();

      fireEvent.change(screen.getByLabelText('Pot Name'), { target: { value: '  Rainy Days ' } });
      fireEvent.change(screen.getByLabelText('Target'), { target: { value: '2000' } });
      fireEvent.click(screen.getByRole('button', { name: /Theme/ }));
      fireEvent.click(screen.getByRole('option', { name: 'Gold' }));
      fireEvent.click(screen.getByRole('button', { name: 'Add Pot' }));

      expect(onSubmit).toHaveBeenCalledWith({ name: 'Rainy Days', target: 2000, theme: '#D5A44A' });
    });

    test('the close button calls onClose', () => {
      const { onClose } = renderModal();
      fireEvent.click(screen.getByRole('button', { name: 'Close modal' }));
      expect(onClose).toHaveBeenCalled();
    });
  });
});
