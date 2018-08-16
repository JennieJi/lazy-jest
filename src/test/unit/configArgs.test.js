import configArgs from '../../caseGenerator/configArgs';

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
});
