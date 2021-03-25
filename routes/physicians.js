/** Routes for physicians. */

const express = require('express');
const router = new express.Router();

const Physician = require('../models/Physician');
const { validate } = require('jsonschema');
const { physicianSchema } = require('../schemas');
const { isAuthenticated, ensureIsAdmin } = require('../middleware/auth');

// GET ALL PHYSICIANS /physicians/
router.get('/', isAuthenticated, async (req, res, next) => {
	try {
		const physicians = await Physician.findAll();
		return res.json({ physicians });
	} catch (err) {
		return next(err);
	}
});

/** GET /[id] => {physician: physician} */
// GET A SINGLE PHYSICIAN BY NAME /physicians/:id
router.get('/:id', isAuthenticated, async (req, res, next) => {
	try {
		const physician = await Physician.findOne(req.params.id);
		return res.json({ physician });
	} catch (err) {
		return next(err);
	}
});

/** POST / {patientdata}  => {token: token} */
// REGISTER A physician /physician/

// ADD A NEW PHYSICIAN
router.post('/', ensureIsAdmin, async (req, res, next) => {
	try {
		delete req.body._token;
		// Validate schema from json schema
		const validation = validate(req.body, physicianSchema);
		if (!validation.valid) {
			return next({
				status: 400,
				message: validation.errors.map((e) => e.stack)
			});
		}

		const newPhysician = await Physician.add(req.body);
		return res.status(201).json({
			firstname: newPhysician.firstname,
			lastname: newPhysician.lastname,
			department_id: newPhysician.department_id
		});
	} catch (e) {
		return next(e);
	}
});

/** DELETE /[handle]  =>  {message: "Physician deleted"}  */
// DELETE A SINGLE PHYSICIAN physicians/:name
router.delete('/:id', ensureIsAdmin, async (req, res, next) => {
	try {
		await Physician.remove(req.params.id);
		return res.json({ message: `Physician: ${req.params.id} has been deleted` });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
