// User routes
const express = require('express');
const router = new express.Router();

const User = require('../models/User');
const getToken = require('../helpers/getToken');
const { validate } = require('jsonschema');
const { isAuthenticated, ensureCorrectUser, ensureIsAdmin } = require('../middleware/auth');
const { newUserSchema, updateUserSchema } = require('../schemas');

// GET ALL USERS
router.get('/', isAuthenticated, async (req, res, next) => {
	try {
		const users = await User.findAll();
		return res.json({ users });
	} catch (err) {
		return next(err);
	}
});

// GET SINGLE USER
router.get('/:id', ensureCorrectUser, ensureIsAdmin, async (req, res, next) => {
	try {
		const user = await User.findOne(req.params.id);
		return res.json({ user });
	} catch (err) {
		return next(err);
	}
});

// POST A NEW USER
router.post('/', async (req, res, next) => {
	try {
		delete req.body._token;
		// Validate schema from json schema
		const validation = validate(req.body, newUserSchema);
		if (!validation.valid) {
			return next({
				status: 400,
				message: validation.errors.map((e) => e.stack)
			});
		}

		const newUser = await User.register(req.body);
		const token = getToken(newUser);
		return res.status(201).json({
			token,
			id: newUser.id,
			firstname: newUser.firstname,
			lastname: newUser.lastname,
			is_admin: newUser.is_admin
		});
	} catch (e) {
		return next(e);
	}
});

// UPDATE A USER
router.patch('/:id', ensureIsAdmin, async (req, res, next) => {
	try {
		if ('id' in req.body) {
			return next({ status: 400, message: 'Changing user ID is not allowed' });
		}

		await User.authenticate({
			id: req.params.id,
			password: req.body.password
		});

		delete req.body.password;
		const validation = validate(req.body, updateUserSchema);
		if (!validation.valid) {
			return next({
				status: 400,
				message: validation.errors.map((e) => e.stack)
			});
		}

		const user = await User.update(req.params.id, req.body);
		return res.json({ user });
	} catch (err) {
		return next(err);
	}
});

// DELETE A USER
router.delete('/:id', ensureIsAdmin, async (req, res, next) => {
	try {
		await User.remove(req.params.id);
		return res.json({ message: `User: ${req.params.id} has been deleted` });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
