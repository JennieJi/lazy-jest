// @flow
import type { Case, ArgConfig } from './index.flow';
import type { Args } from './caseGenerator/configArgs';
import enumerateArrayCases from './caseGenerator/enumerateArrayCases';
/** @module testFunction */

type ArgsCase = Case[];

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

const mayThrowWrapper = async (func: Function, args: any[] = []) => {
  try {
   const ret = func.apply(null, args);
   if (ret.then) {
     return await ret;
   }
   return ret;
  } catch (e) {
    console.warn(e);
    return 'error';
  }
};

const testNoArgs = (func: Function) => {
  test('- ()', async () => {
    const ret = await mayThrowWrapper(func);
    expect(ret).toMatchSnapshot();
  });
};
const testArgList = (func: Function, argsList: ArgsCase[] = []) => {
  test.each(argsList.map(args => [args]))(
    '- %p',
    async (args: any[]) => {
      const ret = await mayThrowWrapper(func, args);
      expect(ret).toMatchSnapshot();
    }
  );
}

/**
 * 
 * @param {Function} func 
 * @param {Array.<Array.<*>>} [argsCases] 
 * @param {string} [testCaption] 
 * @example
 * testFunction(targetFunction, [
 *  [1, 2],
 *  [0, -1],
 *  [0], 
 *  []
 * ], 'custom combination test of targetFunction()');
 */
export const testFunction = (
  func: Function,
  argsCases?: ArgsCase[] = [],
  testCaption?: string = `${func.name || 'function'}()`
) => {
  if (!argsCases) { return; }
  describe(testCaption, () => {
    if (argsCases.length) {
      testArgList(func, argsCases);
    } else {
      testNoArgs(func);
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
  const testConfigs = argsConfig.map((conf, i) => {
    const cases = enumerateArrayCases(argsConfig, i);
    return cases && cases.length ? [
      `argument <${conf.name}> is invalid`,
      cases
    ] : null;
  }).filter(conf => !!conf);
  if (testConfigs.length) {
    describe.each(testConfigs)(
      '%s',
      (_name, cases) => {
        testArgList(func, cases);
      }
    );
  }
};

/**
 * Test function with all combinations of valid arguments.
 * @private
 * @param {Function} func  Target function
 * @param {ArgConfig[]} argsConfig
 */
const testValidArgs = (func: Function, argsConfig: ArgConfig[]) => {
  const cases = enumerateArrayCases(argsConfig);
  if (cases.length) {
    testArgList(func, cases);
  } else {
    testNoArgs(func);
  }
};

const getArgNames = (argsConfig: ArgConfig[]) => argsConfig.map(conf => conf.name);

/**
 * Catch snapshot of a function. It will do following tests:
 * - If no compulsory arguments defined, it will test empty argument case
 * - Test compulsory arguments first, and add in optional argument test cases one by one
 * - Test invalid cases by using arguments with one invalid argument, and first valid case for others
 * - Test all valid combinations of arguments
 * @param {Function} func Target function
 * @param {Args|ArgConfig[]} argsConfig
 * @param {string} [testCaption] Test description
 * @example
 * const emptyFunc = () => {};
 * enumerateArgsTestFunction(emptyFunc);
 *
 * const simpleFunc = (param) => param;
 * enumerateArgsTestFunction(
 *   simpleFunc, 
 *   configArgs().arg('param', [1], { invalidCases: [0] })
 * ]);
 *
 * const funcHasOptional = (param, opts) => opts || param;
 * enumerateArgsTestFunction(
 *  funcHasOpts, 
 *  configArgs()
 *    .arg('param', [1], { invalidCases: [0] })
 *    .arg('opts', [2], { invalidCases: [0], optional: true })
 * );
 *
 * const complexFunc = ({ param, opts }) => opts || param;
 * enumerateArgsTestFunction(
 *   funcHasOpts, 
 *   configArgs().objectArg(
 *     'param',
 *     configArgs()
 *       .arg('param', [1], { invalidCases: [0] })
 *       .arg('opts', [2], { invalidCases: [0], optional: true })
 *   )
 * );
 */
export const enumerateArgsTestFunction = (
  func: Function,
  argsConfig: Args | ArgConfig[],
  testCaption?: string = `${func.name || 'function'}()`
) => {
  const CONF = Array.isArray(argsConfig) ? argsConfig : argsConfig.value;
  let optionalStartIndex = CONF.length;
  for (
    let i = CONF.length;
    --i && CONF[i] && CONF[i].optional;
  ) {
    optionalStartIndex = i;
  }
  const optionalArgs = CONF.slice(optionalStartIndex);
  const compulsoryArgs = CONF.slice(0, optionalStartIndex);
  const testConfig = optionalArgs.reduce((config, optionalArg) => {
    const [lastArgs, last] = config[config.length - 1];
    const newArgs = last.concat(optionalArg);
    return [
      ...config,
      [getArgNames(newArgs), newArgs]
    ];
  }, [[getArgNames(compulsoryArgs), compulsoryArgs]]);
  describe(testCaption, () => {
    if (testConfig.length) {
      describe.each(testConfig)(
        '- (%p)', 
        (_argNames, config) => {
          if (config.length) {
            testInvalidArgs(func, config);
            testValidArgs(func, config);
          } else {
            testNoArgs(func);
          }
        }
      );
    } else {
      testNoArgs(func);
    }
  });
};