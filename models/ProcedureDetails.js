// // Import dependencies...
// const db = require('../db');
// const ExpressError = require('../helpers/expressError');

// // create visit_test class and related functions
// class VisitTest {
// 	// FIND ALL VISIT-TESTS

// 	static async findAll() {
// 		const result = await db.query(
// 			`SELECT *
//       FROM visits_tests AS vt
//       JOIN visits AS v ON vt.visit_id = v.log_num
//       JOIN tests AS t ON vt.test_id = t.id
//       JOIN test_codes AS tc ON t.cpt_id = tc.cpt`
// 		);

// 		return result.rows;
// 	}

// 	// FIND ONE VISIT TEST

// 	static async findOne(id) {
// 		const result = await db.query(
// 			`SELECT *
//       FROM procedures
//       WHERE id = $1`,
// 			[id]
// 		);

// 		return result.rows[0];
// 	}

// 	// ADD A NEW VISIT TEST

// 	static async add(data) {
// 		const duplicateCheck = await db.query(
// 			`SELECT *
//       FROM procedures
//       WHERE procedure_name = $1`,
// 			[data.name]
// 		);

// 		if (duplicateCheck.rows[0]) {
// 			const err = new ExpressError(`Location: '${data.name}' already exists`);
// 			err.status = 409;
// 			throw err;
// 		}

// 		const result = await db.query(
// 			`INSERT INTO procedures
//       (procedure_name)
//       VALUES ($1)
//     	RETURNING *`,
// 			[data.name]
// 		);

// 		return result.rows[0];
// 	}

// 	// DELETE A VISIT TEST (ADMIN PRIVELAGE)

// 	static async remove(id) {
// 		const result = await db.query(
// 			`DELETE FROM procedures
//       WHERE id = $1
//       RETURNING procedure_name`,
// 			[id]
// 		);

// 		if (result.rows.length === 0) {
// 			const notFound = new ExpressError(`VisitTest does not exist`);
// 			notFound.status = 404;
// 			throw notFound;
// 		}
// 	}
// }

// module.exports = VisitTest;
