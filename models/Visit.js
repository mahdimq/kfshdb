const db = require('../db');
const ExpressError = require('../helpers/expressError');
const Patient = require('./Patient');
const Physician = require('./Physician');
const User = require('./User');
const Department = require('./Department');

/** Related functions for visits. */

class Visit {
	// ADD DATA TO VISIT, AUTH REQUIRED
	static async addVisit(patient_mrn, physician_id, user_id, location_id, visit_date, status) {
		if (!patient_mrn || !physician_id || !user_id || !visit_date)
			throw new ExpressError('Visit not found', 400);
		// Check if visit already exists
		// const duplicateCheck = await db.query(
		// 	`SELECT procedureLog
    //   FROM visits
    //   WHERE mrn = $1 AND techId = $2`,
		// 	[mrn, user_id]
		// );

		// if (duplicateCheck.rows[0]) {
		// 	const err = new ExpressError(`Visit already completed`);
		// 	err.status = 409;
		// 	throw err;
		// }

		// If no duplicates found, add current visit to list
		const result = await db.query(
			`INSERT INTO visits (patient_mrn, physician_id, user_id, location_id, visit_date, status)
			VALUES ($1, $2, $3, $4, $5, $6)
			RETURNING *`,
			[patient_mrn, physician_id, user_id, location_id, visit_date, status]
		);
		if (!result.rows[0]) throw new ExpressError('Unable to add visit', 500);
		return await Patient.findOne(mrn);
	}

	// GET ALL VISITS
	static async getAll(){
		const result = await db.query(
			`SELECT * FROM visits`
		);

		if (result.rows.length === 0) throw new ExpressError('Visits not found', 404);
		return result.rows;
	}

	// Get list of movies from watchlist
	// static async getFromVisit(mrn) {
	// 	if (!mrn) throw new ExpressError('Patient not found', 400);

	// 	const result = await db.query(
	// 		// select t1.name, t2.image_id, t3.path
	// 		// from table1 t1 inner join table2 t2 on t1.person_id = t2.person_id
	// 		// inner join table3 t3 on t2.image_id=t3.image_id
	// 		`SELECT c.mrn, procedure, u.techId, p.physicianId, d.departmentId
	// 		FROM patients AS c INNER JOIN users AS u ON c.mrn =
	// 		JOIN watchlist as w
	// 		ON m.id = w.movie_id
	// 		WHERE w.user_id = $1`,
	// 		[user_id]
	// 	);
	// 	if (!result) throw new ExpressError('No movies found', 400);
	// 	return result.rows;
	// }

// 	// Remove movie from watchlist. Auth required.
// 	static async removeFromWatchlist(user_id, movie_id) {
// 		if (!user_id || !movie_id) throw new ExpressError('User or Movie not found', 400);
// 		const result = await db.query(
// 			`DELETE FROM watchlist
// 			WHERE user_id = $1
// 			AND movie_id = $2
// 			RETURNING movie_id`,
// 			[user_id, movie_id]
// 		);
// 		if (!result) throw new ExpressError('Visit is empty!');
// 		return result.rows;
	// }
}

module.exports = Visit;
