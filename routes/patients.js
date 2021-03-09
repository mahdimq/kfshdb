/** Routes for patients. */

const express = require('express');
const router = new express.Router();

const Patient = require('../models/Patient');
const { validate } = require('jsonschema');
const { patientSchema } = require('../schemas');
const { ensureLoggedIn, isAuthenticated } = require('../middleware/auth');

/** GET / => {patients: [patient, ...]} */

// GET ALL PATIENTS /patients/
router.get('/', isAuthenticated, async (req, res, next) => {
	try {
		const patients = await Patient.findAll();
		return res.json({ patients });
	} catch (err) {
		return next(err);
	}
});

/** GET /[patient_mrn] => {patient: patient} */
// GET A SINGLE PATIENT BY MRN /patients/:mrn
router.get('/:mrn', isAuthenticated, async function (req, res, next) {
	try {
		const patient = await Patient.findOne(req.params.mrn);
		return res.json({ patient });
	} catch (err) {
		return next(err);
	}
});

/** POST / {patientdata}  => {token: token} */
// REGISTER A patient /patient/

// ADD A NEW PATIENT
router.post('/', async (req, res, next) => {
	try {
		delete req.body._token;
		// Validate schema from json schema
		const validation = validate(req.body, patientSchema);
		if (!validation.valid) {
			return next({
				status: 400,
				message: validation.errors.map((e) => e.stack)
			});
		}

		const newPatient = await Patient.register(req.body);
		return res.status(201).json({
			mrn: newPatient.mrn,
			firstname: newPatient.firstname,
			lastname: newPatient.lastname,
			dob: newPatient.dob,
			gender: newPatient.gender,
			age_category: newPatient.age_category,
			nationality: newPatient.nationality
		});
	} catch (e) {
		return next(e);
	}
});

/** PATCH /[handle] {patientData} => {patient: updatedPatient} */
// UPDATE A SINGLE PATIENT /patients/:mrn
// router.patch('/:mrn', async function (req, res, next) {
// 	try {
// 		if ('mrn' in req.body) {
// 			return next({ status: 400, message: 'Not allowed' });
// 		}

// 		await Patient.authenticate({
// 			id: req.params.mrn
// 		});

// 		const validation = validate(req.body, patientUpdateSchema);
// 		if (!validation.valid) {
// 			return next({
// 				status: 400,
// 				message: validation.errors.map((e) => e.stack)
// 			});
// 		}

// 		const patient = await Patient.update(req.params.mrn, req.body);
// 		return res.json({ patient });
// 	} catch (err) {
// 		return next(err);
// 	}
// });

// /** DELETE /[handle]  =>  {message: "Patient deleted"}  */
// // DELETE A SINGLE PATIENT patients/:patient_mrn
// router.delete('/:patient_mrn', ensureLoggedIn, async function (req, res, next) {
// 	try {
// 		await Patient.remove(req.params.patient_mrn);
// 		return res.json({ message: `Patient: ${req.params.patient_mrn} has been deleted` });
// 	} catch (err) {
// 		return next(err);
// 	}
// });

module.exports = router;
