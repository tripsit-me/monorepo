'use strict';

const withUser = require('./traits/with-user');
const { compose } = require('../util');

async function blackoutcheck({ event, db, user }, target, minutes) {
	if (target) {

	}
}

module.exports = compose(withUser)(blackoutcheck);
