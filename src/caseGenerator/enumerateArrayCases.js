// @flow
import type { Case, ArgConfig } from '../index.flow';
import enumerateCases from './enumerateCases';
/** @module caseGenerator/enumerateArrayCases */

/**
 * Append a value to the end of each array of a list.
 * @private
 * @param {Array<Array<*>>} cases generated cases
 * @param {*} nextArgCase
 * @return {Array<Array<*>>}
 * @example
 * const c = extendArrayCase([], 1);  // Result: [[1]]
 * extendArrayCase(c, 2);  // Result: [[1, 2]]
 * extendArrayCase([[1], [2]], 3);  // Result: [[1, 3], [2, 3]]
 */
const extendArrayCase = (
  existingCases: Case[][],
  nextItemCase: Case
): Case[][] => {
  return existingCases.length
    ? existingCases.map(c => [...c, nextItemCase])
    : [[nextItemCase]];
};

/**
 * @alias module:caseGenerator/enumerateArrayCases
 * @see enumerateCases
 * @param {ArgConfig[]} argsConfig
 * @param {?number} invalidArgConfigIndex Index of arg in the config list to have invalid case. If this is not set, it will generate cases that all arguments are valid.
 * @return {Array<Array<*>|Object>} 
 */
const enumerateArrayCases = enumerateCases.bind(null, extendArrayCase);
export default enumerateArrayCases;