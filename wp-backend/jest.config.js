export default {
  testEnvironment: "node",
  transform: {},
  verbose: true,
  collectCoverageFrom: [
    "routes/**/*.js",
    "models/**/*.js",
    "!**/node_modules/**"
  ],
  coverageDirectory: "coverage",
  testMatch: ["**/__tests__/**/*.test.js"]
};