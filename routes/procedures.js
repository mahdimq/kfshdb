/** Routes for procedures. */

const express = require('express');
const router = new express.Router();

const Procedure = require('../models/Procedure');
const {  isAuthenticated, ensureIsAdmin } = require('../middleware/auth');

// GET ALL PROCEDURES /procedures/
router.get('/', isAuthenticated, async (req, res, next) => {
	try {
		const procedures = await Procedure.findAll();
		return res.json( {procedures} );
	} catch (err) {
		return next(err);
	}
});

/** GET /[id] => {procedure: procedure} */
// GET A SINGLE PROCEDURE BY ID /procedures/:id
router.get('/:id', isAuthenticated, async (req, res, next) => {
	try {
		const procedure = await Procedure.findOne(req.params.id);
		return res.json({ procedure });
	} catch (err) {
		return next(err);
	}
});

// ADD A NEW PROCEDURE
router.post('/', ensureIsAdmin, async (req, res, next) => {
	try {
		const newProcedure = await Procedure.add(req.body);
		return res.status(201).json({
			name: newProcedure.name
		});
	} catch (e) {
		return next(e);
	}
});

/** DELETE /[handle]  =>  {message: "Procedure deleted"}  */
// DELETE A SINGLE PROCEDURE procedures/:name
router.delete('/:id', ensureIsAdmin, async (req, res, next) => {
	try {
		await Procedure.remove(req.params.id);
		return res.json({ message: `Procedure: ${req.params.id} has been deleted` });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
