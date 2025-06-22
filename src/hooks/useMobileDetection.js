import { useState, useEffect } from 'react';
import { BREAKPOINTS, DEBOUNCE_DELAYS } from '../constants';

export const useMobileDetection = (breakpoint = BREAKPOINTS.MOBILE) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let timeoutId;
    
    const checkIsMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth <= breakpoint);
      }, DEBOUNCE_DELAYS.RESIZE);
    };
    
    // Initial check
    checkIsMobile();
    
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
      clearTimeout(timeoutId);
    };
  }, [breakpoint]);

  return isMobile;
};