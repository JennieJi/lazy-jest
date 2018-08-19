import { enumerateArgsTestFunction } from '../testFunction';
import { configArgs } from '../caseGenerator';

describe('function with empty args', () => {
  const emptyArgsFunc = () => 'Success!';
  enumerateArgsTestFunction(emptyArgsFunc, configArgs());
});

describe('function has compulsory args only', () => {
  const myFunc = (a, b) => a + b;
  enumerateArgsTestFunction(
    myFunc,
    configArgs()
      .arg('a', [0, 1], { invalidCases: [NaN, null, ''] })
      .arg('b', [-1, 99999], { invalidCases: [NaN, null, ''] })
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
