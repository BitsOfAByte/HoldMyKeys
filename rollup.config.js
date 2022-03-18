import rollupTypescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
	plugins: [rollupTypescript(), terser()],
	treeshake: true,
	cache: true,
	input: './dist/tsc/lib/index.js',
	output: {
		file: './dist/bundle/bundle.js'
	},
};

export default config;