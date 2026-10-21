import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BILL_STATUS, formatCurrency } from '../../utils/billUtils';
import { formatDateTime } from '../../utils/dateUtils';
import { ReactComponent as PaidIcon } from '../../assets/images/icon-bill-paid.svg';
import { ReactComponent as DueIcon } from '../../assets/images/icon-bill-due.svg';
import './BillRow.css';

const STATUS_LABELS = {
  [BILL_STATUS.PAID]: 'Paid',
  [BILL_STATUS.DUE_SOON]: 'Due soon',
  [BILL_STATUS.UPCOMING]: 'Upcoming'
};

const BillRow = ({ bill, status }) => {
  const [imageError, setImageError] = useState(false);
  const showAvatar = bill.avatar && !imageError;

  return (
    <tr className={`bill-row bill-row--${status}`}>
      <td className="bill-row__cell bill-row__cell--title">
        <div className="bill-row__title">
          <div className="bill-row__avatar" aria-hidden="true">
            {showAvatar ? (
              <img
                src={bill.avatar}
                alt=""
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              bill.name.charAt(0)
            )}
          </div>
          <span className="bill-row__name">{bill.name}</span>
        </div>
      </td>
      <td className="bill-row__cell bill-row__cell--due">
        <div className="bill-row__due">
          <span>{formatDateTime(bill.date)}</span>
          {status === BILL_STATUS.PAID && (
            <PaidIcon className="bill-row__status-icon" aria-hidden="true" />
          )}
          {status === BILL_STATUS.DUE_SOON && (
            <DueIcon className="bill-row__status-icon" aria-hidden="true" />
          )}
          <span className="visually-hidden">{STATUS_LABELS[status]}</span>
        </div>
      </td>
      <td className="bill-row__cell bill-row__cell--amount">
        {formatCurrency(bill.amount)}
      </td>
    </tr>
  );
};

BillRow.propTypes = {
  bill: PropTypes.shape({
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    avatar: PropTypes.string
  }).isRequired,
  status: PropTypes.oneOf(Object.values(BILL_STATUS)).isRequired
};

export default BillRow;
