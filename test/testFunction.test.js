const { testFunction } = require('../src/testFunction');

describe('empty arg function', () => {
  const emptyArgFunc = () => 'Success!';

  testFunction(emptyArgFunc);
  testFunction(emptyArgFunc, [], 'custom test caption');
});

describe('function with args', () => {
  const multiArgsFunc = (a, b) => a + b;

  testFunction(multiArgsFunc, []);
  testFunction(multiArgsFunc, [
    [null, 1],
    [NaN],
    [0, 1],
    ['0', 1]
  ]);
});

describe('function will throw', () => {
  const funcWillThrow = () => {
    throw 'Error!';
  }

  testFunction(funcWillThrow);
});