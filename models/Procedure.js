// Import dependencies...
const db = require('../db');
const ExpressError = require('../helpers/expressError');

// create procedure class and related functions
class Procedure {
	// FIND ALL PROCEDURES

	static async findAll() {
		const result = await db.query(
			`SELECT *
      FROM procedures
      ORDER BY name ASC`
		);

		return result.rows;
	}

	// FIND ONE PROCEDURE

	static async findOne(id) {
		const result = await db.query(
			`SELECT *
      FROM procedures
      WHERE id = $1`,
			[id]
		);

		return result.rows[0];
	}

	// ADD A NEW PROCEDURE

	static async add(data) {
		const duplicateCheck = await db.query(
			`SELECT *
      FROM procedures
      WHERE name = $1`,
			[data.name]
		);

		if (duplicateCheck.rows[0]) {
			const err = new ExpressError(`Procedure: '${data.name}' already exists`);
			err.status = 409;
			throw err;
		}

		const result = await db.query(
			`INSERT INTO procedures
      (name)
      VALUES ($1)
    	RETURNING *`,
			[data.name]
		);

		return result.rows[0];
	}

	// DELETE A PROCEDURE (ADMIN PRIVELAGE)

	static async remove(id) {
		const result = await db.query(
			`DELETE FROM procedures
      WHERE id = $1
      RETURNING name`,
			[id]
		);

		if (result.rows.length === 0) {
			const notFound = new ExpressError(`Procedure does not exist`);
			notFound.status = 404;
			throw notFound;
		}
	}
}

module.exports = Procedure;
