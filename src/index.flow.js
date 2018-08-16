// @flow
export type Case = any;
export type ArgConfig = {
  name: string,
  validCases: Case[],
  invalidCases?: Case[],
  optional?: boolean,
};
