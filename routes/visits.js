/** Routes for visits. */

const express = require('express');
const router = new express.Router();

const Visit = require('../models/Visit');
const { isAuthenticated, ensureIsAdmin } = require('../middleware/auth');

// GET ALL visits /visits/
router.get('/:mrn', isAuthenticated, async (req, res, next) => {
	try {
		const visits = await Visit.getAll(req.params.mrn);
		return res.json( visits );
	} catch (err) {
		return next(err);
	}
});

// GET A SINGLE VISIT BY MRN /visits/:id
// router.get('/:mrn', isAuthenticated, async (req, res, next) => {
// 	try {
// 		const physician = await Visit.findOne(req.params.id);
// 		return res.json({ visit });
// 	} catch (err) {
// 		return next(err);
// 	}
// });

// /** POST / {patientdata}  => {token: token} */
// // REGISTER A physician /physician/

// // ADD A NEW VISIT
// router.post('/', ensureIsAdmin, async (req, res, next) => {
// 	try {
// 		delete req.body._token;
// 		// Validate schema from json schema
// 		const validation = validate(req.body, visitschema);
// 		if (!validation.valid) {
// 			return next({
// 				status: 400,
// 				message: validation.errors.map((e) => e.stack)
// 			});
// 		}

// 		const newPhysician = await Physician.add(req.body);
// 		return res.status(201).json({
// 			firstname: newPhysician.firstname,
// 			lastname: newPhysician.lastname,
// 			department_id: newPhysician.department_id
// 		});
// 	} catch (e) {
// 		return next(e);
// 	}
// });

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
