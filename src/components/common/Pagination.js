import React from 'react';
import PropTypes from 'prop-types';
import './Pagination.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  maxButtons = 5,
  PrevIcon,
  NextIcon
}) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  // Generate pagination buttons
  const getPaginationButtons = () => {
    const buttons = [];
    
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button 
          key={i} 
          onClick={() => handlePageClick(i)}
          className={`pagination__page-button ${i === currentPage ? 'pagination__page-button--active' : ''}`}
          aria-current={i === currentPage ? 'page' : undefined}
          aria-label={`Page ${i}`}
        >
          {i}
        </button>
      );
    }
    
    return buttons;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <button 
        onClick={handlePrevPage} 
        disabled={currentPage === 1}
        className="pagination__control pagination__control--prev"
        aria-label="Previous page"
      >
        {PrevIcon && <PrevIcon aria-hidden="true" />}
        <span>Prev</span>
      </button>
      
      <div className="pagination__buttons" role="navigation" aria-label="Pagination">
        {getPaginationButtons()}
      </div>
      
      <button 
        onClick={handleNextPage} 
        disabled={currentPage === totalPages}
        className="pagination__control pagination__control--next"
        aria-label="Next page"
      >
        <span>Next</span>
        {NextIcon && <NextIcon aria-hidden="true" />}
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  maxButtons: PropTypes.number,
  PrevIcon: PropTypes.elementType,
  NextIcon: PropTypes.elementType
};

export default Pagination;