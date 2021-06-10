/** Routes for tests. */

const express = require('express');
const router = new express.Router();

const TestCodes = require('../models/TestCodes');
const {  isAuthenticated, ensureIsAdmin } = require('../middleware/auth');

// GET ALL TESTS /tests/
router.get('/', isAuthenticated, async (req, res, next) => {
	try {
		const testCodes = await TestCodes.findAll();
		return res.json({ testCodes });
	} catch (err) {
		return next(err);
	}
});

// GET A SINGLE TEST BY ID /tests/:id
router.get('/:id', async (req, res, next) => {
	try {
		const testCode = await TestCodes.findOne(req.params.id);
		return res.json( testCode );
	} catch (err) {
		return next(err);
	}
});

// ADD A NEW TEST
router.post('/', ensureIsAdmin, async (req, res, next) => {
	try {
		const newTest = await TestCodes.add(req.body);
		return res.status(201).json({
			cpt: newTest.cpt,
			description: newTest.description
		});
	} catch (e) {
		return next(e);
	}
});

// DELETE A SINGLE TEST tests/:id
router.delete('/:id', ensureIsAdmin, async (req, res, next) => {
	try {
		await TestCodes.remove(req.params.id);
		return res.json({ message: `TestCodes: ${req.params.id} has been deleted` });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
