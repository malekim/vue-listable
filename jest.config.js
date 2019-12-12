module.exports = {
  verbose: true,
  moduleFileExtensions: [
    "js",
    "json"
  ],
  transform: {
    "^.+\\.js$": "<rootDir>/node_modules/babel-jest"
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**",
    "!**/node_modules/**"
  ],
  coverageReporters: [
    "html",
    "text-summary"
  ],
}