// @flow
import type { Case, ArgConfig } from '../index.flow';
import { default as enumerateCases, appendArgCases } from './enumerateCases';

type ObjectCase = { [key: string]: Case };

/**
 * Append a property to each object of a list. Similar to "setEach" in some functional programming lib.
 * @private
 * @param {string} key property name
 * @return {extendObjectCase~callback}
 * @example
 * const cases = extendObjectCase('a')([{}], 1);  // Result: [{ a: 1 }]
 * extendObjectCase('b')(cases, '');  // Result: [{ a: 1, b: '' }]
 * extendObjectCase('c')([{ a: 1 }, { b: '' }], []);  // Result: [{ a: 1, c: [] }, { b: '', c: [] }]
 */
const extendObjectCase = (key: string) => {
  return (exsistingCases: ObjectCase[], nextArgCase: Case): ObjectCase[] => {
    if (exsistingCases.length) {
      return exsistingCases.map(c => {
        return { ...c, [key]: nextArgCase };
      });
    }
    return [{ [key]: nextArgCase }];
  };
};
/**
 * @callback extendObjectCase~callback
 * @param {Array<Object>} cases
 * @param {*} nextArgCase
 * @return {Array<Object>}
 */

const getTestCases = (key: string) => enumerateCases(extendObjectCase(key));
const appendTestCases = (key: string) => appendArgCases(extendObjectCase(key));

/**
 * A helper to generate object test cases by provided configurations
 * @param {ArgConfig} propsConfig
 * @return {{validCases: Array<Object>, invalidCases: Array<Object>}}
 * @example
 * makeObjectArg([
 *  {
 *    name: 'a',
 *    validCases: [1, 2],
 *    invalidCases: [NaN, 0]
 *  },
 *  {
 *    name: 'b',
 *    validCases: ['a'],
 *    invalidCases: ['', 1],
 *    optional: true
 *  }
 * ]);
 * // Result:
 * // {
 * //   validCases: [
 * //     { a: 1 },
 * //     { a: 2 },
 * //     { a: 1, b: a }
 * //   ],
 * //   invalidCases: [
 * //     { a: NaN },
 * //     { a: 0 },
 * //     { a: 1, b: '' },
 * //     { a: 1, b: 1 }
 * //   ]
 * // }
 */
const makeObjectArg = (propsConfig: ArgConfig[]) => {
  const compulsoryProps = propsConfig.filter(conf => !conf.optional);
  const optionalProps = propsConfig.filter(conf => conf.optional);
  let compulsoryValidCases = [];
  let compulsoryInvalidCases = [];
  compulsoryProps.forEach(({ name }, i) => {
    const getCases = getTestCases(name);
    compulsoryInvalidCases = compulsoryInvalidCases.concat(
      getCases(compulsoryProps, i)
    );
    compulsoryValidCases = compulsoryValidCases.concat(
      getCases(compulsoryProps)
    );
  });
  let optionalValidCases = [];
  let optionalInvalidCases = [];
  optionalProps.forEach(({ name, invalidCases, validCases }) => {
    const append = appendTestCases(name);
    optionalInvalidCases = optionalInvalidCases.concat(
      append(compulsoryValidCases, invalidCases)
    );
    optionalValidCases = optionalValidCases.concat(
      append(compulsoryValidCases, validCases)
    );
  });
  return {
    validCases: [...compulsoryProps, ...optionalValidCases],
    invalidCases: [...compulsoryInvalidCases, ...optionalInvalidCases]
  };
};

export default makeObjectArg;
