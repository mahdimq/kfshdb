// Import dependencies...
const db = require('../db');
const ExpressError = require('../helpers/expressError');

// create patient class and related functions
class Patient {
  // FIND ALL PATIENTS
  static async findAll() {
    const result = await db.query(`SELECT * FROM patients ORDER BY mrn`);
    // if patients not found, throw error
    if (!result) throw new ExpressError('No Patients found in DB', 404);

    return result.rows;
  }

  // ADD A NEW PATIENT

  static async register(
    mrn = null,
    firstname = null,
    middlename = null,
    lastname = null,
    dob = null,
    gender = null,
    age_group = null,
    nationality = null
  ) {
    // Check if patient already exists in the database
    const duplicateCheck = await db.query(`SELECT mrn FROM patients WHERE mrn = $1`, [mrn]);

    if (duplicateCheck.rows[0]) {
      const err = new ExpressError(`Patient with the MRN: '${mrn}' already exists`);
      err.status = 409;
      throw err;
    }

    const result = await db.query(
      `INSERT INTO patients
      (mrn, firstname, middlename, lastname, dob, gender, age_group, nationality)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    	RETURNING *`,
      [ mrn, firstname, middlename, lastname, dob, gender, age_group, nationality ]
    );

    return result.rows[0];
  }

  // RETURN PATIENT INFO FROM MRN

  static async findOne(mrn) {
    const patientRes = await db.query(
      `SELECT *
      FROM patients
      WHERE mrn = $1`,
      [ mrn ]
    );

    const patient = patientRes.rows[0];

    if (!patient) {
      const error = new ExpressError(`Patient with MRN: '${mrn}' does not exist`);
      error.status = 404; // 404 NOT FOUND
      throw error;
    }

    const visits = await db.query(
      `SELECT visits.log_num, visits.ped_log_num, users.firstname AS user_firstname, users.lastname AS user_lastname, procedures.procedure_name, 
      locations.location_name, physicians.firstname, physicians.lastname, visits.visit_date 
      FROM visits 
      JOIN physicians ON visits.physician_id = physicians.id 
      JOIN users ON visits.user_id = users.id 
      JOIN locations ON visits.location_id = locations.id
      JOIN procedures ON visits.procedure_id = procedures.id
      WHERE visits.patient_mrn = $1
      ORDER BY visits.log_num ASC`,
      [ mrn ]
    );
    patient.visits = visits.rows;

    // for (let v of Object.values(visits)) {
    //   const description = await db.query(
    //     `SELECT cpt, description, log_num, ped_log_num, quantity
    //     FROM visits_tests AS vt
    //     JOIN visits AS v ON vt.visit_id = v.log_num
    //     JOIN tests AS t ON vt.test_id = t.id
    //     JOIN test_codes AS tc ON t.cpt_id = tc.cpt
    //     WHERE v.patient_mrn = $1`,
    //     [mrn]
    //   )
    //   v.visitDetails = description.rows;
    // }

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
      [ mrn ]
    );

    if (result.rows.length === 0) {
      const notFound = new ExpressError(`Patient with ID: '${mrn}' does not exist`);
      notFound.status = 404;
      throw notFound;
    }
  }
}

module.exports = Patient;
