// Import dependencies...
const db = require('../db');
const ExpressError = require('../helpers/expressError');

// create patient class and related functions
class Patient {
	// FIND ALL PATIENTS

	static async findAll() {
		const result = await db.query(
			`SELECT *
      FROM patients
      ORDER BY mrn`
		);

		return result.rows;
	}

	// ADD A NEW PATIENT

	static async register(data) {
		const duplicateCheck = await db.query(
			`SELECT mrn
      FROM patients
      WHERE mrn = $1`,
			[data.mrn]
		);

		if (duplicateCheck.rows[0]) {
			const err = new ExpressError(`Patient with the MRN: '${data.mrn}' already exists`);
			err.status = 409;
			throw err;
		}

		const result = await db.query(
			`INSERT INTO patients
      (mrn, firstname, lastname, dob, gender, age_category, nationality)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    	RETURNING *`,
			[
				data.mrn,
				data.firstname,
				data.lastname,
				data.dob,
				data.gender,
				data.age_category,
				data.nationality
			]
		);

		return result.rows[0];
	}

	// RETURN PATIENT INFO FROM MRN

	static async findOne(mrn) {
		const patientRes = await db.query(
			`SELECT *
      FROM patients
      WHERE mrn = $1`,
			[mrn]
		);

		const patient = patientRes.rows[0];

		if (!patient) {
			const error = new ExpressError(`Patient with MRN: '${mrn}' does not exist`);
			error.status = 404; // 404 NOT FOUND
			throw error;
		}

		return patient;
	}

	/** Update patient data with `data`.
	 *
	 * This is a "partial update" --- it's fine if data doesn't contain
	 * all the fields; this only changes provided ones.
	 *
	 * Return data for changed patient.
	 */

	// UPDATE PATIENT
	static async update(mrn, data) {
		let { query, values } = partialUpdate('patients', data, 'mrn', mrn);

		const result = await db.query(query, values);
		const patient = result.rows[0];

		if (!patient) {
			let notFound = new ExpressError(`Patient with mrn: '${mrn}' does not exist`);
			notFound.status = 404;
			throw notFound;
		}
		return result.rows[0];
	}

	/** Delete given patient from database; returns undefined.
	 * NEEDS EXTREME AUTHENTICATION AND ADMIN RIGHTS
	 */

	static async remove(mrn) {
		const result = await db.query(
			`DELETE FROM patients
      WHERE mrn = $1
      RETURNING mrn`,
			[mrn]
		);

		if (result.rows.length === 0) {
			const notFound = new ExpressError(`Patient with ID: '${mrn}' does not exist`);
			notFound.status = 404;
			throw notFound;
		}
	}
}

module.exports = Patient;
