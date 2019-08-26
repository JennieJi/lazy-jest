import configArgs from '../../src/caseGenerator/configArgs';

describe('configArgs', () => {
  test('empty args', () => {
    expect(configArgs()).toMatchSnapshot();
  });

  test('has initial config', () => {
    expect(configArgs([{ name: 'a', validCases: [1] }])).toMatchSnapshot();
  });

  test('config 1 arg', () => {
    expect(configArgs().arg('a', [1], { optional: true })).toMatchSnapshot();
  });

  test('config 2 args', () => {
    expect(
      configArgs()
        .arg('a', [1])
        .arg('b', [2], { optional: true })
    ).toMatchSnapshot();
  });

  test('config object args', () => {
    expect(
      configArgs().objectArg(
        'a',
        configArgs().objectArg(
          'b',
          configArgs([{ name: 'c', validCases: [1] }])
        ),
        { optional: true }
      )
    ).toMatchSnapshot();
  });

  test('validate args add undefined to valid case', () => {
    expect(
      configArgs([{ name: 'a', optional: true, validCases: [1] }])
    ).toMatchSnapshot();

    expect(
      configArgs([{ name: 'a', optional: true, validCases: [1, undefined] }])
    ).toMatchSnapshot();
  });
});
