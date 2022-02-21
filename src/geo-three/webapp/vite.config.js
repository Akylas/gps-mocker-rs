const path = require('path');
const {defineConfig} = require('vite');

module.exports = defineConfig({
	publicDir: path.resolve(__dirname, '../example'),
	define: {
		FORCE_MOBILE: false,
		EXTERNAL_APP: false
	},
	server: {host: '0.0.0.0'},
	build: {outDir: path.resolve(__dirname, '../example')}
});
