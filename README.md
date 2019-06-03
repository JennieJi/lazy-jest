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
<dt><a href="#module_caseGenerator/enumerateArrayCases">caseGenerator/enumerateArrayCases</a></dt>
<dd></dd>
<dt><a href="#module_caseGenerator/enumerateCases">caseGenerator/enumerateCases</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#exp_module_caseGenerator/configObjectArg--configObjectArg">configObjectArg(propsConfig)</a> ⇒ <code><a href="#ArgConfig">ArgConfig</a></code> ⏏</dt>
<dd><p>A helper to generate object test cases by provided configurations</p>
</dd>
<dt><a href="#testFunction">testFunction(func, [argsCases], [testCaption])</a></dt>
<dd></dd>
<dt><a href="#enumerateArgsTestFunction">enumerateArgsTestFunction(func, argsConfig, [testCaption])</a></dt>
<dd><p>Catch snapshot of a function. It will do following tests:</p>
<ul>
<li>If no compulsory arguments defined, it will test empty argument case</li>
<li>Test compulsory arguments first, and add in optional argument test cases one by one</li>
<li>Test invalid cases by using arguments with one invalid argument, and first valid case for others</li>
<li>Test all valid combinations of arguments</li>
</ul>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ArgConfig">ArgConfig</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="module_caseGenerator/configArgs"></a>

## caseGenerator/configArgs

* [caseGenerator/configArgs](#module_caseGenerator/configArgs)
    * [exports.Args](#exp_module_caseGenerator/configArgs--exports.Args) ⇒ <code>module:caseGenerator/configArgs.Args</code> ⏏
        * [~Args](#module_caseGenerator/configArgs--exports.Args..Args)


* * *

<a name="exp_module_caseGenerator/configArgs--exports.Args"></a>

### exports.Args ⇒ <code>module:caseGenerator/configArgs.Args</code> ⏏
**Kind**: Exported member  

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

<a name="module_caseGenerator/configArgs--exports.Args..Args"></a>

#### exports.Args~Args
Class for argument configurations

**Kind**: inner property of [<code>exports.Args</code>](#exp_module_caseGenerator/configArgs--exports.Args)  

* * *

<a name="module_caseGenerator/enumerateArrayCases"></a>

## caseGenerator/enumerateArrayCases

* * *

<a name="exp_module_caseGenerator/enumerateArrayCases--enumerateArrayCases"></a>

### enumerateArrayCases ⇒ <code>Array.&lt;(Array.&lt;\*&gt;\|Object)&gt;</code> ⏏
**Kind**: Exported member  
**See**: enumerateCases  

| Param | Type | Description |
| --- | --- | --- |
| argsConfig | [<code>Array.&lt;ArgConfig&gt;</code>](#ArgConfig) |  |
| invalidArgConfigIndex | <code>number</code> | Index of arg in the config list to have invalid case. If this is not set, it will generate cases that all arguments are valid. |


* * *

<a name="module_caseGenerator/enumerateCases"></a>

## caseGenerator/enumerateCases

* [caseGenerator/enumerateCases](#module_caseGenerator/enumerateCases)
    * [exports.appendArgCases](#exp_module_caseGenerator/enumerateCases--exports.appendArgCases) ⇒ <code>Array.&lt;(Array.&lt;\*&gt;\|Object)&gt;</code> ⏏
        * [~appendMethod](#module_caseGenerator/enumerateCases--exports.appendArgCases..appendMethod) ⇒ <code>Array.&lt;(Array.&lt;\*&gt;\|Object)&gt;</code>


* * *

<a name="exp_module_caseGenerator/enumerateCases--exports.appendArgCases"></a>

### exports.appendArgCases ⇒ <code>Array.&lt;(Array.&lt;\*&gt;\|Object)&gt;</code> ⏏
Generate cases by given configuration

**Kind**: Exported member  

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

<a name="module_caseGenerator/enumerateCases--exports.appendArgCases..appendMethod"></a>

#### exports.appendArgCases~appendMethod ⇒ <code>Array.&lt;(Array.&lt;\*&gt;\|Object)&gt;</code>
**Kind**: inner typedef of [<code>exports.appendArgCases</code>](#exp_module_caseGenerator/enumerateCases--exports.appendArgCases)  

| Param | Type | Description |
| --- | --- | --- |
| cases | <code>Array.&lt;(Array.&lt;\*&gt;\|Object)&gt;</code> | generated cases |
| nextArgCase | <code>\*</code> |  |


* * *

<a name="testFunction"></a>

## testFunction(func, [argsCases], [testCaption])
**Kind**: global function  

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

<a name="enumerateArgsTestFunction"></a>

## enumerateArgsTestFunction(func, argsConfig, [testCaption])
Catch snapshot of a function. It will do following tests:
- If no compulsory arguments defined, it will test empty argument case
- Test compulsory arguments first, and add in optional argument test cases one by one
- Test invalid cases by using arguments with one invalid argument, and first valid case for others
- Test all valid combinations of arguments

**Kind**: global function  

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

