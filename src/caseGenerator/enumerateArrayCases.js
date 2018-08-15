// @flow
import type { Case, ArgConfig, AppendMethod } from '../index.flow';
import enumerateCases from './enumerateCases';

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

const enumerateArrayCases = enumerateCases(extendArrayCase);
export default enumerateArrayCases;