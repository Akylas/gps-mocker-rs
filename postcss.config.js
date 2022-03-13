const cssnano = require('cssnano');
const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const production = mode === 'production';

const config = {
	plugins: [
		production &&
			cssnano({
				preset: 'default'
			})
	]
};

module.exports = config;