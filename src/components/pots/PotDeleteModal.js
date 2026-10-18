import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../common/Modal';
import { useMobileDetection } from '../../hooks';
import './PotModal.css';
import './PotDeleteModal.css';

/**
 * Modal asking to confirm that a pot should be deleted
 *
 * @param {Object} props
 * @param {Object|null} props.pot - Pot to delete; the modal is hidden when null
 * @param {Function} props.onConfirm - Called when the deletion is confirmed
 * @param {Function} props.onClose - Called when the modal is closed
 */
const PotDeleteModal = ({ pot, onConfirm, onClose }) => {
  const isMobile = useMobileDetection();

  return (
    <Modal
      isOpen={Boolean(pot)}
      onClose={onClose}
      title={pot ? `Delete ‘${pot.name}’?` : ''}
      className="pot-modal"
    >
      <p className="pot-modal__text">
        {/* The mobile design says "budget"; kept on mobile at the owner's request */}
        Are you sure you want to delete this {isMobile ? 'budget' : 'pot'}? This action cannot be reversed,
        and all the data inside it will be removed forever.
      </p>

      <div className="pot-delete__actions">
        <button type="button" className="pot-delete__confirm" onClick={onConfirm}>
          Yes, Confirm Deletion
        </button>
        <button type="button" className="pot-delete__cancel" onClick={onClose}>
          {isMobile ? 'No, I want to go back' : 'No, Go Back'}
        </button>
      </div>
    </Modal>
  );
};

PotDeleteModal.propTypes = {
  pot: PropTypes.shape({ name: PropTypes.string.isRequired }),
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default PotDeleteModal;
