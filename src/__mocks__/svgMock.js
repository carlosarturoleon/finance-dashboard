import React from 'react';

// Mock for SVG imports
const SvgMock = React.forwardRef((props, ref) => {
  return React.createElement('svg', {
    ...props,
    ref,
    'data-testid': props['data-testid'] || 'svg-mock'
  });
});

SvgMock.displayName = 'SvgMock';

// Export as both named and default export to handle different import styles
export const ReactComponent = SvgMock;
export default SvgMock;