/** Routes for hospital. */

const express = require('express');
const router = new express.Router();

const Hospital = require('../models/Hospital');
const { isAuthenticated, ensureIsAdmin } = require('../middleware/auth');

// ##### GET ##### //
// GET ALL PROCEDURES /hospital/procedures
router.get('/procedures', isAuthenticated, async (req, res, next) => {
  try {
    const procedures = await Hospital.getProcedures();
    return res.json( procedures );
  } catch (err) {
    return next(err);
  }
});

// GET ALL ALL TEST CODES /hospital/testcodes
router.get('/testcodes', isAuthenticated, async (req, res, next) => {
  try {
    const testCodes = await Hospital.getTestCodes();
    return res.json( testCodes );
  } catch (err) {
    return next(err);
  }
});

// GET ALL LOCATIONS /hospital/locations
router.get('/locations', isAuthenticated, async (req, res, next) => {
  try {
    const locations = await Hospital.getLocations();
    return res.json( locations );
  } catch (err) {
    return next(err);
  }
});

// GET ALL DEPARTMENTS /hospital/departments
router.get('/departments', isAuthenticated, async (req, res, next) => {
  try {
    const departments = await Hospital.getDepartments();
    return res.json( departments );
  } catch (err) {
    return next(err);
  }
});

// ##### ADD ##### //
// ADD A NEW PROCEDURE
router.post('/procedures', ensureIsAdmin, async (req, res, next) => {
  try {
    const newProcedure = await Hospital.addProcedure(req.body);
    return res.status(201).json({
      procedure_name: newProcedure.procedure_name
    });
  } catch (e) {
    return next(e);
  }
});

// ADD A NEW TEST CODE
router.post('/testcodes', ensureIsAdmin, async (req, res, next) => {
  try {
    const newTestCode = await Hospital.addTestCode(req.body);
    return res.status(201).json({
      cpt: newTestCode.cpt,
      description: newTestCode.description
    });
  } catch (e) {
    return next(e);
  }
});

// ADD A NEW LOCATION
router.post('/locations', ensureIsAdmin, async (req, res, next) => {
  try {
    const newLocation = await Hospital.addLocation(req.body);
    return res.status(201).json({
      location_name: newLocation.location_name
    });
  } catch (e) {
    return next(e);
  }
});

// ADD A NEW DEPARTMENT
router.post('/departments', ensureIsAdmin, async (req, res, next) => {
  try {
    const newDepartment = await Hospital.addDepartment(req.body);
    return res.status(201).json({
      department_name: newDepartment.department_name
    });
  } catch (e) {
    return next(e);
  }
});

// ##### DELETE ##### //
// DELETE A SINGLE PROCEDURE hospital/procedure/:id
router.delete('/procedures/:id', ensureIsAdmin, async (req, res, next) => {
  try {
    await Hospital.deleteProcedure(req.params.id);
    return res.json({ message: `Procedure: ${req.params.id} has been deleted` });
  } catch (err) {
    return next(err);
  }
});

// DELETE A SINGLE TEST CODE hospital/testcodes/:id
router.delete('/testcodes/:cpt', ensureIsAdmin, async (req, res, next) => {
  try {
    await Hospital.deleteTestCode(req.params.cpt);
    return res.json({ message: `Test Code: ${req.params.cpt} has been deleted` });
  } catch (err) {
    return next(err);
  }
});

// DELETE A SINGLE LOCATION hospital/locations/:id
router.delete('/locations/:id', ensureIsAdmin, async (req, res, next) => {
  try {
    await Hospital.deleteLocation(req.params.id);
    return res.json({ message: `Location: ${req.params.id} has been deleted` });
  } catch (err) {
    return next(err);
  }
});

// DELETE A SINGLE DEPARTMENTS hospital/departments/:id
router.delete('/departments/:id', ensureIsAdmin, async (req, res, next) => {
  try {
    await Hospital.deleteDepartment(req.params.id);
    return res.json({ message: `Department: ${req.params.id} has been deleted` });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
