/** Routes for authentication. */

const User = require('../models/user');
const express = require('express');
const router = new express.Router();
const getToken = require('../helpers/getToken');

router.post('/login', async function (req, res, next) {
	try {
		const user = await User.authenticate(req.body);
		const token = getToken(user);
		return res.json({ token, id: user.id });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
