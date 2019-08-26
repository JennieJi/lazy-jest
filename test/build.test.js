import * as cjs from '../dist/lazy-jest';
import cjsDefault from '../dist/lazy-jest';
import * as src from '../src/index';
import srcDefault from '../src/index';

const sortByAlphabet = (a, b) => a.localeCompare(b);

describe('builds', () => {
  const struct = Object.keys(src).sort(sortByAlphabet);
  const structDefault = Object.keys(srcDefault).sort(sortByAlphabet);

  test('orignal', () => {
    expect(struct).toMatchSnapshot();
  });
  test('orignalDefault', () => {
    expect(structDefault).toMatchSnapshot();
  });

  test('cjs', () => {
    expect(Object.keys(cjs).sort(sortByAlphabet)).toEqual(struct);
  });
  test('cjsDefault', () => {
    expect(Object.keys(cjsDefault).sort(sortByAlphabet)).toEqual(structDefault);
  });
});