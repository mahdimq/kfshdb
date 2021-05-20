const db = require('../db');
const ExpressError = require('../helpers/expressError');
const Patient = require('./Patient');
const Physician = require('./Physician');
const User = require('./User');
const Department = require('./Department');

/** Related functions for visits. */

class Visit {
  // ADD DATA TO VISIT, AUTH REQUIRED
  static async addVisit(
    log_num,
    ped_log_num,
    patient_mrn,
    physician_id,
    user_id,
    location_id,
    visit_date
  ) {
    if (!log_num || !patient_mrn || !physician_id || !user_id || !visit_date)
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
      `INSERT INTO visits (log_num, ped_log_num, patient_mrn, physician_id, user_id, procedure_id, location_id, visit_date)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
			RETURNING *`,
      [
        log_num,
        ped_log_num,
        patient_mrn,
        physician_id,
        user_id,
        procedure_id,
        location_id,
        visit_date
      ]
    );
    if (!result.rows[0]) throw new ExpressError('Unable to add visit', 500);
    return await Patient.findOne(mrn);
  }

  // GET ALL VISITS
  static async getAll(mrn) {
    const result = await db.query(
      `SELECT visits.log_num, visits.ped_log_num, visits.patient_mrn, 
      patients.firstname AS p_firstname, patients.middlename AS p_middlename, patients.lastname AS p_lastname,
      patients.dob, patients.gender, patients.nationality, patients.age_group,
      users.firstname AS user_firstname, users.lastname AS user_lastname, procedures.procedure_name, 
      locations.location_name, physicians.firstname, physicians.lastname, visits.visit_date 
      FROM visits 
      JOIN patients ON visits.patient_mrn = patients.mrn
      JOIN physicians ON visits.physician_id = physicians.id 
      JOIN users ON visits.user_id = users.id 
      JOIN locations ON visits.location_id = locations.id
      JOIN procedures ON visits.procedure_id = procedures.id
      WHERE visits.patient_mrn = $1`,
      [ mrn ]
    );

    const visit = result.rows;

    if (!visit) {
      const error = new ExpressError(`Visit does not exist`);
      error.status = 404; // 404 NOT FOUND
      throw error;
    }
    return visit;
  }

  // Get list of all visits in the database
  static async getVisits() {
    const result = await db.query(
      `SELECT visits.log_num, visits.ped_log_num, visits.patient_mrn, 
      patients.firstname AS p_firstname, patients.middlename AS p_middlename, patients.lastname AS p_lastname,
      patients.dob, patients.gender, patients.nationality, patients.age_group,
      users.firstname AS user_firstname, users.lastname AS user_lastname, procedures.procedure_name, 
      locations.location_name, physicians.firstname, physicians.lastname, visits.visit_date 
      FROM visits 
      JOIN patients ON visits.patient_mrn = patients.mrn
      JOIN physicians ON visits.physician_id = physicians.id 
      JOIN users ON visits.user_id = users.id 
      JOIN locations ON visits.location_id = locations.id
      JOIN procedures ON visits.procedure_id = procedures.id`
    );
    if (!result) throw new ExpressError('No movies found', 400);
    return result.rows;
  }

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
