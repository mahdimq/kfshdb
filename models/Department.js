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
      ORDER BY dept_name ASC`
		);

		return result.rows;
	}

	// ADD A NEW DEPARTMENT

	static async add(data) {
		const duplicateCheck = await db.query(
			`SELECT *
      FROM departments
      WHERE dept_name = $1`,
			[data.dept_name]
		);

		if (duplicateCheck.rows[0]) {
			const err = new ExpressError(`Department: '${data.dept_name}' already exists`);
			err.status = 409;
			throw err;
		}

		const result = await db.query(
			`INSERT INTO departments
      (dept_name)
      VALUES ($1)
    	RETURNING *`,
			[data.dept_name]
		);

		return result.rows[0];
	}

	// DELETE A DEPARTMENT (ADMIN PRIVELAGE)

	static async remove(id) {
		const result = await db.query(
			`DELETE FROM departments
      WHERE id = $1
      RETURNING dept_name`,
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
