import React, { useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

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

    if (isMobile) {
      // Mobile logic: show only 1, 2, ..., last (max 4 buttons)
      if (totalPages <= 4) {
        for (let i = 1; i <= totalPages; i++) {
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
      } else {
        // Mobile: always show exactly 4 buttons that adapt to current page
        if (currentPage <= 2) {
          // Show: 1, 2, ..., last
          buttons.push(
            <button 
              key={1} 
              onClick={() => handlePageClick(1)}
              className={`pagination__page-button ${1 === currentPage ? 'pagination__page-button--active' : ''}`}
              aria-current={1 === currentPage ? 'page' : undefined}
              aria-label="Page 1"
            >
              1
            </button>
          );
          buttons.push(
            <button 
              key={2} 
              onClick={() => handlePageClick(2)}
              className={`pagination__page-button ${2 === currentPage ? 'pagination__page-button--active' : ''}`}
              aria-current={2 === currentPage ? 'page' : undefined}
              aria-label="Page 2"
            >
              2
            </button>
          );
          buttons.push(
            <button 
              key="ellipsis" 
              onClick={() => handlePageClick(Math.floor(totalPages/2))}
              className="pagination__ellipsis-button"
              aria-label="Jump to middle"
            >
              ...
            </button>
          );
          buttons.push(
            <button 
              key={totalPages} 
              onClick={() => handlePageClick(totalPages)}
              className={`pagination__page-button ${totalPages === currentPage ? 'pagination__page-button--active' : ''}`}
              aria-current={totalPages === currentPage ? 'page' : undefined}
              aria-label={`Page ${totalPages}`}
            >
              {totalPages}
            </button>
          );
        } else if (currentPage >= totalPages - 1) {
          // Show: 1, ..., second-to-last, last
          buttons.push(
            <button 
              key={1} 
              onClick={() => handlePageClick(1)}
              className={`pagination__page-button ${1 === currentPage ? 'pagination__page-button--active' : ''}`}
              aria-current={1 === currentPage ? 'page' : undefined}
              aria-label="Page 1"
            >
              1
            </button>
          );
          buttons.push(
            <button 
              key="ellipsis" 
              onClick={() => handlePageClick(Math.floor(totalPages/2))}
              className="pagination__ellipsis-button"
              aria-label="Jump to middle"
            >
              ...
            </button>
          );
          buttons.push(
            <button 
              key={totalPages-1} 
              onClick={() => handlePageClick(totalPages-1)}
              className={`pagination__page-button ${(totalPages-1) === currentPage ? 'pagination__page-button--active' : ''}`}
              aria-current={(totalPages-1) === currentPage ? 'page' : undefined}
              aria-label={`Page ${totalPages-1}`}
            >
              {totalPages-1}
            </button>
          );
          buttons.push(
            <button 
              key={totalPages} 
              onClick={() => handlePageClick(totalPages)}
              className={`pagination__page-button ${totalPages === currentPage ? 'pagination__page-button--active' : ''}`}
              aria-current={totalPages === currentPage ? 'page' : undefined}
              aria-label={`Page ${totalPages}`}
            >
              {totalPages}
            </button>
          );
        } else {
          // Show: 1, current, ..., last
          buttons.push(
            <button 
              key={1} 
              onClick={() => handlePageClick(1)}
              className="pagination__page-button"
              aria-label="Page 1"
            >
              1
            </button>
          );
          buttons.push(
            <button 
              key={currentPage} 
              onClick={() => handlePageClick(currentPage)}
              className="pagination__page-button pagination__page-button--active"
              aria-current="page"
              aria-label={`Page ${currentPage}`}
            >
              {currentPage}
            </button>
          );
          buttons.push(
            <button 
              key="ellipsis" 
              onClick={() => handlePageClick(Math.ceil((currentPage + totalPages)/2))}
              className="pagination__ellipsis-button"
              aria-label="Jump forward"
            >
              ...
            </button>
          );
          buttons.push(
            <button 
              key={totalPages} 
              onClick={() => handlePageClick(totalPages)}
              className="pagination__page-button"
              aria-label={`Page ${totalPages}`}
            >
              {totalPages}
            </button>
          );
        }
      }
    } else {
      // Desktop logic: show more buttons with proper range
      if (totalPages <= maxButtons) {
        // Show all pages if they fit within maxButtons limit
        for (let i = 1; i <= totalPages; i++) {
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
      } else {
        // Desktop: show range around current page with ellipsis
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);
        
        // Adjust startPage if we're near the end
        if (endPage - startPage + 1 < maxButtons) {
          startPage = Math.max(1, endPage - maxButtons + 1);
        }
        
        // Show ellipsis at the beginning if needed
        if (startPage > 1) {
          buttons.push(
            <button 
              key={1} 
              onClick={() => handlePageClick(1)}
              className={`pagination__page-button ${1 === currentPage ? 'pagination__page-button--active' : ''}`}
              aria-current={1 === currentPage ? 'page' : undefined}
              aria-label="Page 1"
            >
              1
            </button>
          );
          
          if (startPage > 2) {
            const jumpPage = Math.floor((1 + startPage) / 2);
            buttons.push(
              <button 
                key="ellipsis-start" 
                onClick={() => handlePageClick(jumpPage)}
                className="pagination__ellipsis-button"
                aria-label={`Jump to page ${jumpPage}`}
              >
                ...
              </button>
            );
          }
        }
        
        // Show the main range
        for (let i = startPage; i <= endPage; i++) {
          if (i !== 1 && i !== totalPages) { // Don't duplicate first and last
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
        }
        
        // Show ellipsis at the end if needed
        if (endPage < totalPages) {
          if (endPage < totalPages - 1) {
            const jumpPage = Math.ceil((endPage + totalPages) / 2);
            buttons.push(
              <button 
                key="ellipsis-end" 
                onClick={() => handlePageClick(jumpPage)}
                className="pagination__ellipsis-button"
                aria-label={`Jump to page ${jumpPage}`}
              >
                ...
              </button>
            );
          }
          
          buttons.push(
            <button 
              key={totalPages} 
              onClick={() => handlePageClick(totalPages)}
              className={`pagination__page-button ${totalPages === currentPage ? 'pagination__page-button--active' : ''}`}
              aria-current={totalPages === currentPage ? 'page' : undefined}
              aria-label={`Page ${totalPages}`}
            >
              {totalPages}
            </button>
          );
        }
      }
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