module.exports = {
  verbose: true,
  moduleFileExtensions: [
    "js",
    "json"
  ],
  snapshotSerializers: ["jest-serializer-vue"],
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