// Force framer-motion to respect reduced motion globally
// This script runs before any React components hydrate

// Override matchMedia to always return true for prefers-reduced-motion
const originalMatchMedia = window.matchMedia;
window.matchMedia = function(query: string) {
  if (query === '(prefers-reduced-motion: reduce)' || query.includes('prefers-reduced-motion')) {
    return {
      matches: true,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    } as MediaQueryList;
  }
  return originalMatchMedia.call(window, query);
};
