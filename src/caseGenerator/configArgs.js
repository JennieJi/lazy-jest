// @flow
import type { Case, ArgConfig } from '../index.flow';
import configObjectArg from './configObjectArg';

/**
 * Validate argConfig and adjust some values
 * @private
 * @param {ArgConfig} argConfig
 * @return {ArgConfig}
 */
const validateArgConfig = (argConfig: ArgConfig) => {
  let { validCases, invalidCases, optional, name } = argConfig;
  if (optional) {
    invalidCases = invalidCases
      ? invalidCases.filter(c => typeof c !== 'undefined')
      : void 0;
    if (!validCases.includes(void 0)) {
      validCases = [...validCases, void 0];
    }
  }
  return {
    optional: !!optional,
    name: name || 'argument',
    validCases,
    invalidCases
  };
};

/**
 * Helper for generate ArgConfig
 * @protected
 */
export class ArgsConfig {
  value: ArgConfig[];

  /**
   * @param {ArgConfig[]} initialConfig
   */
  constructor(initialConfig?: ArgConfig[]) {
    this.value = Array.isArray(initialConfig) ? initialConfig.map(validateArgConfig) : [];
  }
  /**
   * Add an argument
   * @param {string} name 
   * @param {Array.<*>} validCases valid test cases for this argument
   * @param {Object.<string, *>} [opts] other options
   * @prop {boolean} [opts.optional] flag to indicate whether this argument is optional
   * @prop {Array.<*>} [opts.invalidCases] invalid test cases for thsi argument
   */
  arg(
    name: string,
    validCases: Case[],
    opts?: { optional?: boolean, invalidCases?: Case[] }
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
   * @param {string} name 
   * @param {ArgsConfig} propsConfig 
   * @param {Object.<string, *>} [opts]
   * @prop {boolean} [opts.optional] 
   */
  objectArg(name: string, propsConfig: ArgsConfig, opts?: { optional?: boolean }) {
    this.value.push({
      ...configObjectArg(propsConfig),
      ...(opts || {}),
      name
    });
    return this;
  }
}

/**
 * @memberof ArgsConfig
 * @instance
 * @example
 * // example ArgConfig for `func(a, b) {}`
 * configArgs()
 * .arg('a', [0, 1, 2])
 * .arg('b', [-1, -2], { optional: true, invalidCases: [0] });
 */
const configArgs = (initialConfig?: ArgConfig[]) => new ArgsConfig(initialConfig);
export default configArgs;
