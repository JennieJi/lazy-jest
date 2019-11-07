/** @module caseGenerator/enumerateCases */

/**
 * Extend cases with a list of new cases by given method.
 * @private
 * @param {appendMethod} appendMethod This method will receive 2 input: existing case list, case value to extend. And should return extended case list.
 * @param {Array<Array<*>|Object>} cases
 * @param {Array<*>} nextArgCases
 * @return {Array<Array<*>|Object>}
 * @example
 * appendArgCases(extendArrayCase, [], [2, 3]);  // Result: [[2], [3]],
 * appendArgCases(extendArrayCase, [[0], [1]], [2, 3]);  // Result: [[0, 2], [1, 2], [1, 2], [1, 3]],
 */
const appendArgCases = (
  appendMethod,
  cases,
  nextArgCases
) => {
  return nextArgCases.reduce((appendedCases, nextArgCase) => {
    const newCases = appendMethod(cases, nextArgCase);
    return appendedCases.concat(newCases);
  }, []);
};

/**
 * Generate cases by given configuration
 * @alias module:caseGenerator/enumerateCases
 * @param {appendMethod} appendMethod This method will receive 2 input: existing case list, case value to extend. And should return extended case list.
 * @param {ArgConfig[]} argsConfig
 * @param {?number} invalidArgConfigIndex Index of arg in the config list to have invalid case. If this is not set, it will generate cases that all arguments are valid.
 * @return {Array<Array<*>|Object>} 
 * @example
 * enumerateCases(extendArrayCase, [
 *  { name: 'a', validCases: [true], invalidCases: [false]},
 *  { name: 'b', validCases: [1], invalidCases: [2]}
 * ]);
 * // Result: [[true, 1]]
 *
 * enumerateCases(extendArrayCase, [
 *  { name: 'a', validCases: [true], invalidCases: [false]},
 *  { name: 'b', validCases: [1], invalidCases: [2], optional: true }
 * ]);
 * // Result: [[true], [true, 1]]
 *
 * enumerateCases(extendArrayCase, [
 *  { name: 'a', validCases: [true], invalidCases: [false, 0]},
 *  { name: 'b', validCases: [1, 2], invalidCases: [3] }
 * ], 0);
 * // Result: [[false, 1], [0, 1]]
 *
 * enumerateCases(extendArrayCase, [
 *  { name: 'a', validCases: [true], invalidCases: [false, 0]},
 *  { name: 'b', validCases: [1, 2], invalidCases: [3], optional: true }
 * ], 0);
 * // Result: [[false], [0], [false, 1], [0, 1]]
 */
const enumerateCases = (
  appendMethod,
  argsConfig,
  invalidArgConfigIndex
) => {
  const invalidArgConf =
    typeof invalidArgConfigIndex === 'number'
      ? argsConfig[invalidArgConfigIndex]
      : void 0;
  const { invalidCases } = invalidArgConf || {};
  if (invalidArgConf && (!invalidCases || !invalidCases.length)) {
    return [];
  }
  return argsConfig.reduce((processedCases, conf, i) => {
    if (i === invalidArgConfigIndex) {
      return appendArgCases(appendMethod, processedCases, invalidCases || []);
    }
    const { validCases } = conf;
    if (
      typeof invalidArgConfigIndex !== 'number' ||
      invalidArgConfigIndex < 0
    ) {
      return appendArgCases(appendMethod, processedCases, validCases);
    }
    return appendMethod(processedCases, validCases[0]);
  }, []);
};
/**
 * @callback appendMethod
 * @param {Array<Array<*>|Object>} cases generated cases
 * @param {*} nextArgCase
 * @return {Array<Array<*>|Object>}
 */

 module.exports = {
  appendArgCases,
  enumerateCases
 };