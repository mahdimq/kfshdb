/** Routes for visittest. */

const express = require('express');
const router = new express.Router();

const VisitDetail = require('../models/VisitDetail');
const {  isAuthenticated, ensureIsAdmin } = require('../middleware/auth');

// GET ALL PROCEDURES /visittest/
router.get('/', isAuthenticated, async (req, res, next) => {
	try {
		const visittest = await VisitDetail.findAll();
		return res.json({ visittest} );
	} catch (err) {
		return next(err);
	}
});

/** GET /[id] => {visittest: visittest} */
// GET A SINGLE PROCEDURE BY ID /visittest/:id
router.get('/:log', isAuthenticated, async (req, res, next) => {
	try {
		const visittest = await VisitDetail.findOne(req.params.log);
		return res.json( visittest );
	} catch (err) {
		return next(err);
	}
});

// ADD A NEW VISIT DETAIL
router.post('/:log', isAuthenticated, async (req, res, next) => {
	try {
		const visitDetail = await VisitDetail.add(req.body, req.params.log);
		return res.status(201).json({
			visit_id: req.params.log,
      test_id: visitDetail.test_id
		});
	} catch (e) {
		return next(e);
	}
});

/** DELETE /[handle]  =>  {message: "VisitDetail deleted"}  */
// DELETE A SINGLE PROCEDURE visittest/:name
router.delete('/:id', ensureIsAdmin, async (req, res, next) => {
	try {
		await VisitDetail.remove(req.params.id);
		return res.json({ message: `VisitDetail: ${req.params.id} has been deleted` });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
