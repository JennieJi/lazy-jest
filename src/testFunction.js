// @flow
import type { Case, ArgConfig } from './index.flow';
import type { ArgsConfig } from './caseGenerator/configArgs';
import { matchSnapshot } from './utils';
import enumerateArrayCases from './caseGenerator/enumerateArrayCases';

type ArgsCase = Case[];

/**
 * @private
 * @param {Array.<*>} args 
 * @return {string}
 */
const formatArgCaseDesc = (args: ArgsCase) => {
  const strArgs = args.map(arg => {
    if (typeof arg === 'undefined') {
      return 'undefined';
    }
    if (typeof arg === 'string') {
      return `"${arg}"`;
    }
    if ((Array.isArray(arg), typeof arg === 'object')) {
      return JSON.stringify(arg);
    }
    return arg.toString();
  });
  return `- (${strArgs.join(',')})`;
};

/**
 * @private
 * @param {Function} func 
 * @param {Array.<*>} args 
 */
const doTest = (func: Function, args: ArgsCase = []) => {
  describe(formatArgCaseDesc(args), () => {
    matchSnapshot(() => func(...args));
  });
};

/**
 * 
 * @param {Function} func 
 * @param {Array.<Array.<*>>} [argsCases] 
 * @param {string} [testCaption] 
 */
export const testFunction = (
  func: Function,
  argsCases?: ArgsCase[] = [],
  testCaption?: string = `${func.name || 'function'}()`
) => {
  describe(testCaption, () => {
    if (argsCases && argsCases.length) {
      argsCases.forEach(c => doTest(func, c));
    } else {
      doTest(func);
    }
  });
};

/**
 * Test function with given argument configurations by using invalid case for one of the argument, and first valid case for others.
 * This process will go through all arguments in config list, and all the invalid cases.
 * @private
 * @param {Function} func Target function
 * @param {ArgConfig[]} argsConfig
 */
const testInvalidArgs = (func: Function, argsConfig: ArgConfig[]) => {
  const argNames = argsConfig.map(conf => conf.name);
  argsConfig.forEach((conf, i) => {
    const cases = enumerateArrayCases(argsConfig, i);
    const testCaption = `${formatArgCaseDesc(argNames)}, ${conf.name} invalid`;
    testFunction(func, cases, testCaption);
  });
};

/**
 * Test function with all combinations of valid arguments.
 * @private
 * @param {Function} func  Target function
 * @param {ArgConfig[]} argsConfig
 */
const testValidArgs = (func: Function, argsConfig: ArgConfig[]) => {
  const cases = enumerateArrayCases(argsConfig);
  const argNames = argsConfig.map(conf => conf.name);
  const testCaption = formatArgCaseDesc(argNames);
  testFunction(func, cases.length ? cases : [], testCaption);
};

/**
 * Catch snapshot of a function. It will do following tests:
 * - If no compulsory arguments defined, it will test empty argument case
 * - Test compulsory arguments first, and add in optional argument test cases one by one
 * - Test invalid cases by using arguments with one invalid argument, and first valid case for others
 * - Test all valid combinations of arguments
 * @param {Function} func Target function
 * @param {ArgsConfig} argsConfig
 * @param {string} [testCaption] Test description
 * @example
 * const emptyFunc = () => {};
 * enumerateArgsTestFunction(emptyFunc);
 *
 * const simpleFunc = (param) => param;
 * enumerateArgsTestFunction(simpleFunc, [
 *  { name:'param', validCases: [1], invalidCases: [0]  }
 * ]);
 *
 * const funcHasOptional = (param, opts) => opts || param;
 * enumerateArgsTestFunction(funcHasOpts, [
 *  { name:'param', validCases: [1], invalidCases: [0]  }
 *  { name:'opts', validCases: [2], invalidCases: [0], optional: true  }
 * ]);
 *
 * const complexFunc = ({ param, opts }) => opts || param;
 * enumerateArgsTestFunction(funcHasOpts, [
 *  {
 *    ...makeObjectCases([
 *      { name:'param', validCases: [1], invalidCases: [0]  }
 *      { name:'opts', validCases: [2], invalidCases: [0], optional: true  }
 *    ]},
 *    name: 'argument1'
 *  }
 * ]);
 */
export const enumerateArgsTestFunction = (
  func: Function,
  argsConfig: ArgsConfig,
  testCaption?: string = `${func.name || 'function'}()`
) => {
  const CONF = argsConfig.value;
  let optionalStartIndex = CONF.length;
  for (
    let i = CONF.length;
    --i && CONF[i] && CONF[i].optional;
  ) {
    optionalStartIndex = i;
  }
  const optionalArgs = CONF.slice(optionalStartIndex);
  const compulsoryArgs = CONF.slice(0, optionalStartIndex);

  describe(testCaption, () => {
    for (let n = optionalArgs.length + 1; n--; ) {
      const testArgsConfig = compulsoryArgs.concat(optionalArgs.slice(0, n));
      if (testArgsConfig.length) {
        testInvalidArgs(func, testArgsConfig);
        testValidArgs(func, testArgsConfig);
      } else {
        doTest(func);
      }
    }
  });
};
