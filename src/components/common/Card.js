import React from 'react';
import './Card.css';

/**
 * Card component for displaying content in a consistent container
 * 
 * @param {Object} props
 * @param {string} props.className - Optional additional CSS class
 * @param {boolean} props.dark - Whether to use dark background (for balance)
 * @param {boolean} props.light - Whether to use light background (for summary items)
 * @param {boolean} props.noBackground - Whether to render without background
 * @param {string} props.accentColor - Optional left border accent color
 * @param {React.ReactNode} props.children - Card content
 */
const Card = ({ 
  className = '', 
  dark = false,
  light = false,
  noBackground = false,
  accentColor,
  children 
}) => {
  let cardClass = 'card';
  
  if (dark) cardClass += ' card-dark';
  if (light) cardClass += ' card-light';
  if (noBackground) cardClass += ' card-no-background';
  
  const style = accentColor ? { borderLeft: `4px solid ${accentColor}` } : {};
  
  return (
    <div className={`${cardClass} ${className}`} style={style}>
      {children}
    </div>
  );
};

export default Card;