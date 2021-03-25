/** Routes for tests. */

const express = require('express');
const router = new express.Router();

const Test = require('../models/Test');
const {  isAuthenticated, ensureIsAdmin } = require('../middleware/auth');

// GET ALL TESTS /tests/
router.get('/', isAuthenticated, async (req, res, next) => {
	try {
		const tests = await Test.findAll();
		return res.json({ tests });
	} catch (err) {
		return next(err);
	}
});

// GET A SINGLE TEST BY ID /tests/:id
router.get('/:id', async (req, res, next) => {
	try {
		const test = await Test.findOne(req.params.id);
		return res.json({ test });
	} catch (err) {
		return next(err);
	}
});

// ADD A NEW TEST
router.post('/', ensureIsAdmin, async (req, res, next) => {
	try {
		const newTest = await Test.add(req.body);
		return res.status(201).json({
			cpt: newTest.cpt,
			description: newTest.description,
			quantity: newTest.quantity
		});
	} catch (e) {
		return next(e);
	}
});

// DELETE A SINGLE TEST tests/:id
router.delete('/:id', ensureIsAdmin, async (req, res, next) => {
	try {
		await Test.remove(req.params.id);
		return res.json({ message: `Test: ${req.params.id} has been deleted` });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
