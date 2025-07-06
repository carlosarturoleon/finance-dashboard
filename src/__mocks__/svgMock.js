import React from 'react';

// Mock for SVG imports - handles both default and ReactComponent exports
const SvgMock = React.forwardRef((props, ref) => {
  const { children, ...otherProps } = props;
  return React.createElement('svg', {
    ...otherProps,
    ref,
    'data-testid': props['data-testid'] || 'svg-mock',
    width: props.width || '24',
    height: props.height || '24',
    viewBox: props.viewBox || '0 0 24 24'
  }, children);
});

SvgMock.displayName = 'SvgMock';

// Export as both named and default export to handle different import styles
// Your Navigation.js uses: import { ReactComponent as HomeIcon } from "...svg"
export const ReactComponent = SvgMock;
export default SvgMock;