/** Routes for physicians. */

const express = require('express');
const router = new express.Router();

const Physician = require('../models/Physician');
const { validate } = require('jsonschema');
const { physicianSchema } = require('../schemas');
const { ensureLoggedIn, isAuthenticated } = require('../middleware/auth');

// GET ALL PHYSICIANS /physicians/
router.get('/', async (req, res, next) => {
	try {
		const physicians = await Physician.findAll();
		return res.json({ physicians });
	} catch (err) {
		return next(err);
	}
});

/** GET /[id] => {physician: physician} */
// GET A SINGLE PHYSICIAN BY NAME /physicians/:id
router.get('/:id', async (req, res, next) => {
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
router.post('/', async (req, res, next) => {
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
			name: newPhysician.full_name
		});
	} catch (e) {
		return next(e);
	}
});

/** DELETE /[handle]  =>  {message: "Physician deleted"}  */
// DELETE A SINGLE PHYSICIAN physicians/:name
router.delete('/:id', isAuthenticated, async (req, res, next) => {
	try {
		await Physician.remove(req.params.id);
		return res.json({ message: `Physician: ${req.params.id} has been deleted` });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
