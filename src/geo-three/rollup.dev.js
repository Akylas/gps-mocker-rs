import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import typescript from '@rollup/plugin-typescript';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import {resolve} from 'path';
import {readFileSync} from 'fs';

export default [{
	input: 'webapp/app.ts',
	plugins: [
		typescript({tsconfig: 'webapp/tsconfig.json'}),
		nodeResolve({mainFields: ['browser', 'module', 'main']}),
		commonjs(),
		serve({
			open: true,
			contentBase: '.',
			openPage: '/example',
			// host: '0.0.0.0',
			host: '127.0.0.1',
			port: 8081,
			headers: {'Access-Control-Allow-Origin': '*'}
			// https: {
			// 	cert: readFileSync(resolve(__dirname, 'server.crt')),
			// 	key: readFileSync(resolve(__dirname, 'server.key')),
			// 	ca: readFileSync(resolve(__dirname, 'server.csr'))
			// }
		}),
		livereload('example'),
		replace({
			'EXTERNAL_APP': 'false',
			'FORCE_MOBILE': 'false'
		})
	],
	output: [
		{
			esModule: true,
			format: 'iife',
			name: 'webapp',
			file: 'example/app.js'
		}
	]
}];
