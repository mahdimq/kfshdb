// Require dependencies
const express = require('express');
const app = express();
const ExpressError = require('./helpers/expressError');

app.use(express.json());

const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const physicianRoutes = require('./routes/physicians');
const departmentRoutes = require('./routes/departments');
const locationRoutes = require('./routes/locations');

app.use('/users', userRoutes);
app.use('/patients', patientRoutes);
app.use('/physicians', physicianRoutes);
app.use('/locations', locationRoutes);
app.use('/departments', departmentRoutes);
app.use('/', authRoutes);

// Custom 404 Page Not Found Error
app.use((req, res, next) => {
	const error = new ExpressError('Page not found', 404);
	return next(error);
});

// General Error Handling
app.use((error, req, res, next) => {
	// Set the default status to 500 Internal Server Error
	if (error.stack) console.log(error.stack);

	const status = error.status || 500;
	const message = error.message;

	// Display the error message and status code
	res.status(status).json({ error: { message, status } });
});

module.exports = app;
