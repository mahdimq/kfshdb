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

	// FIND ONE LOCATION

	static async findOne(id) {
		const result = await db.query(
			`SELECT *
      FROM procedures
      WHERE id = $1`,
			[id]
		);

		return result.rows[0];
	}

	// ADD A NEW LOCATION

	static async add(data) {
		const duplicateCheck = await db.query(
			`SELECT *
      FROM procedures
      WHERE procedure_name = $1`,
			[data.name]
		);

		if (duplicateCheck.rows[0]) {
			const err = new ExpressError(`Location: '${data.name}' already exists`);
			err.status = 409;
			throw err;
		}

		const result = await db.query(
			`INSERT INTO procedures
      (procedure_name)
      VALUES ($1)
    	RETURNING *`,
			[data.name]
		);

		return result.rows[0];
	}

	// DELETE A LOCATION (ADMIN PRIVELAGE)

	static async remove(id) {
		const result = await db.query(
			`DELETE FROM procedures
      WHERE id = $1
      RETURNING procedure_name`,
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
