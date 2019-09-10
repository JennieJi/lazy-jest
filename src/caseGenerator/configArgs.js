const configObjectArg = require('./configObjectArg');

/** @module caseGenerator/configArgs */

/**
 * Validate argConfig and adjust some values
 * @private
 * @param {ArgConfig} argConfig
 * @return {ArgConfig}
 */
const validateArgConfig = (argConfig) => {
  let { validCases, invalidCases, optional, name } = argConfig;
  if (optional) {
    invalidCases = invalidCases
      ? invalidCases.filter(c => typeof c !== 'undefined')
      : void 0;
    if (!validCases.includes(void 0)) {
      validCases = validCases.concat(void 0);
    }
  }
  return {
    optional: !!optional,
    name,
    validCases,
    invalidCases
  };
};

/**
 * Class for argument configurations
 */
class Args {
  /**
   * @param {ArgConfig[]} initialConfig
   */
  constructor(initialConfig) {
    this.value = Array.isArray(initialConfig) ? initialConfig.map(validateArgConfig) : [];
  }
  /**
   * Add an argument
   * @param {string} name 
   * @param {Array.<*>} validCases valid test cases for this argument
   * @param {Object.<string, *>} [opts] other options
   * @prop {boolean} [opts.optional] flag to indicate whether this argument is optional
   * @prop {Array.<*>} [opts.invalidCases] invalid test cases for thsi argument
   * @return {this}
   */
  arg(
    name,
    validCases,
    opts
  ) {
    this.value.push(
      validateArgConfig({
        ...(opts || {}),
        name,
        validCases
      })
    );
    return this;
  }
  /**
   * Add an object type argument
   * @function module:caseGenerator/configArgs.Args#objectArg
   * @param {string} name 
   * @param {Args|ArgConfig[]} propsConfig 
   * @param {Object.<string, *>} [opts]
   * @prop {boolean} [opts.optional] 
   * @return {this}
   */
  objectArg(name, propsConfig, opts) {
    this.value.push({
      ...configObjectArg(propsConfig),
      ...(opts || {}),
      name
    });
    return this;
  }
}

/**
 * @alias module:caseGenerator/configArgs
 * @param {ArgConfig[]} initialConfig
 * @return {module:caseGenerator/configArgs.Args}
 * @example
 * // example ArgConfig for `func(a, b) {}`
 * configArgs()
 * .arg('a', [0, 1, 2])
 * .arg('b', [-1, -2], { optional: true, invalidCases: [0] });
 */
const configArgs = (initialConfig) => new Args(initialConfig);
module.exports = configArgs;
