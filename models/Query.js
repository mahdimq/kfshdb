const db = require("../db");
const ExpressError = require('../helpers/expressError');

/** Related functions for Report Queries. */

class Query {
// WHERE patients.age_group = 'adult'
// WHERE patients.age_group = 'pediatric' AND v.visit_date >= '04-01-2021'
  static async monthly(data) {
    // let baseQuery = `SELECT procedures.procedure_name, COUNT(*) 
    // FROM procedures 
    // JOIN visits ON procedures.id = visits.procedure_id 
    // JOIN patients ON visits.patient_mrn = patients.mrn`
    // // [data.age_group, data.start_date, data.end_date];
    // let whereExpressions = [];
    // let queryValues = [];

    // if (!data.age_group) {
    //   throw new Error("Please select and Age Group");
    // }

    // // For each possible search term, add to whereExpressions and
    // // queryValues so we can generate the right SQL

    // if (data.age_group) {
    //   queryValues.push(data.age_group);
    //   whereExpressions.push(`patients.age_group = '${data.age_group}'`);
    // }

    // if (data.start_date) {
    //   queryValues.push(data.start_date);
    //   whereExpressions.push(`visits.visit_date >= '${data.start_date}'`);
    // }

    // if (data.end_date) {
    //   queryValues.push(data.end_date);
    //   whereExpressions.push(`visits.visit_date <= '${data.end_date}'`);
    // }

    // if (whereExpressions.length > 0) {
    //   baseQuery += " WHERE";
    // }

    // // Finalize query and return results

    // const finalQuery = `${baseQuery} ${whereExpressions.join(" AND ")} GROUP BY procedures.procedure_name`;
    // console.log("#########################")
    // console.log("#########################")
    // console.log("FINAL QUERY: ", finalQuery)
    // console.log("#########################")
    // console.log("#########################")

    // const report = await db.query(finalQuery, queryValues);
    const report = await db.query(
      `SELECT p.procedure_name AS procedure, COUNT(*), patients.age_group 
      FROM procedures AS p 
      JOIN visits ON p.id = visits.procedure_id 
      JOIN patients ON visits.patient_mrn = patients.mrn 
      WHERE patients.age_group = $1
      AND visits.visit_date >= $2 
      AND visits.visit_date <= $3 
      GROUP BY p.procedure_name, patients.age_group`,
      [data.age_group, data.start_date, data.end_date]
    )
    return report.rows;
  }

  // GET DEPARTMENT DATA BY DATE
  static async byDepartment(data) {
    const report = await db.query(
      `SELECT p.procedure_name AS procedure, COUNT(p.id)
      FROM visits AS v
      JOIN procedures AS p ON v.procedure_id = p.id
      WHERE v.visit_date >= $1
      AND v.visit_date <= $2
      GROUP BY procedure
      ORDER BY procedure`,
      [data.start_date, data.end_date]
    )
    return report.rows;
  }


  // GET DEPARTMENT DATA BY DATE AND USER
  static async byUser({start_date, end_date, user_id}) {
    const report = await db.query(
      `SELECT p.procedure_name AS procedure, CONCAT(u.firstname, ' ', u.lastname) AS technologist, COUNT(p.id) 
      FROM visits AS v
      JOIN procedures AS p ON v.procedure_id = p.id
      JOIN users AS u ON v.user_id = u.id
      WHERE v.visit_date >= $1
      AND v.visit_date <= $2
      AND u.id = $3
      GROUP BY u.firstname, u.lastname, procedure
      ORDER BY procedure`,
      [start_date, end_date, user_id]
    )
    return report.rows;
  }

  // GET PROCEDURE DATA BY PHYSICIAN
  static async byPhysician(data) {
    const report = await db.query(
      `SELECT p.procedure_name AS procedure, d.department_name AS department, CONCAT(ph.firstname, ' ', ph.lastname) AS physician, COUNT(p.id)
      FROM visits AS v 
      JOIN physicians AS ph ON v.physician_id = ph.id
      JOIN departments AS d ON ph.department_id = d.id
      JOIN procedures AS p ON v.procedure_id = p.id
      WHERE ph.id = $1
      AND v.visit_date >= $2
      AND v.visit_date <= $3
      GROUP BY physician, department, procedure
      ORDER BY department`,
      [data.physician_id, data.start_date, data.end_date]
    )
    return report.rows;
  }

  // GET PROCEDURE DATA BY PHYSICIAN DEPARTMENT
  static async byPhysicianDept(data) {
    const report = await db.query(
      `SELECT p.procedure_name AS procedure, d.department_name AS department, CONCAT(ph.firstname, ' ', ph.lastname) AS physician, COUNT(p.id)
      FROM visits AS v 
      JOIN physicians AS ph ON v.physician_id = ph.id
      JOIN departments AS d ON ph.department_id = d.id
      JOIN procedures AS p ON v.procedure_id = p.id
      AND v.visit_date >= $1
      AND v.visit_date <= $2
      GROUP BY physician, department, procedure
      ORDER BY department`,
      [data.start_date, data.end_date]
    )
    return report.rows;
  }
}


module.exports = Query;


      // SELECT p.procedure_name AS procedure, ph.firstname, ph.lastname, d.department_name AS department, COUNT(p.id) 
      // FROM visits AS v
      // JOIN procedures AS p ON v.procedure_id = p.id
      // JOIN physicians AS ph ON v.user_id = ph.id
      // JOIN departments AS d ON ph.department_id = d.id
      // WHERE v.visit_date >= '03-01-2021'
      // AND v.visit_date <= '05-31-2021'
      // AND ph.id = 3
      // GROUP BY ph.firstname, ph.lastname, department, procedure
      // ORDER BY department

      // SELECT p.procedure_name AS procedure, d.department_name AS department, ph.firstname, ph.lastname, COUNT(p.id)
      // FROM visits AS v 
      // JOIN physicians AS ph ON v.physician_id = ph.id
      // JOIN departments AS d ON ph.department_id = d.id
      // JOIN procedures AS p ON v.procedure_id = p.id
      // WHERE ph.id = 1
      // AND v.visit_date >= '05-01-2021'
      // AND v.visit_date <= '05-31-2021'
      // GROUP BY department, ph.firstname, ph.lastname, procedure
      // ORDER BY department