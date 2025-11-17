export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "jest-transform-stub",
    "^aos/dist/aos.css$": "identity-obj-proxy"
  },
  collectCoverageFrom: [
    "src/components/**/*.{ts,tsx}",
    "src/__tests__/**/*.{ts,tsx}",
    "!src/**/*.d.ts"
  ],
  coverageDirectory: "coverage",
  testMatch: [
    "**/__tests__/**/*.test.(ts|tsx)"
  ],
  transformIgnorePatterns: [
    "node_modules/(?!(aos)/)"
  ],
  moduleDirectories: ['node_modules', 'src'],
  preset: 'ts-jest'
};