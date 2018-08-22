module.exports =  {
  "verbose": true,
  "testURL": "http://localhost",
  "moduleFileExtensions": [
    "js"
  ],
  "collectCoverageFrom": [
    "src/**/*.js",
    "!**/node_modules/**"
  ],
  "coverageReporters": [
    "text-lcov"
  ],
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.js$"
};