module.exports = {
  verbose: true,
  moduleFileExtensions: [
    "js",
    "json"
  ],
  transform: {
    "^.+\\.js$": "<rootDir>/node_modules/babel-jest"
  },
  collectCoverage: false,
  collectCoverageFrom: [
    "src/js/*.{js}",
    "!**/node_modules/**"
  ],
  coverageReporters: [
    "html",
    "text-summary"
  ],
}