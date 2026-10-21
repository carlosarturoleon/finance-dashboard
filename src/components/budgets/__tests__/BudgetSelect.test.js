import { render, screen, fireEvent } from '@testing-library/react';
import BudgetSelect from '../BudgetSelect';

const options = [
  { value: '#277C78', label: 'Green', color: '#277C78' },
  { value: '#F2CDAC', label: 'Yellow', color: '#F2CDAC' },
  { value: '#C94736', label: 'Red', color: '#C94736' },
  { value: '#826CB0', label: 'Purple', color: '#826CB0' }
];

const renderBudgetSelect = (props = {}) => {
  const onChange = jest.fn();
  render(
    <>
      <label id="theme-label" htmlFor="theme">Theme</label>
      <BudgetSelect
        id="theme"
        labelId="theme-label"
        value="#C94736"
        options={options}
        disabledValues={['#277C78', '#F2CDAC']}
        onChange={onChange}
        {...props}
      />
    </>
  );
  return { onChange, trigger: screen.getByRole('combobox') };
};

describe('BudgetSelect Component', () => {
  describe('Rendering', () => {
    test('shows the selected theme name and keeps the list closed', () => {
      const { trigger } = renderBudgetSelect();

      expect(trigger).toHaveTextContent('Red');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    test('lists every theme and marks used ones as "Already used"', () => {
      const { trigger } = renderBudgetSelect();
      fireEvent.click(trigger);

      expect(screen.getAllByRole('option')).toHaveLength(4);
      expect(screen.getAllByText('Already used')).toHaveLength(2);
      expect(screen.getByRole('option', { name: /Green/ })).toHaveAttribute('aria-disabled', 'true');
      expect(screen.getByRole('option', { name: /Red/ })).toHaveAttribute('aria-selected', 'true');
    });

    test('shows a check mark only on the selected theme and flips the caret while open', () => {
      const { trigger } = renderBudgetSelect();
      expect(trigger).not.toHaveClass('budget-select__trigger--open');

      fireEvent.click(trigger);

      expect(trigger).toHaveClass('budget-select__trigger--open');
      const checks = document.querySelectorAll('.budget-select__check');
      expect(checks).toHaveLength(1);
      expect(screen.getByRole('option', { name: /Red/ })).toContainElement(checks[0]);
    });
  });

  test('does not open when disabled', () => {
    const { trigger } = renderBudgetSelect({ disabled: true });
    fireEvent.click(trigger);

    expect(trigger).toBeDisabled();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('works without colors or disabled options', () => {
    const onChange = jest.fn();
    render(
      <BudgetSelect
        id="category"
        value="Bills"
        options={[{ value: 'Bills', label: 'Bills' }, { value: 'Groceries', label: 'Groceries' }]}
        onChange={onChange}
      />
    );
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByRole('option', { name: 'Groceries' }));

    expect(onChange).toHaveBeenCalledWith('Groceries');
    expect(screen.queryByText('Already used')).not.toBeInTheDocument();
  });

  describe('Mouse', () => {
    test('selects an available theme and closes', () => {
      const { onChange, trigger } = renderBudgetSelect();
      fireEvent.click(trigger);
      fireEvent.click(screen.getByRole('option', { name: /Purple/ }));

      expect(onChange).toHaveBeenCalledWith('#826CB0');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    test('ignores clicks on themes already used', () => {
      const { onChange, trigger } = renderBudgetSelect();
      fireEvent.click(trigger);
      fireEvent.click(screen.getByRole('option', { name: /Green/ }));

      expect(onChange).not.toHaveBeenCalled();
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    test('closes when clicking outside', () => {
      const { trigger } = renderBudgetSelect();
      fireEvent.click(trigger);
      fireEvent.mouseDown(document.body);

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Keyboard', () => {
    test('opens with ArrowDown, skips used themes and selects with Enter', () => {
      const { onChange, trigger } = renderBudgetSelect();

      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      expect(trigger).toHaveAttribute('aria-activedescendant', 'theme-option-2');

      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      expect(trigger).toHaveAttribute('aria-activedescendant', 'theme-option-3');

      // Moving up from Red stops there, because Green and Yellow are used
      fireEvent.keyDown(trigger, { key: 'ArrowUp' });
      fireEvent.keyDown(trigger, { key: 'ArrowUp' });
      expect(trigger).toHaveAttribute('aria-activedescendant', 'theme-option-2');

      fireEvent.keyDown(trigger, { key: 'Enter' });
      expect(onChange).toHaveBeenCalledWith('#C94736');
    });

    test('Escape closes the list without reaching document listeners', () => {
      const documentListener = jest.fn();
      document.addEventListener('keydown', documentListener);
      const { trigger } = renderBudgetSelect();

      fireEvent.click(trigger);
      fireEvent.keyDown(trigger, { key: 'Escape' });

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(documentListener).not.toHaveBeenCalled();
      document.removeEventListener('keydown', documentListener);
    });
  });
});
