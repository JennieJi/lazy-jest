// @flow
import type { Case, ArgConfig } from '../index.flow';

const validateArgConfig = (argConfig: ArgConfig) => {
  let { validCases, invalidCases, optional } = argConfig;
  if (optional) {
    invalidCases = invalidCases
      ? invalidCases.filter(c => typeof c !== 'undefined')
      : void 0;
    if (!validCases.includes(void 0)) {
      validCases = [...validCases, void 0];
    }
  }
  return {
    ...argConfig,
    validCases,
    invalidCases,
  };
};

class ArgsConfig {
  value: ArgConfig[];

  constructor() {
    this.value = [];
  }
  arg(
    name: string,
    validCases: Case[],
    opts?: { optional?: boolean, invalidCases?: Case[] }
  ) {
    this.value.push(validateArgConfig({ name, validCases, ...(opts || {}) }));
    return this;
  }
}

const configArgs = () => new ArgsConfig();
export default configArgs;