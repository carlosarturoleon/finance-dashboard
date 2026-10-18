import { render, screen, fireEvent } from '@testing-library/react';
import BillRow from '../BillRow';
import { BILL_STATUS } from '../../../utils/billUtils';
import { formatDateTime } from '../../../utils/dateUtils';

const bill = {
  name: 'Spark Electric Solutions',
  date: '2024-08-02T09:25:11Z',
  amount: -100,
  avatar: './assets/images/avatars/spark-electric-solutions.jpg'
};

const renderRow = (status, overrides = {}) =>
  render(
    <table>
      <tbody>
        <BillRow bill={{ ...bill, ...overrides }} status={status} />
      </tbody>
    </table>
  );

describe('BillRow Component', () => {
  test('shows the name, due date with time and amount', () => {
    renderRow(BILL_STATUS.PAID);

    expect(screen.getByText('Spark Electric Solutions')).toBeInTheDocument();
    expect(screen.getByText(formatDateTime(bill.date))).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
  });

  test.each([
    [BILL_STATUS.PAID, 'Paid'],
    [BILL_STATUS.DUE_SOON, 'Due soon'],
    [BILL_STATUS.UPCOMING, 'Upcoming']
  ])('marks a %s bill for screen readers', (status, label) => {
    const { container } = renderRow(status);

    expect(screen.getByText(label)).toHaveClass('visually-hidden');
    expect(container.querySelector('tr')).toHaveClass(`bill-row--${status}`);
  });

  test('shows a status icon only for paid and due soon bills', () => {
    const { container, rerender } = renderRow(BILL_STATUS.UPCOMING);
    expect(container.querySelector('.bill-row__status-icon')).toBeNull();

    rerender(
      <table>
        <tbody>
          <BillRow bill={bill} status={BILL_STATUS.DUE_SOON} />
        </tbody>
      </table>
    );
    expect(container.querySelector('.bill-row__status-icon')).not.toBeNull();
  });

  test('falls back to the first letter when the avatar fails to load', () => {
    const { container } = renderRow(BILL_STATUS.PAID);

    fireEvent.error(container.querySelector('img'));

    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('S')).toBeInTheDocument();
  });

  test('shows the first letter when there is no avatar', () => {
    renderRow(BILL_STATUS.PAID, { avatar: undefined });
    expect(screen.getByText('S')).toBeInTheDocument();
  });
});
