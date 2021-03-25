// Import dependencies...
const db = require('../db');
const ExpressError = require('../helpers/expressError');

// create departments class and related functions
class Department {
	// FIND ALL DEPARTMENTS
	static async findAll() {
		const result = await db.query(
			`SELECT *
      FROM departments
      ORDER BY name ASC`
		);

		return result.rows;
	}

	// FIND ONE DEPARTMENT
	static async findOne(id) {
		const result = await db.query(
			`SELECT *
      FROM departments
      WHERE id = $1`,
			[id]
		);

		return result.rows[0];
	}

	// ADD A NEW DEPARTMENT
	static async add(data) {
		const duplicateCheck = await db.query(
			`SELECT *
      FROM departments
      WHERE name = $1`,
			[data.name]
		);

		if (duplicateCheck.rows[0]) {
			const err = new ExpressError(`Department: '${data.name}' already exists`);
			err.status = 409;
			throw err;
		}

		const result = await db.query(
			`INSERT INTO departments
      (name)
      VALUES ($1)
    	RETURNING *`,
			[data.name]
		);

		return result.rows[0];
	}

	// DELETE A DEPARTMENT (ADMIN PRIVELAGE)

	static async remove(id) {
		const result = await db.query(
			`DELETE FROM departments
      WHERE id = $1
      RETURNING name`,
			[id]
		);

		if (result.rows.length === 0) {
			const notFound = new ExpressError(`Department does not exist`);
			notFound.status = 404;
			throw notFound;
		}
	}
}

module.exports = Department;
