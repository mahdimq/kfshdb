// Import dependencies...
const db = require('../db');
const ExpressError = require('../helpers/expressError');

// create test class and related functions
class TestCodes {
	// FIND ALL TESTS

	static async findAll() {
		const result = await db.query(
			`SELECT *
      FROM test_codes`
		);

		return result.rows;
	}

	// FIND ONE TEST

	static async findOne(cpt) {
		const result = await db.query(
			`SELECT *
      FROM test_codes
      WHERE cpt = $1`,
			[cpt]
		);

		return result.rows[0];
	}

	// ADD A NEW TEST

	static async add(data) {
		const duplicateCheck = await db.query(
			`SELECT *
      FROM test_codes
      WHERE cpt = $1`,
			[data.cpt]
		);

		if (duplicateCheck.rows[0]) {
			const err = new ExpressError(`Test: '${data.cpt}' already exists`);
			err.status = 409;
			throw err;
		}

		const result = await db.query(
			`INSERT INTO test_codes
      (cpt, description)
      VALUES ($1, $2)
    	RETURNING *`,
			[data.cpt, data.description]
		);

		return result.rows[0];
	}

	// DELETE A TEST (ADMIN PRIVELAGE)

	static async remove(id) {
		const result = await db.query(
			`DELETE FROM test_codes
      WHERE id = $1
      RETURNING cpt, description`,
			[id]
		);

		if (result.rows.length === 0) {
			const notFound = new ExpressError(`Test Code does not exist`);
			notFound.status = 404;
			throw notFound;
		}
	}
}

module.exports = TestCodes;
