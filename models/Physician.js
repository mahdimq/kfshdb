// Import dependencies...
const db = require('../db');
const ExpressError = require('../helpers/expressError');

// create physician class and related functions
class Physician {
	// FIND ALL PHYSICIANS

	static async findAll() {
		const result = await db.query(
			`SELECT *
      FROM physicians
      ORDER BY full_name ASC`
		);

		return result.rows;
	}

	// ADD A NEW PHYSICIAN

	static async add(data) {
		const duplicateCheck = await db.query(
			`SELECT *
      FROM physicians
      WHERE full_name = $1`,
			[data.full_name]
		);

		if (duplicateCheck.rows[0]) {
			const err = new ExpressError(`Physician: '${data.full_name}' already exists`);
			err.status = 409;
			throw err;
		}

		const result = await db.query(
			`INSERT INTO physicians
      (full_name)
      VALUES ($1)
    	RETURNING *`,
			[data.full_name]
		);

		return result.rows[0];
	}

	// RETURN PHYSICIAN INFO

	static async findOne(id) {
		const physicianRes = await db.query(
			`SELECT *
      FROM physicians
      WHERE id = $1`,
			[id]
		);

		const physician = physicianRes.rows[0];

		if (!physician) {
			const error = new ExpressError(`Physician does not exist`);
			error.status = 404; // 404 NOT FOUND
			throw error;
		}

		return physician;
	}

	/** Update physician data with `data`.
	 *
	 * This is a "partial update" --- it's fine if data doesn't contain
	 * all the fields; this only changes provided ones.
	 *
	 * Return data for changed physician.
	 */

	// UPDATE PHYSICIAN
	static async update(id, data) {
		let { query, values } = partialUpdate('physicians', data, 'id', id);

		const result = await db.query(query, values);
		const physician = result.rows[0];

		if (!physician) {
			let notFound = new ExpressError(`Physician does not exist`);
			notFound.status = 404;
			throw notFound;
		}
		return result.rows[0];
	}

	/** Delete given physician from database; returns undefined.
	 * NEEDS EXTREME AUTHENTICATION AND ADMIN RIGHTS
	 */

	static async remove(id) {
		const result = await db.query(
			`DELETE FROM physicians
      WHERE id = $1
      RETURNING full_name`,
			[id]
		);

		if (result.rows.length === 0) {
			const notFound = new ExpressError(`Physician does not exist`);
			notFound.status = 404;
			throw notFound;
		}
	}
}

module.exports = Physician;
