import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn();

// Mock AOS to prevent CSS issues in tests
jest.mock('aos', () => ({
  init: jest.fn(),
  refresh: jest.fn(),
}));

// Clear mocks before each test
beforeEach(() => {
  (global.fetch as jest.Mock).mockClear();
});

// Suppress console errors for CSS imports
const originalError = console.error;
console.error = (...args: any[]) => {
  if (typeof args[0] === 'string' && args[0].includes('CSS')) {
    return;
  }
  originalError.call(console, ...args);
};