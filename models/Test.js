// Import dependencies...
const db = require('../db');
const ExpressError = require('../helpers/expressError');

// create test class and related functions
class Test {
	// FIND ALL TESTS

	static async findAll() {
		const result = await db.query(
			`SELECT *
      FROM tests`
		);

		return result.rows;
	}

	// FIND ONE TEST

	static async findOne(id) {
		const result = await db.query(
			`SELECT *
      FROM tests
      WHERE id = $1`,
			[id]
		);

		return result.rows[0];
	}

	// ADD A NEW TEST

	static async add(data) {
		const duplicateCheck = await db.query(
			`SELECT *
      FROM tests
      WHERE id = $1`,
			[data.id]
		);

		if (duplicateCheck.rows[0]) {
			const err = new ExpressError(`Test: '${data.id}' already exists`);
			err.status = 409;
			throw err;
		}

		const result = await db.query(
			`INSERT INTO tests
      (id, cpt_id, quantity)
      VALUES ($1, $2, $3)
    	RETURNING *`,
			[data.id, data.cpt_id, data.quantity]
		);

		return result.rows[0];
	}

	// DELETE A TEST (ADMIN PRIVELAGE)

	static async remove(id) {
		const result = await db.query(
			`DELETE FROM tests
      WHERE id = $1`,
			[id]
		);

		if (result.rows.length === 0) {
			const notFound = new ExpressError(`Test does not exist`);
			notFound.status = 404;
			throw notFound;
		}
	}
}

module.exports = Test;
