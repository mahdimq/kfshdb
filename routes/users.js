// User routes
const express = require('express');
const router = new express.Router();

const User = require('../models/user');
const getToken = require('../helpers/getToken');

router.get('/', async (req, res, next) => {
	try {
		const users = await User.findAll();
		return res.json({ users });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
