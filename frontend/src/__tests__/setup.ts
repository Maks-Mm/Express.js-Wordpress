import '@testing-library/jest-dom';

// Mock AOS
jest.mock('aos', () => ({
  init: jest.fn(),
  refresh: jest.fn()
}));

// Mock global fetch
global.fetch = jest.fn();

// Mock window.scrollTo
window.scrollTo = jest.fn();

// Mock CSS imports
jest.mock('../App.css', () => ({}));
jest.mock('aos/dist/aos.css', () => ({}));

// Add at least one test to avoid "must contain at least one test" error
test('setup file', () => {
  expect(true).toBe(true);
});