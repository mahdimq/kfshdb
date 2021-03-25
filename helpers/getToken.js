const jwt = require('jsonwebtoken');
const { SECRET } = require('../config');

const getToken = (user) => {
	const payload = {
		id: user.id,
		firstname: user.firstname,
		lastname: user.lastname,
		is_admin: user.is_admin
	};
	return jwt.sign(payload, SECRET);
};

module.exports = getToken;
