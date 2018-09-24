import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const babelPlugin = babel({
	exclude: 'node_modules/**'
});

export default [
	// browser-friendly UMD build
	{
		input: 'src/index.js',
		external: ['jest'],
		output: [
			{
				name: 'lazy-jest',
				file: pkg.browser,
				format: 'umd',
				exports: 'named'
			},
			{ file: pkg.main, format: 'cjs', exports: 'named' },
			{ file: pkg.modules, format: 'es', exports: 'named' }
		],
		plugins: [
			resolve({ modulesOnly: true }),
      babelPlugin,
			commonjs(),
			terser(),
		]
	}
];