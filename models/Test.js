// Import dependencies...
const db = require('../db');
const ExpressError = require('../helpers/expressError');

// create patient class and related functions
class Test {
  // FIND TEST BY ID
  static async getById(id) {
    const result = await db.query(`SELECT * FROM visits_tests WHERE id= $1`, [id]);
    // if patients not found, throw error
    if (!result) throw new ExpressError('Test not found in DB', 404);

    return result.rows[0];
  }

  static async addTest() {
    const result = await db.query(`SELECT * FROM tests WHERE id= $1`, [id]);
    // if patients not found, throw error
    if (!result) throw new ExpressError('Test not found in DB', 404);

    return result.rows[0];
  }
}

module.exports = Test
