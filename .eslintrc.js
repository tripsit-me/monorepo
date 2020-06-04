'use strict';

const testFiles = [
	'**/__tests__/*.spec.js',
	'**/__mocks__/*.js',
	'tests/**/*.spec.js',
	'**/jest.setup.js',
];

module.exports = {
	root: true,
	extends: 'airbnb-base',
	parserOptions: { sourceType: 'script' },
	env: { node: true },
	rules: {
		strict: [2, 'global'],
		indent: [2, 'tab'],
		'no-tabs': 0,
		'arrow-parens': [2, 'as-needed'],
	},
	overrides: [
		{
			files: [
				'compile-templates.js',
				'webpack.config.js',
				'babel.config.js',
			]
				.concat(testFiles),
			rules: {
				'import/no-extraneous-dependencies': [2, { devDependencies: true }],
			},
		},
		{
			files: testFiles,
			env: { jest: true },
			plugins: ['jest'],
		},
		{
			files: ['packages/web-main/js/**/*.js'],
			parser: 'babel-eslint',
			parserOptions: { sourceType: 'module' },
			rules: { strict: 0 },
		},
	],
};
