import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

// Clear mocks before each test
beforeEach(() => {
  (global.fetch as jest.Mock).mockClear();
});