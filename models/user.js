// Import dependencies...
const db = require('../db');
const bcrypt = require('bcrypt');
const ExpressError = require('../helpers/expressError');
const partialUpdate = require("../helpers/partialUpdate")
const { BCRYPT_WORK_FACTOR } = require('../config');

// create user class and related functions
class User {
	// authentication for user

	static async authenticate(data) {
		const result = await db.query(
			`SELECT id, firstname, lastname, password, is_admin
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

		const isNotValid = new ExpressError('Invalid Credentials');
		isNotValid.status = 401;
		throw isNotValid;
	}

	// FIND ALL USERS

	static async findAll() {
		const result = await db.query(
			`SELECT *
      FROM users
      ORDER BY firstname`
		);
		
		if (result.rows.length === 0) throw new ExpressError('Users not found', 404);
		return result.rows;
	}

	// REGISTER A NEW USER

	static async register(data) {
		const duplicateCheck = await db.query(
			`SELECT id, firstname, lastname
      FROM users
      WHERE id = $1`,
			[data.id]
		);

		if (duplicateCheck.rows[0]) {
			const err = new ExpressError(`User with the ID: '${data.id}' already exists`);
			err.status = 409;
			throw err;
		}

		const hashedPassword = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);

		const result = await db.query(
				`INSERT INTO users (id, firstname, lastname, password, is_admin)
				VALUES ($1, $2, $3, $4, $5)
				RETURNING id, firstname, lastname, is_admin`,
				[data.id, data.firstname, data.lastname, hashedPassword, data.is_admin]
				);

				if (result.rows.length === 0) throw new ExpressError('User could not be added', 400);
		return result.rows[0];
	}

	// RETURN USER INFO FROM ID

	static async findOne(user_id) {
		const userRes = await db.query(
			`SELECT id, firstname, lastname, is_admin
      FROM users
      WHERE id = $1`,
			[user_id]
		);

		const user = userRes.rows[0];

		if (!user) {
			const error = new ExpressError(`User with ID: '${user_id}' does not exist`);
			error.status = 404; // 404 NOT FOUND
			throw error;
		}

		return user;
	}

	/** Update user data with `data`.
	 *
	 * This is a "partial update" --- it's fine if data doesn't contain
	 * all the fields; this only changes provided ones.
	 *
	 * Return data for changed user.
	 */

	// UPDATE USER
	static async update(id, data) {
		if (data.password) {
			data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
		}

		const { query, values } = partialUpdate('users', data, 'id', id);

		const result = await db.query(query, values);
		const user = result.rows[0];

		if (!user) {
			let notFound = new ExpressError(`User with id: '${id}' does not exist`);
			notFound.status = 404;
			throw notFound;
		}

		delete user.password;

		return result.rows[0];
	}

	/** Delete given user from database; returns undefined. */

	static async remove(id) {
		const result = await db.query(
			`DELETE FROM users
      WHERE id = $1
      RETURNING firstname`,
			[id]
		);

		if (result.rows.length === 0) {
			const notFound = new ExpressError(`User with ID: '${id}' does not exist`);
			notFound.status = 404;
			throw notFound;
		}
	}
}

module.exports = User;
