'use strict';

const path = require('path');
const webpackMerge = require('webpack-merge');

const base = {
	context: path.resolve('js'),
	entry: [
		'./index.js',
	],
	output: {
		path: path.resolve('docroot'),
		filename: 'main.js',
	},
	module: {
		strictExportPresence: true,
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [{
					loader: 'babel-loader',
					options: { sourceMap: true },
				}],
			},
		],
	},
};

const environments = {
	development: {
		mode: 'development',
		watch: true,
	},

	production: {
		mode: 'production',
	},
};

module.exports = function webpackConfig(env = 'development') {
	return webpackMerge(base, environments[env]);
};
