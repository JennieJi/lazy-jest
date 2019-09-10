const configObjectArg = require('../../src/caseGenerator/configObjectArg');
const configArgs = require('../../src/caseGenerator/configArgs');

describe('configObjectArg', () => {
  test('empty object', () => {
    expect(configObjectArg(configArgs())).toMatchSnapshot();
  });

  test('single property', () => {
    expect(configObjectArg(configArgs().arg('a', [1]))).toMatchSnapshot();
  });

  test('single property has invalid cases', () => {
    expect(configObjectArg(configArgs().arg('a', [1], { invalidCases: [null] }))).toMatchSnapshot();
  });

  test('single optional property', () => {
    expect(configObjectArg(configArgs().arg('a', [1], { optional: true }))).toMatchSnapshot();
  });

  test('optional property has invalid cases', () => {
    expect(configObjectArg(configArgs().arg('a', [1], { optional: true, invalidCases: [null] }))).toMatchSnapshot();
  });

  test('multiple properties, no optional', () => {
    expect(configObjectArg(
      configArgs()
      .arg('a', [1])
      .arg('b', [0])
    )).toMatchSnapshot();
  });

  test('multiple properties, has optional', () => {
    expect(configObjectArg(
      configArgs()
      .arg('a', [1])
      .arg('b', [0], { optional: true })
    )).toMatchSnapshot();
  });
  
  test('multiple properties, has invalid cases', () => {
    expect(configObjectArg(
      configArgs()
      .arg('a', [1])
      .arg('b', [0], { invalidCases: [null] })
    )).toMatchSnapshot();
  });

  test('multiple properties in array', () => {
    expect(configObjectArg([
      { name: 'a', validCases: [1] },
      { name: 'b', validCases: [0] }
    ])).toMatchSnapshot();
  });
});