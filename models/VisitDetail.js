// Import dependencies...
const db = require('../db');
const ExpressError = require('../helpers/expressError');

// create visit_test class and related functions
class VisitDetail {
	// FIND ALL VISIT-TESTS

	static async findAll(log) {
		// const result = await db.query(
		// 	`SELECT cpt, description, log_num, ped_log_num, quantity, 
    //   u.firstname, u.lastname, ph.firstname, ph.lastname, 
    //   l.location_name, p.procedure_name, v.visit_date
    //   FROM visits_tests AS vt
    //   INNER JOIN visits AS v ON vt.visit_id = v.log_num
    //   JOIN tests AS t ON vt.test_id = t.id
    //   JOIN test_codes AS tc ON t.cpt_id = tc.cpt
    //   JOIN procedures AS p ON v.procedure_id = p.id
    //   JOIN locations AS l ON v.location_id = l.id
    //   JOIN physicians AS ph ON v.physician_id = ph.id
    //   JOIN users AS u ON v.user_id = u.id
    //   WHERE v.patient_mrn = $1`,
    //   [log]
		// );

    const result = await db.query(
      `SELECT * FROM visits_tests`
    )

		return result.rows;
	}

	// FIND ONE VISIT TEST

	// static async findOne(log) {
	// 	const result = await db.query(
	// 		`SELECT cpt, description, log_num, ped_log_num, quantity, 
  //     u.firstname, u.lastname, ph.firstname, ph.lastname, 
  //     l.location_name, p.procedure_name, v.visit_date
  //     FROM visits_tests AS vt
  //     JOIN visits AS v ON vt.visit_id = v.log_num
  //     JOIN tests AS t ON vt.test_id = t.id
  //     JOIN test_codes AS tc ON t.cpt_id = tc.cpt
  //     JOIN procedures AS p ON v.procedure_id = p.id
  //     JOIN locations AS l ON v.location_id = l.id
  //     JOIN physicians AS ph ON v.physician_id = ph.id
  //     JOIN users AS u ON v.user_id = u.id
  //     WHERE vt.visit_id = $1`,
	// 		[log]
	// 	);

	// 	return result.rows;
	// }

	// ADD A NEW VISIT TEST

	static async add(data) {
		const duplicateCheck = await db.query(
			`SELECT *
      FROM visits_tests
      WHERE visit_id = $1 AND test_id = $2`,
			[data.visit_id, data.test_id]
		);

		if (duplicateCheck.rows[0]) {
			const err = new ExpressError(`Tests with log num: '${data.visit_id}' already exists`);
			err.status = 409;
			throw err;
		}

		const result = await db.query(
			`INSERT INTO visits_tests
      (visit_id, test_id)
      VALUES ($1, $2)
    	RETURNING *`,
			[data.visit_id, data.test_id]
		);

		return result.rows[0];
	}

	// DELETE A VISIT TEST (ADMIN PRIVELAGE)

	static async remove(id) {
		const result = await db.query(
			`DELETE FROM procedures
      WHERE id = $1
      RETURNING procedure_name`,
			[id]
		);

		if (result.rows.length === 0) {
			const notFound = new ExpressError(`VisitDetail does not exist`);
			notFound.status = 404;
			throw notFound;
		}
	}
}

module.exports = VisitDetail;
