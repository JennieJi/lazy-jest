import * as cjs from '../../dist/lazy-jest';
import cjsDefault from '../../dist/lazy-jest';
import * as umd from '../../dist/lazy-jest.umd';
import umdDefault from '../../dist/lazy-jest.umd';
import * as esm from '../../dist/lazy-jest.esm';
import esmDefault from '../../dist/lazy-jest.esm';
import * as src from '../index';
import srcDefault from '../index';

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
  test('umd', () => {
    expect(Object.keys(umd).sort(sortByAlphabet)).toEqual(struct);
  });
  test('umdDefault', () => {
    expect(Object.keys(umdDefault).sort(sortByAlphabet)).toEqual(structDefault);
  });
  test('esm', () => {
    expect(Object.keys(esm).sort(sortByAlphabet)).toEqual(struct);
  });
  test('esmDefault', () => {
    expect(Object.keys(esmDefault).sort(sortByAlphabet)).toEqual(structDefault);
  });
});