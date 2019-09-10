// @flow
const { testFunction, enumerateArgsTestFunction } = require('./testFunction');
const enumerateArrayCases = require('./caseGenerator/enumerateArrayCases');
const { enumerateCases }  = require('./caseGenerator/enumerateCases');
const configArgs = require('./caseGenerator/configArgs');
const configObjectArg = require('./caseGenerator/configObjectArg');

module.exports = {
  testFunction,
  enumerateArgsTestFunction,
  enumerateArrayCases,
  enumerateCases,
  configArgs,
  configObjectArg
};