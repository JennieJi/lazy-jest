// @flow
export type Case = any;
export type ArgConfig = {
  name: string,
  validCases: Case[],
  invalidCases: Case[],
  optional?: boolean,
};


export type AppendMethod =  <C>(cases: C[], nextArgCase: any): C[] => C[];