// @flow
/**
 * @private
 * @param {Function} doSomething 
 */
export const mayThrowWrapper = (doSomething: Function) => {
  try {
    return doSomething();
  } catch (e) {
    return e;
  }
};

/**
 * @private
 * @param {Function} doSomething 
 */
export const matchSnapshot = (doSomething: Function) => {
  expect(mayThrowWrapper(doSomething)).toMatchSnapshot();
};