lazy-jest
---

[![npm version](https://badge.fury.io/js/lazy-jest.svg)](https://badge.fury.io/js/lazy-jest)
[![Build Status](https://travis-ci.org/JennieJi/lazy-jest.svg?branch=master)](https://travis-ci.org/JennieJi/lazy-jest)
[![codecov](https://codecov.io/gh/JennieJi/lazy-jest/branch/master/graph/badge.svg)](https://codecov.io/gh/JennieJi/lazy-jest)


Jest util for lazy person like me to generate mass test snapshots with few configurations.
*It only supports function test now*

NOTE that please use it wisely, otherwise your snapshot will explode.

# Quick start

index.js
```javascript
export function testFunction(a, b) {
  return a + b;
}
```
//happy hacking
index.test.js
```javascript
import { testFunction, enumerateArgsTestFunction, configArgs } from 'lazy-jest';
import { targetFunction } from '.';

// custom combinations
testFunction(targetFunction, 
  [
    [1, 2],
    [0, -1],
    [0],
    []
  ], 
  'custom combination test of targetFunction()'
);

// enumerate test
const conf = 
  configArgs()
    .arg('a', [1, 0, -1])
    .arg('b', [-1, 0.9], { invalidCases: [ null ] });
enumerateArgsTestFunction(targetFunction, conf, 'enumerate test for targetFunction()');
```


# How does enumerate test work?

First of all, testing is to verify input samples will always match corresponding output.
To know what is the correct output, you need either calculate by yourself, or capture the *snapshot* of correct output. Which is an owesome feature introduced by jest.

For functions, input is simply a set of arguments. So why not I just provide a list of valid or invalid cases, and let JS to generate all the combinations as test cases and capture snapshot?

To be strict like lab experiments, I choose to test a function in following way (which I called enumerate test):
* If no compulsory args, test function with empty arguments: `func()`
* If there are compulsory args, test together with invalid case for one of the args, and valid cases for the rest. Like this:
  - `func(invalid, valid)`
  - `func(valid, invalid)`
* If there are optional args, test in above way by add in optional args one by one. Like this:
  - `func(compulsory_invalid, compulsory_valid, optional_valid)`
  - `func(compulsory_valid, compulsory_invalid, optional_valid)`
  - `func(compulsory_valid, compulsory_valid, optional_invalid)`
  - `func(compulsory_invalid, compulsory_valid, optional_valid, optional_valid)`
  - `func(compulsory_valid, compulsory_invalid, optional_valid, optional_valid)`
  - `func(compulsory_valid, compulsory_valid, optional_invalid, optional_valid)`
  - `func(compulsory_valid, compulsory_valid, optional_valid, optional_invalid)`
* And then test all the valid combinations

# API

## Modules

<dl>
<dt><a href="#module_caseGenerator/configArgs">caseGenerator/configArgs</a></dt>
<dd></dd>
<dt><a href="#module_caseGenerator/configObjectArg">caseGenerator/configObjectArg</a></dt>
<dd></dd>
<dt><a href="#module_caseGenerator/enumerateArrayCases">caseGenerator/enumerateArrayCases</a></dt>
<dd></dd>
<dt><a href="#module_caseGenerator/enumerateCases">caseGenerator/enumerateCases</a></dt>
<dd></dd>
<dt><a href="#module_testFunction">testFunction</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ArgConfig">ArgConfig</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="module_caseGenerator/configArgs"></a>

## caseGenerator/configArgs

* [caseGenerator/configArgs](#module_caseGenerator/configArgs)
    * [configArgs(initialConfig)](#exp_module_caseGenerator/configArgs--configArgs) ⇒ [<code>exports.Args</code>](#new_module_caseGenerator/configArgs--configArgs.Args_new) ⏏
        * [.Args](#module_caseGenerator/configArgs--configArgs.Args)
            * [new exports.Args(initialConfig)](#new_module_caseGenerator/configArgs--configArgs.Args_new)
            * [.arg(name, validCases, [opts])](#module_caseGenerator/configArgs--configArgs.Args+arg) ⇒ <code>this</code>
            * [.objectArg(name, propsConfig, [opts])](#module_caseGenerator/configArgs--configArgs.Args+objectArg) ⇒ <code>this</code>


* * *

<a name="exp_module_caseGenerator/configArgs--configArgs"></a>

### configArgs(initialConfig) ⇒ [<code>exports.Args</code>](#new_module_caseGenerator/configArgs--configArgs.Args_new) ⏏
**Kind**: Exported function  

| Param | Type |
| --- | --- |
| initialConfig | [<code>Array.&lt;ArgConfig&gt;</code>](#ArgConfig) | 

**Example**  
```js
// example ArgConfig for `func(a, b) {}`
configArgs()
.arg('a', [0, 1, 2])
.arg('b', [-1, -2], { optional: true, invalidCases: [0] });
```

* * *

<a name="module_caseGenerator/configArgs--configArgs.Args"></a>

#### configArgs.Args
Class for argument configurations

**Kind**: static class of [<code>configArgs</code>](#exp_module_caseGenerator/configArgs--configArgs)  

* [.Args](#module_caseGenerator/configArgs--configArgs.Args)
    * [new exports.Args(initialConfig)](#new_module_caseGenerator/configArgs--configArgs.Args_new)
    * [.arg(name, validCases, [opts])](#module_caseGenerator/configArgs--configArgs.Args+arg) ⇒ <code>this</code>
    * [.objectArg(name, propsConfig, [opts])](#module_caseGenerator/configArgs--configArgs.Args+objectArg) ⇒ <code>this</code>


* * *

<a name="new_module_caseGenerator/configArgs--configArgs.Args_new"></a>

##### new exports.Args(initialConfig)

| Param | Type |
| --- | --- |
| initialConfig | [<code>Array.&lt;ArgConfig&gt;</code>](#ArgConfig) | 


* * *

<a name="module_caseGenerator/configArgs--configArgs.Args+arg"></a>

##### args.arg(name, validCases, [opts]) ⇒ <code>this</code>
Add an argument

**Kind**: instance method of [<code>Args</code>](#module_caseGenerator/configArgs--configArgs.Args)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> |  |
| validCases | <code>Array.&lt;\*&gt;</code> | valid test cases for this argument |
| [opts] | <code>Object.&lt;string, \*&gt;</code> | other options |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [opts.optional] | <code>boolean</code> | flag to indicate whether this argument is optional |
| [opts.invalidCases] | <code>Array.&lt;\*&gt;</code> | invalid test cases for thsi argument |


* * *

<a name="module_caseGenerator/configArgs--configArgs.Args+objectArg"></a>

##### args.objectArg(name, propsConfig, [opts]) ⇒ <code>this</code>
Add an object type argument

**Kind**: instance method of [<code>Args</code>](#module_caseGenerator/configArgs--configArgs.Args)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| propsConfig | <code>Args</code> \| [<code>Array.&lt;ArgConfig&gt;</code>](#ArgConfig) | 
| [opts] | <code>Object.&lt;string, \*&gt;</code> | 

**Properties**

| Name | Type |
| --- | --- |
| [opts.optional] | <code>boolean</code> | 


* * *

<a name="module_caseGenerator/configObjectArg"></a>

## caseGenerator/configObjectArg

* * *

<a name="exp_module_caseGenerator/configObjectArg--configObjectArg"></a>

### configObjectArg(propsConfig) ⇒ [<code>ArgConfig</code>](#ArgConfig) ⏏
A helper to generate object test cases by provided configurations

**Kind**: Exported function  

| Param | Type |
| --- | --- |
| propsConfig | <code>Args</code> \| [<code>Array.&lt;ArgConfig&gt;</code>](#ArgConfig) | 

**Example**  
```js
configObjectArg(
 configArgs()
 .arg('a', [1, 2], { invalidCases: [NaN, 0] })
 .arg('b', ['a'], { invalidCases: ['', 1], optional: true })
);
// Result:
// {
//   validCases: [
//     { a: 1 },
//     { a: 2 },
//     { a: 1, b: a }
//   ],
//   invalidCases: [
//     { a: NaN },
//     { a: 0 },
//     { a: 1, b: '' },
//     { a: 1, b: 1 }
//   ]
// }
```

* * *

<a name="module_caseGenerator/enumerateArrayCases"></a>

## caseGenerator/enumerateArrayCases

* * *

<a name="exp_module_caseGenerator/enumerateArrayCases--enumerateArrayCases"></a>

### enumerateArrayCases ⇒ <code>Array.&lt;(Array.&lt;\*&gt;\|Object)&gt;</code> ⏏
**Kind**: Exported constant  
**See**: enumerateCases  

| Param | Type | Description |
| --- | --- | --- |
| argsConfig | [<code>Array.&lt;ArgConfig&gt;</code>](#ArgConfig) |  |
| invalidArgConfigIndex | <code>number</code> | Index of arg in the config list to have invalid case. If this is not set, it will generate cases that all arguments are valid. |


* * *

<a name="module_caseGenerator/enumerateCases"></a>

## caseGenerator/enumerateCases

* [caseGenerator/enumerateCases](#module_caseGenerator/enumerateCases)
    * [enumerateCases(appendMethod, argsConfig, invalidArgConfigIndex)](#exp_module_caseGenerator/enumerateCases--enumerateCases) ⇒ <code>Array.&lt;(Array.&lt;\*&gt;\|Object)&gt;</code> ⏏
        * [~appendMethod](#module_caseGenerator/enumerateCases--enumerateCases..appendMethod) ⇒ <code>Array.&lt;(Array.&lt;\*&gt;\|Object)&gt;</code>


* * *

<a name="exp_module_caseGenerator/enumerateCases--enumerateCases"></a>

### enumerateCases(appendMethod, argsConfig, invalidArgConfigIndex) ⇒ <code>Array.&lt;(Array.&lt;\*&gt;\|Object)&gt;</code> ⏏
Generate cases by given configuration

**Kind**: Exported function  

| Param | Type | Description |
| --- | --- | --- |
| appendMethod | <code>appendMethod</code> | This method will receive 2 input: existing case list, case value to extend. And should return extended case list. |
| argsConfig | [<code>Array.&lt;ArgConfig&gt;</code>](#ArgConfig) |  |
| invalidArgConfigIndex | <code>number</code> | Index of arg in the config list to have invalid case. If this is not set, it will generate cases that all arguments are valid. |

**Example**  
```js
enumerateCases(extendArrayCase, [
 { name: 'a', validCases: [true], invalidCases: [false]},
 { name: 'b', validCases: [1], invalidCases: [2]}
]);
// Result: [[true, 1]]

enumerateCases(extendArrayCase, [
 { name: 'a', validCases: [true], invalidCases: [false]},
 { name: 'b', validCases: [1], invalidCases: [2], optional: true }
]);
// Result: [[true], [true, 1]]

enumerateCases(extendArrayCase, [
 { name: 'a', validCases: [true], invalidCases: [false, 0]},
 { name: 'b', validCases: [1, 2], invalidCases: [3] }
], 0);
// Result: [[false, 1], [0, 1]]

enumerateCases(extendArrayCase, [
 { name: 'a', validCases: [true], invalidCases: [false, 0]},
 { name: 'b', validCases: [1, 2], invalidCases: [3], optional: true }
], 0);
// Result: [[false], [0], [false, 1], [0, 1]]
```

* * *

<a name="module_caseGenerator/enumerateCases--enumerateCases..appendMethod"></a>

#### enumerateCases~appendMethod ⇒ <code>Array.&lt;(Array.&lt;\*&gt;\|Object)&gt;</code>
**Kind**: inner typedef of [<code>enumerateCases</code>](#exp_module_caseGenerator/enumerateCases--enumerateCases)  

| Param | Type | Description |
| --- | --- | --- |
| cases | <code>Array.&lt;(Array.&lt;\*&gt;\|Object)&gt;</code> | generated cases |
| nextArgCase | <code>\*</code> |  |


* * *

<a name="module_testFunction"></a>

## testFunction

* [testFunction](#module_testFunction)
    * [.testFunction](#module_testFunction.testFunction)
    * [.enumerateArgsTestFunction](#module_testFunction.enumerateArgsTestFunction)


* * *

<a name="module_testFunction.testFunction"></a>

### testFunction.testFunction
**Kind**: static constant of [<code>testFunction</code>](#module_testFunction)  

| Param | Type |
| --- | --- |
| func | <code>function</code> | 
| [argsCases] | <code>Array.&lt;Array.&lt;\*&gt;&gt;</code> | 
| [testCaption] | <code>string</code> | 

**Example**  
```js
testFunction(targetFunction, [
 [1, 2],
 [0, -1],
 [0], 
 []
], 'custom combination test of targetFunction()');
```

* * *

<a name="module_testFunction.enumerateArgsTestFunction"></a>

### testFunction.enumerateArgsTestFunction
Catch snapshot of a function. It will do following tests:
- If no compulsory arguments defined, it will test empty argument case
- Test compulsory arguments first, and add in optional argument test cases one by one
- Test invalid cases by using arguments with one invalid argument, and first valid case for others
- Test all valid combinations of arguments

**Kind**: static constant of [<code>testFunction</code>](#module_testFunction)  

| Param | Type | Description |
| --- | --- | --- |
| func | <code>function</code> | Target function |
| argsConfig | <code>Args</code> \| [<code>Array.&lt;ArgConfig&gt;</code>](#ArgConfig) |  |
| [testCaption] | <code>string</code> | Test description |

**Example**  
```js
const emptyFunc = () => {};
enumerateArgsTestFunction(emptyFunc);

const simpleFunc = (param) => param;
enumerateArgsTestFunction(
  simpleFunc, 
  configArgs().arg('param', [1], { invalidCases: [0] })
]);

const funcHasOptional = (param, opts) => opts || param;
enumerateArgsTestFunction(
 funcHasOpts, 
 configArgs()
   .arg('param', [1], { invalidCases: [0] })
   .arg('opts', [2], { invalidCases: [0], optional: true })
);

const complexFunc = ({ param, opts }) => opts || param;
enumerateArgsTestFunction(
  funcHasOpts, 
  configArgs().objectArg(
    'param',
    configArgs()
      .arg('param', [1], { invalidCases: [0] })
      .arg('opts', [2], { invalidCases: [0], optional: true })
  )
);
```

* * *

<a name="ArgConfig"></a>

## ArgConfig : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| name | <code>string</code> | 
| validCases | <code>Array.&lt;\*&gt;</code> | 
| invalidCases | <code>Array.&lt;\*&gt;</code> | 
| optional | <code>boolean</code> | 


* * *

