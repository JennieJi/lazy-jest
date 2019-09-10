const enumerateArrayCases = require('../../src/caseGenerator/enumerateArrayCases');

describe('enumerateArrayCases', () => {
  test('single arg, valid cases only', () => {
    expect(enumerateArrayCases([
      {
        name: 'a',
        validCases: [1, 2]
      }
    ])).toMatchSnapshot();
  });

  test('single arg, has invalid cases', () => {
    expect(enumerateArrayCases([
      {
        name: 'a',
        validCases: [1, 2],
        invalidCases: [null]
      }
    ])).toMatchSnapshot();
    expect(enumerateArrayCases([
      {
        name: 'a',
        validCases: [1, 2],
        invalidCases: [null, NaN]
      }
    ], 0)).toMatchSnapshot();
  });

  test('multiple arga, valid cases only', () => {
    expect(enumerateArrayCases([
      {
        name: 'a',
        validCases: [1, 2],
      }, {
        name: 'b',
        validCases: ['haha']
      }
    ])).toMatchSnapshot();
  });

  test('multiple arga, has invalid case', () => {
    expect(enumerateArrayCases([
      {
        name: 'a',
        validCases: [1, 2],
        invalidCases: [null, NaN]
      }, {
        name: 'b',
        validCases: ['haha', 'test']
      }
    ], 0)).toMatchSnapshot();
  });
});