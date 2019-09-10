const { enumerateArgsTestFunction } = require('../src/testFunction');
const configArgs = require('../src/caseGenerator/configArgs');

describe('function with empty args', () => {
  const emptyArgsFunc = () => 'Success!';
  enumerateArgsTestFunction(emptyArgsFunc, configArgs());
});

describe('function has compulsory args only', () => {
  const myFunc = (a, b) => a + b;
  enumerateArgsTestFunction(
    myFunc,
    configArgs()
      .arg('a', [0, 1])
      .arg('b', [-1, 99999]),
    'no invalid case'
  );
  enumerateArgsTestFunction(
    myFunc,
    configArgs()
      .arg('a', [0, 1], { invalidCases: [NaN, null, ''] })
      .arg('b', [-1, 99999], { invalidCases: [NaN, null, ''] }),
    'has invalid cases'
  );
});

describe('function has optional args', () => {
  const myFunc = (a, b = 0) => a + b;
  enumerateArgsTestFunction(
    myFunc,
    configArgs()
      .arg('a', [0, 1], { invalidCases: [NaN, null, ''] })
      .arg('b', [-1, 99999], { invalidCases: [NaN, null, ''], optional: true })
  );
});
