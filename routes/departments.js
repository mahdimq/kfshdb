/** Routes for departments. */

const express = require('express');
const router = new express.Router();

const Department = require('../models/Department');
const { ensureIsAdmin, isAuthenticated } = require('../middleware/auth');

// GET ALL PHYSICIANS /departments/
router.get('/', isAuthenticated, async (req, res, next) => {
	try {
		const departments = await Department.findAll();
		return res.json({ departments });
	} catch (err) {
		return next(err);
	}
});

/** GET /[id] => {department: department} */
// GET A SINGLE DEPARTMENT BY ID /departments/:id
router.get('/:id', isAuthenticated, async (req, res, next) => {
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
router.post('/', ensureIsAdmin, async (req, res, next) => {
	try{
		const newDept = await Department.add(req.body);
		return res.status(201).json({
			name: newDept.name
		});
	} catch (e) {
		return next(e);
	}
});

/** DELETE /[handle]  =>  {message: "Department deleted"}  */
// DELETE A SINGLE DEPARTMENT departments/:name
router.delete('/:id', ensureIsAdmin, async (req, res, next) => {
	try {
		await Department.remove(req.params.id);
		return res.json({ message: `Department: ${req.params.id} has been deleted` });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
