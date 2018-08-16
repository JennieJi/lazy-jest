easy-jest
---

Jest util for lazy person like me to generate mass test snapshots with few configurations.
*It only supports function test now*

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

## Members

<dl>
<dt><a href="#ArgsConfig">ArgsConfig</a></dt>
<dd><p>Helper for generate ArgConfig</p>
</dd>
<dt><a href="#enumerateArrayCases">enumerateArrayCases</a> ⇒ <code>Array.&lt;(Array.&lt;*&gt;|Object)&gt;</code></dt>
<dd></dd>
<dt><a href="#appendArgCases">appendArgCases</a> ⇒ <code>Array.&lt;(Array.&lt;*&gt;|Object)&gt;</code></dt>
<dd><p>Extend cases with a list of new cases by given method.</p>
</dd>
<dt><a href="#testFunction">testFunction</a></dt>
<dd></dd>
<dt><a href="#enumerateArgsTestFunction">enumerateArgsTestFunction</a></dt>
<dd><p>Catch snapshot of a function. It will do following tests:</p>
<ul>
<li>If no compulsory arguments defined, it will test empty argument case</li>
<li>Test compulsory arguments first, and add in optional argument test cases one by one</li>
<li>Test invalid cases by using arguments with one invalid argument, and first valid case for others</li>
<li>Test all valid combinations of arguments</li>
</ul>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#makeObjectArg">makeObjectArg(propsConfig)</a> ⇒ <code>Object</code></dt>
<dd><p>A helper to generate object test cases by provided configurations</p>
</dd>
<dt><a href="#enumerateCases">enumerateCases(appendMethod, argsConfig, invalidArgConfigIndex)</a> ⇒ <code>Array.&lt;(Array.&lt;*&gt;|Object)&gt;</code></dt>
<dd><p>Generate cases by given configuration</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#appendMethod">appendMethod</a> ⇒ <code>Array.&lt;(Array.&lt;*&gt;|Object)&gt;</code></dt>
<dd></dd>
<dt><a href="#ArgConfig">ArgConfig</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="ArgsConfig"></a>

## ArgsConfig
Helper for generate ArgConfig

**Kind**: global variable  
**Access**: protected  

* * *

<a name="ArgsConfig+configArgs"></a>

### argsConfig.configArgs()
**Kind**: instance method of [<code>ArgsConfig</code>](#ArgsConfig)  
**Example**  
```js
// example ArgConfig for `func(a, b) {}`
configArgs()
.arg('a', [0, 1, 2])
.arg('b', [-1, -2], { optional: true, invalidCases: [0] });
```

* * *

<a name="enumerateArrayCases"></a>

## enumerateArrayCases ⇒ <code>Array.&lt;(Array.&lt;\*&gt;\|Object)&gt;</code>
**Kind**: global variable  
**See**: enumerateCases  

| Param | Type | Description |
| --- | --- | --- |
| argsConfig | [<code>Array.&lt;ArgConfig&gt;</code>](#ArgConfig) |  |
| invalidArgConfigIndex | <code>number</code> | Index of arg in the config list to have invalid case. If this is not set, it will generate cases that all arguments are valid. |


* * *

<a name="appendArgCases"></a>

## appendArgCases ⇒ <code>Array.&lt;(Array.&lt;\*&gt;\|Object)&gt;</code>
Extend cases with a list of new cases by given method.

**Kind**: global variable  

| Param | Type | Description |
| --- | --- | --- |
| appendMethod | [<code>appendMethod</code>](#appendMethod) | This method will receive 2 input: existing case list, case value to extend. And should return extended case list. |
| cases | <code>Array.&lt;(Array.&lt;\*&gt;\|Object)&gt;</code> |  |
| nextArgCases | <code>Array.&lt;\*&gt;</code> |  |

**Example**  
```js
appendArgCases(extendArrayCase, [], [2, 3]);  // Result: [[2], [3]],
appendArgCases(extendArrayCase, [[0], [1]], [2, 3]);  // Result: [[0, 2], [1, 2], [1, 2], [1, 3]],
```

* * *

<a name="testFunction"></a>

## testFunction
**Kind**: global variable  

| Param | Type |
| --- | --- |
| func | <code>function</code> | 
| [argsCases] | <code>Array.&lt;Array.&lt;\*&gt;&gt;</code> | 
| [testCaption] | <code>string</code> | 


* * *

<a name="enumerateArgsTestFunction"></a>

## enumerateArgsTestFunction
Catch snapshot of a function. It will do following tests:
- If no compulsory arguments defined, it will test empty argument case
- Test compulsory arguments first, and add in optional argument test cases one by one
- Test invalid cases by using arguments with one invalid argument, and first valid case for others
- Test all valid combinations of arguments

**Kind**: global variable  

| Param | Type | Description |
| --- | --- | --- |
| func | <code>function</code> | Target function |
| argsConfig | [<code>ArgsConfig</code>](#ArgsConfig) |  |
| [testCaption] | <code>string</code> | Test description |

**Example**  
```js
const emptyFunc = () => {};
enumerateArgsTestFunction(emptyFunc);

const simpleFunc = (param) => param;
enumerateArgsTestFunction(simpleFunc, [
 { name:'param', validCases: [1], invalidCases: [0]  }
]);

const funcHasOptional = (param, opts) => opts || param;
enumerateArgsTestFunction(funcHasOpts, [
 { name:'param', validCases: [1], invalidCases: [0]  }
 { name:'opts', validCases: [2], invalidCases: [0], optional: true  }
]);

const complexFunc = ({ param, opts }) => opts || param;
enumerateArgsTestFunction(funcHasOpts, [
 {
   ...makeObjectCases([
     { name:'param', validCases: [1], invalidCases: [0]  }
     { name:'opts', validCases: [2], invalidCases: [0], optional: true  }
   ]},
   name: 'argument1'
 }
]);
```

* * *

<a name="makeObjectArg"></a>

## makeObjectArg(propsConfig) ⇒ <code>Object</code>
A helper to generate object test cases by provided configurations

**Kind**: global function  

| Param | Type |
| --- | --- |
| propsConfig | [<code>ArgConfig</code>](#ArgConfig) | 

**Example**  
```js
makeObjectArg([
 {
   name: 'a',
   validCases: [1, 2],
   invalidCases: [NaN, 0]
 },
 {
   name: 'b',
   validCases: ['a'],
   invalidCases: ['', 1],
   optional: true
 }
]);
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

<a name="enumerateCases"></a>

## enumerateCases(appendMethod, argsConfig, invalidArgConfigIndex) ⇒ <code>Array.&lt;(Array.&lt;\*&gt;\|Object)&gt;</code>
Generate cases by given configuration

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| appendMethod | [<code>appendMethod</code>](#appendMethod) | This method will receive 2 input: existing case list, case value to extend. And should return extended case list. |
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

<a name="appendMethod"></a>

## appendMethod ⇒ <code>Array.&lt;(Array.&lt;\*&gt;\|Object)&gt;</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| cases | <code>Array.&lt;(Array.&lt;\*&gt;\|Object)&gt;</code> | generated cases |
| nextArgCase | <code>\*</code> |  |


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

