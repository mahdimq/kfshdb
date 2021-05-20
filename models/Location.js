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
      ORDER BY location_name ASC`
		);

		return result.rows;
	}

	// FIND ONE LOCATION

	static async findOne(id) {
		const result = await db.query(
			`SELECT *
      FROM locations
      WHERE id = $1`,
			[id]
		);

		return result.rows[0];
	}

	// ADD A NEW LOCATION

	static async add(data) {
		const duplicateCheck = await db.query(
			`SELECT *
      FROM locations
      WHERE location_name = $1`,
			[data.location_name]
		);

		if (duplicateCheck.rows[0]) {
			const err = new ExpressError(`Location: '${data.location_name}' already exists`);
			err.status = 409;
			throw err;
		}

		const result = await db.query(
			`INSERT INTO locations
      (location_name)
      VALUES ($1)
    	RETURNING *`,
			[data.location_name]
		);

		return result.rows[0];
	}

	// DELETE A LOCATION (ADMIN PRIVELAGE)

	static async remove(id) {
		const result = await db.query(
			`DELETE FROM locations
      WHERE id = $1
      RETURNING location_name`,
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
