// Import dependencies...
const db = require('../db');
const ExpressError = require('../helpers/expressError');

// create location class and related functions
class Location {
	// FIND ALL LOCATIONS

	static async findAll() {
		const result = await db.query(
			`SELECT *
      FROM locations
      ORDER BY location ASC`
		);

		return result.rows;
	}

	// ADD A NEW LOCATION

	static async add(data) {
		const duplicateCheck = await db.query(
			`SELECT *
      FROM locations
      WHERE location = $1`,
			[data.location]
		);

		if (duplicateCheck.rows[0]) {
			const err = new ExpressError(`Location: '${data.location}' already exists`);
			err.status = 409;
			throw err;
		}

		const result = await db.query(
			`INSERT INTO locations
      (location)
      VALUES ($1)
    	RETURNING *`,
			[data.location]
		);

		return result.rows[0];
	}

	// DELETE A LOCATION (ADMIN PRIVELAGE)

	static async remove(id) {
		const result = await db.query(
			`DELETE FROM locations
      WHERE id = $1
      RETURNING location`,
			[id]
		);

		if (result.rows.length === 0) {
			const notFound = new ExpressError(`Location does not exist`);
			notFound.status = 404;
			throw notFound;
		}
	}
}

module.exports = Location;
