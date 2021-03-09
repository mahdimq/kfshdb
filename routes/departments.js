/** Routes for departments. */

const express = require('express');
const router = new express.Router();

const Department = require('../models/Department');
const { ensureLoggedIn, isAuthenticated } = require('../middleware/auth');

// GET ALL PHYSICIANS /departments/
router.get('/', async (req, res, next) => {
	try {
		const departments = await Department.findAll();
		return res.json({ departments });
	} catch (err) {
		return next(err);
	}
});

/** GET /[id] => {department: department} */
// GET A SINGLE DEPARTMENT BY ID /departments/:id
router.get('/:id', async (req, res, next) => {
	try {
		const department = await Department.findOne(req.params.id);
		return res.json({ department });
	} catch (err) {
		return next(err);
	}
});

/** POST / {patientdata}  => {token: token} */
// REGISTER A department /department/

// ADD A NEW DEPARTMENT
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

		const newPhysician = await Department.add(req.body);
		return res.status(201).json({
			name: newPhysician.full_name
		});
	} catch (e) {
		return next(e);
	}
});

/** DELETE /[handle]  =>  {message: "Department deleted"}  */
// DELETE A SINGLE DEPARTMENT departments/:name
router.delete('/:id', isAuthenticated, ensureLoggedIn, async (req, res, next) => {
	try {
		await Department.remove(req.params.id);
		return res.json({ message: `Department: ${req.params.id} has been deleted` });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
