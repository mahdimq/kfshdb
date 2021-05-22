/** Routes for visittest. */

const express = require('express');
const router = new express.Router();

const VisitTest = require('../models/VisitTest');
const {  isAuthenticated, ensureIsAdmin } = require('../middleware/auth');

// GET ALL PROCEDURES /visittest/
router.get('/', isAuthenticated, async (req, res, next) => {
	try {
		const visittest = await VisitTest.findAll();
		return res.json( visittest );
	} catch (err) {
		return next(err);
	}
});

/** GET /[id] => {visittest: visittest} */
// GET A SINGLE PROCEDURE BY ID /visittest/:id
router.get('/:log', isAuthenticated, async (req, res, next) => {
	try {
		const visittest = await VisitTest.findOne(req.params.log);
		return res.json( visittest );
	} catch (err) {
		return next(err);
	}
});

// // ADD A NEW PROCEDURE
// router.post('/', ensureIsAdmin, async (req, res, next) => {
// 	try {
// 		const newProcedure = await VisitTest.add(req.body);
// 		return res.status(201).json({
// 			name: newProcedure.name
// 		});
// 	} catch (e) {
// 		return next(e);
// 	}
// });

/** DELETE /[handle]  =>  {message: "VisitTest deleted"}  */
// DELETE A SINGLE PROCEDURE visittest/:name
router.delete('/:id', ensureIsAdmin, async (req, res, next) => {
	try {
		await VisitTest.remove(req.params.id);
		return res.json({ message: `VisitTest: ${req.params.id} has been deleted` });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
