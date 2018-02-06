
import babel from 'rollup-plugin-babel';

/**
 * glsl transform from three.js rollup.config.js
 *
 * @see https://github.com/mrdoob/three.js/blob/r82/rollup.config.js
 */

function glsl () {
	return {
		transform ( code, id ) {
			if ( !/\.glsl$/.test( id ) ) return;

			var transformedCode = 'export default ' + JSON.stringify(
				code
					.replace( /[ \t]*\/\/.*\n/g, '' )
					.replace( /[ \t]*\/\*[\s\S]*?\*\//g, '' )
					.replace( /\n{2,}/g, '\n' )
			) + ';';
			return {
				code: transformedCode,
				map: { mappings: '' }
			};
		}
	};
}

export default {
	entry: 'src/Game.js',
	plugins: [
		glsl(),
		babel({
			exclude: [
				'node_modules/**',
				'src/lib/**'
			]
		})
	],
	targets: [
		{
			format: 'iife',
			dest: 'dev/micromachines.js',
			moduleName: 'micromachines'
		}
	],
};