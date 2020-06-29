'use strict';

const path = require('path');
const pug = require('pug');
const pages = require('./pages');

const basedir = path.resolve('templates');

Promise.all(pages.map(({
	url,
	content,
	vars,
	template = 'default',
}) => pug.compileFile(path.resolve(`templates/${template}.pug`), { basedir })({
	pageUrl: url,
	contentFile: path.resolve(`content/${content}.md`),
	...vars,
})));
