const db = require('../db');
const ExpressError = require('../helpers/expressError');

/** Related functions for visits. */

class Visit {
  // ADD DATA TO VISIT, AUTH REQUIRED
  static async addVisit(data) {
    // Check if visit already exists
    const duplicateCheck = await db.query(
      `SELECT log_num 
      FROM visits
      WHERE patient_mrn = $1 AND log_num = $2`,
      [ data.patient_mrn, data.log_num ]
    );

    if (duplicateCheck.rows[0]) {
      const err = new ExpressError(`Visit already completed`);
      err.status = 409;
      throw err;
    }

    // If no duplicates found, add current visit to list
    const result = await db.query(
      `INSERT INTO visits (log_num, ped_log_num, patient_mrn, physician_id, user_id, procedure_id, location_id, visit_date)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
			RETURNING *`,
      [
        data.log_num,
        data.ped_log_num,
        data.patient_mrn,
        data.physician_id,
        data.user_id,
        data.procedure_id,
        data.location_id,
        data.visit_date
      ]
    );
    if (!result.rows[0]) throw new ExpressError('Unable to add visit', 500);
    return result.rows[0];
  }


  // GET ALL VISITS
  static async getVisits(log) {
    const result = await db.query(
      `SELECT visits.log_num, visits.ped_log_num, patients.mrn, 
      patients.firstname, patients.middlename, patients.lastname,
      patients.dob, patients.gender, patients.nationality, patients.age_group,
      users.firstname AS user_firstname, users.lastname AS user_lastname, procedures.procedure_name, 
      locations.location_name, physicians.firstname AS p_firstname, physicians.lastname AS p_lastname, visits.visit_date 
      FROM visits 
      JOIN patients ON visits.patient_mrn = patients.mrn
      JOIN physicians ON visits.physician_id = physicians.id 
      JOIN users ON visits.user_id = users.id 
      JOIN locations ON visits.location_id = locations.id
      JOIN procedures ON visits.procedure_id = procedures.id
      WHERE visits.log_num = $1
      ORDER BY visits.log_num ASC`,
      [ log ]
    );
    const visit = result.rows[0];

    if (!visit) {
      const error = new ExpressError(`Visit does not exist`);
      error.status = 404; // 404 NOT FOUND
      throw error;
    }

    const visitDetails = await db.query(
      `SELECT cpt, description, log_num, ped_log_num, quantity
      FROM visits_tests AS vt
      JOIN visits AS v ON vt.visit_id = v.log_num
      JOIN tests AS t ON vt.test_id = t.id
      JOIN test_codes AS tc ON t.cpt_id = tc.cpt
      WHERE vt.visit_id = $1`,
			[log]
    )

    visit.visitDetails = visitDetails.rows

    return visit;
  }

  // Get list of all visits in the database
  // static async getAll() {
  //   const result = await db.query(
  //     `SELECT visits.log_num, visits.ped_log_num, visits.patient_mrn, 
  //     patients.firstname AS p_firstname, patients.middlename AS p_middlename, patients.lastname AS p_lastname,
  //     patients.dob, patients.gender, patients.nationality, patients.age_group,
  //     users.firstname AS user_firstname, users.lastname AS user_lastname, procedures.procedure_name, 
  //     locations.location_name, physicians.firstname, physicians.lastname, visits.visit_date 
  //     FROM visits 
  //     JOIN patients ON visits.patient_mrn = patients.mrn
  //     JOIN physicians ON visits.physician_id = physicians.id 
  //     JOIN users ON visits.user_id = users.id 
  //     JOIN locations ON visits.location_id = locations.id
  //     JOIN procedures ON visits.procedure_id = procedures.id
  //     WHERE 
  //     ORDER BY visits.log_num ASC`
  //   );

  //   if (!result) throw new ExpressError('No movies found', 400);

  //   const results = result.rows;
  //   return results;
  // }

  // Get list of all visits in the database
  static async getAll() {
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
      ORDER BY visits.log_num ASC`
    );

    if (!result) throw new ExpressError('No Visits found', 400);

    const results = result.rows;
    return results;
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
