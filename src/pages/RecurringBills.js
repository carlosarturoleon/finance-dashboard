import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Card } from '../components/common';
import CustomDropdown from '../components/common/CustomDropdown';
import ErrorBoundary from '../components/common/ErrorBoundary';
import BillRow from '../components/recurring/BillRow';
import { useDebounce } from '../hooks';
import { sanitizeSearchInput } from '../utils/transactionUtils';
import { formatCurrency, getBillStatus, getBillSummary, sortBills } from '../utils/billUtils';
import { DEBOUNCE_DELAYS, SORT_OPTIONS } from '../constants';
import './RecurringBills.css';

import { ReactComponent as BillsIcon } from '../assets/images/icon-recurring-bills.svg';
import { ReactComponent as SearchIcon } from '../assets/images/icon-search.svg';
import { ReactComponent as CaretDownIcon } from '../assets/images/icon-caret-down.svg';

const formatGroup = ({ count, amount }) => `${count} (${formatCurrency(amount)})`;

const RecurringBills = () => {
  const { getRecurringBills, data } = useData();
  const [rawSearch, setRawSearch] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const search = useDebounce(sanitizeSearchInput(rawSearch), DEBOUNCE_DELAYS.SEARCH);

  const recurringBills = getRecurringBills();

  // The latest transaction stands in for "today" in the sample data
  const referenceDate = useMemo(() => {
    const dates = data.transactions.map((t) => new Date(t.date));
    return new Date(Math.max(...dates));
  }, [data.transactions]);

  const summary = getBillSummary(recurringBills, referenceDate);

  const visibleBills = useMemo(() => {
    const query = search.toLowerCase();
    const filtered = recurringBills.filter((bill) =>
      bill.name.toLowerCase().includes(query)
    );
    return sortBills(filtered, sortBy);
  }, [recurringBills, search, sortBy]);

  return (
    <ErrorBoundary>
      <div className="recurring-bills">
        <h1 className="recurring-bills__heading">Recurring bills</h1>

        <div className="recurring-bills__layout">
          <div className="recurring-bills__overview">
            <Card dark className="recurring-bills__card recurring-bills__total">
              <div className="recurring-bills__total-icon" aria-hidden="true">
                <BillsIcon />
              </div>
              <div className="recurring-bills__total-texts">
                <h2 className="recurring-bills__total-label">Total bills</h2>
                <p className="recurring-bills__total-value">{formatCurrency(summary.total)}</p>
              </div>
            </Card>

            <Card light className="recurring-bills__card recurring-bills__summary">
              <h2 className="recurring-bills__summary-heading">Summary</h2>
              <dl className="recurring-bills__summary-list">
                <div className="recurring-bills__summary-item">
                  <dt>Paid Bills</dt>
                  <dd>{formatGroup(summary.paid)}</dd>
                </div>
                <div className="recurring-bills__summary-item">
                  <dt>Total Upcoming</dt>
                  <dd>{formatGroup(summary.upcoming)}</dd>
                </div>
                <div className="recurring-bills__summary-item recurring-bills__summary-item--due-soon">
                  <dt>Due soon</dt>
                  <dd>{formatGroup(summary.dueSoon)}</dd>
                </div>
              </dl>
            </Card>
          </div>

          <Card light className="recurring-bills__card recurring-bills__list">
            <div className="recurring-bills__filters">
              <div className="recurring-bills__search">
                <input
                  type="text"
                  placeholder="Search bills"
                  value={rawSearch}
                  onChange={(e) => setRawSearch(e.target.value)}
                  className="recurring-bills__search-input"
                  aria-label="Search bills"
                  maxLength={100}
                />
                <SearchIcon className="recurring-bills__search-icon" aria-hidden="true" />
              </div>

              <div className="recurring-bills__sort">
                <CustomDropdown
                  value={sortBy}
                  onChange={setSortBy}
                  options={SORT_OPTIONS}
                  placeholder="Select sort"
                  label="Sort by"
                  CaretIcon={CaretDownIcon}
                />
              </div>
            </div>

            <table className="recurring-bills__table" aria-label="Recurring bills">
              <thead>
                <tr>
                  <th scope="col" className="recurring-bills__table-header">Bill Title</th>
                  <th scope="col" className="recurring-bills__table-header recurring-bills__table-header--due">
                    Due Date
                  </th>
                  <th scope="col" className="recurring-bills__table-header recurring-bills__table-header--amount">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleBills.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="recurring-bills__no-results">
                      No recurring bills found
                    </td>
                  </tr>
                ) : (
                  visibleBills.map((bill) => (
                    <BillRow
                      key={bill.name}
                      bill={bill}
                      status={getBillStatus(bill.date, referenceDate)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default RecurringBills;
