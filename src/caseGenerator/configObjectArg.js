const { enumerateCases, appendArgCases } = require('./enumerateCases');
/** @module caseGenerator/configObjectArg */


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
const extendObjectCase = (key) => {
  return (exsistingCases, nextArgCase) => {
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
const getTestCases = (key) => enumerateCases.bind(null, extendObjectCase(key));
/**
 * @private
 * @param {string} key
 * @return {Function}
 */
const appendTestCases = (key) => appendArgCases.bind(null, extendObjectCase(key));

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
const configObjectArg = (propsConfig) => {
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
    validCases: [...compulsoryValidCases, ...optionalValidCases],
    invalidCases: [...compulsoryInvalidCases, ...optionalInvalidCases]
  };
};

module.exports = configObjectArg;
