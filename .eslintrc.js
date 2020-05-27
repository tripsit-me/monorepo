'use strict';

module.exports = {
	root: true,
	extends: 'airbnb-base',
	parserOptions: { sourceType: 'script' },
	env: { node: true },
	rules: {
		strict: [2, 'global'],
		indent: [2, 'tab'],
		'no-tabs': 0,
	},
	overrides: [
		{
			files: [
				'**/__tests__/*.spec.js',
				'**/__mocks__/*.js',
				'tests/**/*.spec.js',
				'**/jest.setup.js',
			],
			env: { jest: true },
			plugins: ['jest'],
		},
	],
};
