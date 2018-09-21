// @flow
import type { Case, ArgConfig } from '../index.flow';
import type { Args } from './configArgs';
import { default as enumerateCases, appendArgCases } from './enumerateCases';
/** @module caseGenerator/configObjectArg */

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

 /**
  * @private
  * @param {string} key
  * @return {Function}
  */
const getTestCases = (key: string) => enumerateCases.bind(null, extendObjectCase(key));
/**
 * @private
 * @param {string} key
 * @return {Function}
 */
const appendTestCases = (key: string) => appendArgCases.bind(null, extendObjectCase(key));

/**
 * A helper to generate object test cases by provided configurations
 * @alias module:caseGenerator/configObjectArg
 * @param {Args|ArgConfig[]} propsConfig
 * @return {ArgConfig}
 * @example
 * configObjectArg(
 *  configArgs()
 *  .arg('a', [1, 2], { invalidCases: [NaN, 0] })
 *  .arg('b', ['a'], { invalidCases: ['', 1], optional: true })
 * );
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
const configObjectArg = (propsConfig: Args | ArgConfig[]) => {
  const props = Array.isArray(propsConfig) ? propsConfig : propsConfig.value;
  const compulsoryProps = props.filter(conf => !conf.optional);
  const optionalProps = props.filter(conf => conf.optional);
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
    if (invalidCases) {
      optionalInvalidCases = optionalInvalidCases.concat(
        append(compulsoryValidCases, invalidCases)
      );
    }
    optionalValidCases = optionalValidCases.concat(
      append(compulsoryValidCases, validCases)
    );
  });
  return {
    validCases: [...compulsoryProps, ...optionalValidCases],
    invalidCases: [...compulsoryInvalidCases, ...optionalInvalidCases]
  };
};

export default configObjectArg;
