// @flow
export const mayThrowWrapper = (doSomething: Function) => {
  try {
    return doSomething();
  } catch (e) {
    return e;
  }
};

export const matchSnapshot = (doSomething: Function) => {
  expect(mayThrowWrapper(doSomething)).toMatchSnapshot();
};