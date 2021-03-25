const jwt = require('jsonwebtoken');
const { SECRET } = require('../config');
const ExpressError = require('../helpers/expressError');

// ENSURE AUTHENTICATED BY VERIFYING TOKEN
const isAuthenticated = (req, res, next) => {
	try {
		const tokenStr = req.body._token || req.query._token;
		const payload = jwt.verify(tokenStr, SECRET);

		if (!payload) return new ExpressError('Invalid Token', 401);

		// req.id = payload.id;
		// req.firstname = payload.firstname;
		// req.lastname = payload.lastname;
		req.id = payload;

		return next();
	} catch (err) {
		return next(new ExpressError('You must authenticate first.', 401));
	}
};

/** Middleware to use when they must provide a valid token & be user matching
 *  username provided as route param.
 *
 * Add username onto req as a convenience for view functions.
 *
 * If not, raises Unauthorized.
 *
 */

//  ENSURE CORRECT USER BY LOGGING IN
const ensureCorrectUser = (req, res, next) => {
	try {
		const tokenStr = req.body._token || req.query._token;
		const payload = jwt.verify(tokenStr, SECRET);
		if (!payload) return new ExpressError('Invalid Token', 401);

		req.id = payload.id;
		req.is_admin = payload.is_admin;

		if (payload.is_admin || payload.id === +req.params.id) {
			return next();
		}
		// throw an error, so we catch it in our catch, below
		throw new ExpressError('Unauthorized, Please login first!', 401);
	} catch (err) {
		return next(err);
	}
};

/** Middleware to use when they must provide a valid token that is an admin token.
 *
 * Add username onto req as a convenience for view functions.
 *
 * If not, raises Unauthorized.
 *
 */
const ensureIsAdmin = (req, res, next) => {
	try {
		const tokenStr = req.body._token || req.query._token;
		const payload = jwt.verify(tokenStr, SECRET);

		req.id = payload;
		req.is_admin = payload.is_admin;
		
		if (req.id.is_admin ||payload.id === +req.params.id) return next();
		throw new ExpressError('Unauthorized, admin privileges required', 401);
	} catch (err) {
		return next(err);
	}
};

module.exports = { isAuthenticated, ensureCorrectUser, ensureIsAdmin };
