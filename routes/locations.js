/** Routes for locations. */

const express = require('express');
const router = new express.Router();

const Location = require('../models/Location');
const { ensureLoggedIn, isAuthenticated } = require('../middleware/auth');

// GET ALL PHYSICIANS /locations/
router.get('/', async (req, res, next) => {
	try {
		const locations = await Location.findAll();
		return res.json({ locations });
	} catch (err) {
		return next(err);
	}
});

/** GET /[id] => {location: location} */
// GET A SINGLE LOCATION BY ID /locations/:id
router.get('/:id', async (req, res, next) => {
	try {
		const location = await Location.findOne(req.params.id);
		return res.json({ location });
	} catch (err) {
		return next(err);
	}
});

/** POST / {patientdata}  => {token: token} */
// REGISTER A location /location/

// ADD A NEW LOCATION
router.post('/', ensureLoggedIn, isAuthenticated, async (req, res, next) => {
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

		const newPhysician = await Location.add(req.body);
		return res.status(201).json({
			name: newPhysician.full_name
		});
	} catch (e) {
		return next(e);
	}
});

/** DELETE /[handle]  =>  {message: "Location deleted"}  */
// DELETE A SINGLE LOCATION locations/:name
router.delete('/:id', isAuthenticated, ensureLoggedIn, async (req, res, next) => {
	try {
		await Location.remove(req.params.id);
		return res.json({ message: `Location: ${req.params.id} has been deleted` });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
