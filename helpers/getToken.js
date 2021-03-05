const jwt = require('jsonwebtoken');
const { SECRET } = require('../config');

const getToken = (user) => {
	const payload = {
		id: user.id
	};
	return jwt.sign(payload, SECRET);
};

module.exports = getToken;
