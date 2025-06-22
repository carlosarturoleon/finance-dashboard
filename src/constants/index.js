// Breakpoints
export const BREAKPOINTS = {
  MOBILE: 767,
  TABLET: 1024,
  DESKTOP: 1200
};

// Pagination configuration
export const PAGINATION = {
  RESULTS_PER_PAGE: 10,
  MAX_BUTTONS: 5
};

// Debounce delays
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  RESIZE: 150
};

// Sort options
export const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'a-z', label: 'A to Z' },
  { value: 'z-a', label: 'Z to A' },
  { value: 'highest', label: 'Highest' },
  { value: 'lowest', label: 'Lowest' }
];

// Focus management
export const FOCUS_TRAP_OPTIONS = {
  initialFocus: false,
  fallbackFocus: 'body',
  escapeDeactivates: true,
  clickOutsideDeactivates: true
};