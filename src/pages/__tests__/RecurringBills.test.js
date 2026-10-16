import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { DataProvider } from '../../context/DataContext';
import RecurringBills from '../RecurringBills';

const renderPage = () =>
  render(
    <DataProvider>
      <RecurringBills />
    </DataProvider>
  );

const billNames = () =>
  screen.getAllByRole('row').slice(1).map((row) => within(row).getAllByRole('cell')[0].textContent);

describe('RecurringBills Page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('shows the total and the summary from the sample data', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: 'Recurring Bills' })).toBeInTheDocument();
    expect(screen.getByText('$384.98')).toBeInTheDocument();
    expect(screen.getByText('4 ($190.00)')).toBeInTheDocument();
    expect(screen.getByText('4 ($194.98)')).toBeInTheDocument();
    expect(screen.getByText('2 ($59.98)')).toBeInTheDocument();
  });

  test('lists bills in the order they come due', () => {
    renderPage();

    expect(billNames()).toEqual([
      'Spark Electric Solutions',
      'Serenity Spa & Wellness',
      'Elevate Education',
      'Pixel Playground',
      'Nimbus Data Storage',
      'ByteWise',
      'EcoFuel Energy',
      'Aqua Flow Utilities'
    ]);
  });

  test('filters bills by name', async () => {
    renderPage();

    fireEvent.change(screen.getByLabelText('Search bills'), { target: { value: 'byte' } });

    await waitFor(() => expect(billNames()).toEqual(['ByteWise']));
  });

  test('shows a message when no bill matches', async () => {
    renderPage();

    fireEvent.change(screen.getByLabelText('Search bills'), { target: { value: 'zzz' } });

    expect(await screen.findByText('No recurring bills found')).toBeInTheDocument();
  });

  test('sorts bills with the dropdown', () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: /Latest/ }));
    fireEvent.click(screen.getByRole('option', { name: 'Highest' }));

    expect(billNames()[0]).toBe('Spark Electric Solutions');
    expect(billNames()[7]).toBe('Nimbus Data Storage');
  });
});
