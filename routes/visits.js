/** Routes for visits. */

const express = require('express');
const router = new express.Router();
const Visit = require('../models/Visit');
const { validate } = require('jsonschema');
const { visitSchema } = require('../schemas');
const { isAuthenticated, ensureIsAdmin } = require('../middleware/auth');

// GET ALL visits /visits/
router.get('/', isAuthenticated, async (req, res, next) => {
  try {
    const visits = await Visit.getAll();
    return res.json(visits);
  } catch (err) {
    return next(err);
  }
});

// GET A ALL PATIENT VISITS BY PATIENTS' MRN /visits/:mrn
router.get('/:log', isAuthenticated, async (req, res, next) => {
  try {
    const visit = await Visit.getVisits(req.params.log);
    return res.json(visit);
  } catch (err) {
    return next(err);
  }
});

// ADD A NEW VISIT
router.post('/:mrn', isAuthenticated, async (req, res, next) => {
  try {
    delete req.body._token;
    // Validate schema from json schema
    const validation = validate(req.body, visitSchema);
    if (!validation.valid) {
    	return next({
    		status: 400,
    		message: validation.errors.map((e) => e.stack)
    	});
    }
    const newVisit = await Visit.addVisit(req.body, req.params.mrn);
    return res.status(201).json({
      log_num: newVisit.log_num,
      ped_log_num: newVisit.ped_log_num,
      patient_mrn: req.params.mrn,
      physician_id: newVisit.physician_id,
      user_id: newVisit.user_id,
      procedure_id: newVisit.procedure_id,
      location_id: newVisit.location_id,
      visit_date: newVisit.visit_date
    });
  } catch (e) {
    return next(e);
  }
});

// /** DELETE /[handle]  =>  {message: "Physician deleted"}  */
// // DELETE A SINGLE VISIT visits/:name
// router.delete('/:id', ensureIsAdmin, async (req, res, next) => {
// 	try {
// 		await Physician.remove(req.params.id);
// 		return res.json({ message: `Physician: ${req.params.id} has been deleted` });
// 	} catch (err) {
// 		return next(err);
// 	}
// });

module.exports = router;
