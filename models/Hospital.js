// Import dependencies...
const db = require('../db');
const ExpressError = require('../helpers/expressError');

// create procedure class and related functions
class Hospital {
  // ##### GET ##### //
  // FIND ALL PROCEDURES
  static async getProcedures() {
    const result = await db.query(
      `SELECT *
      FROM procedures
      ORDER BY procedure_name ASC`
    );

    return result.rows;
  }
  // FIND ALL TEST CODES
  static async getTestCodes() {
    const result = await db.query(
      `SELECT *
      FROM test_codes
      ORDER BY cpt ASC`
    );

    return result.rows;
  }
  // FIND ALL LOCATIONS
  static async getLocations() {
    const result = await db.query(
      `SELECT *
      FROM locations
      ORDER BY location_name ASC`
    );

    return result.rows;
  }
  // FIND ALL DEPARTMENTS
  static async getDepartments() {
    const result = await db.query(
      `SELECT *
      FROM departments
      ORDER BY department_name ASC`
    );

    return result.rows;
  }

  // ##### ADD ##### //
  // ADD A PROCEDURE
  static async addProcedure(data) {
    const duplicateCheck = await db.query(
      `SELECT *
      FROM procedures
      WHERE procedure_name = $1`,
      [ data.procedure_name ]
    );

    if (duplicateCheck.rows[0]) {
      const err = new ExpressError(`Procedure: '${data.procedure_name}' already exists`);
      err.status = 409;
      throw err;
    }

    const result = await db.query(
      `INSERT INTO procedures
      (procedure_name)
      VALUES ($1)
    	RETURNING *`,
      [ data.procedure_name ]
    );

    return result.rows[0];
  }

  // ADD A TEST CODE
  static async addTestCode(data) {
    const duplicateCheck = await db.query(
      `SELECT *
      FROM test_codes
      WHERE cpt = $1`,
      [ data.cpt ]
    );

    if (duplicateCheck.rows[0]) {
      const err = new ExpressError(`CPT CODE: '${data.cpt}' already exists`);
      err.status = 409;
      throw err;
    }

    const result = await db.query(
      `INSERT INTO test_codes
      (cpt, description)
      VALUES ($1, $2)
    	RETURNING *`,
      [ data.cpt, data.description ]
    );
    return result.rows[0];
  }

  // ADD A LOCATION
  static async addLocation(data) {
    const duplicateCheck = await db.query(
      `SELECT *
      FROM locations
      WHERE location_name = $1`,
      [ data.location_name ]
    );

    if (duplicateCheck.rows[0]) {
      const err = new ExpressError(`Location: '${data.location_name}' already exists`);
      err.status = 409;
      throw err;
    }

    const result = await db.query(
      `INSERT INTO locations
      (location_name)
      VALUES ($1)
    	RETURNING *`,
      [ data.location_name ]
    );
    return result.rows[0];
  }

  // ADD A DEPARTMENT
  static async addDepartment(data) {
    const duplicateCheck = await db.query(
      `SELECT *
      FROM departments
      WHERE department_name = $1`,
      [ data.department_name ]
    );

    if (duplicateCheck.rows[0]) {
      const err = new ExpressError(`Department: '${data.department_name}' already exists`);
      err.status = 409;
      throw err;
    }

    const result = await db.query(
      `INSERT INTO departments
      (department_name)
      VALUES ($1)
    	RETURNING *`,
      [ data.department_name ]
    );

    return result.rows[0];
  }

  // ##### DELETE ##### //
  // DELETE A PROCEDURE (ADMIN PRIVELAGE)
  static async deleteProcedure(id) {
    const result = await db.query(
      `DELETE FROM procedures
      WHERE id = $1
      RETURNING procedure_name`,
      [ id ]
    );

    if (result.rows.length === 0) {
      const notFound = new ExpressError(`Procedure does not exist`);
      notFound.status = 404;
      throw notFound;
    }
  }

  // DELETE A TEST CODE (ADMIN PRIVELAGE)
  static async deleteTestCode(cpt) {
    const result = await db.query(
      `DELETE FROM test_codes
      WHERE cpt = $1`,
      [ cpt ]
    );

    if (result.rows.length === 0) {
      const notFound = new ExpressError(`Test Code does not exist`);
      notFound.status = 404;
      throw notFound;
    }
  }

  // DELETE A LOCATION (ADMIN PRIVELAGE)
  static async deleteLocation(id) {
    const result = await db.query(
      `DELETE FROM locations
      WHERE id = $1
      RETURNING location_name`,
      [ id ]
    );

    if (result.rows.length === 0) {
      const notFound = new ExpressError(`Location does not exist`);
      notFound.status = 404;
      throw notFound;
    }
  }
  // DELETE A DEPARTMENT (ADMIN PRIVELAGE)
  static async deleteDepartment(id) {
    const result = await db.query(
      `DELETE FROM departments
      WHERE id = $1
      RETURNING department_name`,
      [ id ]
    );

    if (result.rows.length === 0) {
      const notFound = new ExpressError(`Department does not exist`);
      notFound.status = 404;
      throw notFound;
    }

    return {message: "Department has been deleted!"}
  }
}

module.exports = Hospital;
