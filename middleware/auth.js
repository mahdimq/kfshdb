const jwt = require('jsonwebtoken');
const { SECRET } = require('../config');
const ExpressError = require('../helpers/expressError');

/** Middleware to use when they must provide a valid token.
 *
 * Add username onto req as a convenience for view functions.
 *
 * If not, raises Unauthorized.
 *
 */

// ENSURE AUTHENTICATED BY VERIFYING TOKEN
const isAuthenticated = (req, res, next) => {
	try {
		const tokenStr = req.body._token || req.query._token;
		const payload = jwt.verify(tokenStr, SECRET);
		if (!payload) return new ExpressError('Invalid Token', 401);
		req.id = payload.id;
		req.firstname = payload.firstname;
		req.lastname = payload.lastname;
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
const ensureLoggedIn = (req, res, next) => {
	try {
		const tokenStr = req.body._token || req.query._token;
		const payload = jwt.verify(tokenStr, SECRET);
		if (!payload) return new ExpressError('Invalid Token', 401);
		req.id = payload.id;
		req.firstname = payload.firstname;
		req.lastname = payload.lastname;

		if (payload.id === +req.params.user_id) {
			return next();
		}
		// throw an error, so we catch it in our catch, below
		throw new Error();
	} catch (err) {
		const unauthorized = new ExpressError('Unauthorized, Please login first!', 401);
		return next(unauthorized);
	}
};

/** Middleware to use when they must provide a valid token that is an admin token.
 *
 * Add username onto req as a convenience for view functions.
 *
 * If not, raises Unauthorized.
 *
 */
// const ensureIsAdmin = (req, res, next) => {
// 	try {
// 		const tokenStr = req.body._token || req.query._token;
// 		const payload = jwt.verify(tokenStr, SECRET);
// 		req.id = payload.id;
// 		req.username = payload.username;
// 		req.email = payload.email;

// 		if (payload.is_admin || payload.id === req.params.id) {
// 			return next();
// 		}
// 		throw new ExpressError('You are not an admin');
// 	} catch (err) {
// 		return next(new ExpressError('Must be an admin to access this!', 401));
// 	}
// };

module.exports = { isAuthenticated, ensureLoggedIn };
