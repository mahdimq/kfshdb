// Import dependencies...
const db = require('../db');
const ExpresError = require('../helpers/expressError');
const { BCRYPT_WORK_FACTOR } = require('../config');

// create user class and related functions
class User {
	// authentication for user

	static async authenticate(data) {
		const result = await db.query(
			`SELECT id, firstname, lastname
      FROM users
      WHERE id = $1`,
			[data.id]
		);

		const user = result.rows[0];

		if (user) {
			// compare passwords to make sure they match
			const isValid = await bcrypt.compare(data.password, user.password);
			if (isValid) {
				return user;
			}
		}

		const isNotValid = new ExpresError('Invalid Credentials');
		isNotValid.status = 401;
		throw isNotValid;
	}

	// FIND ALL USERS

	static async findAll() {
		const result = await db.query(
			`SELECT id, firstname, lastname
      FROM users
      ORDER BY firstname`
		);

		return result.rows;
	}
}

module.exports = User;
