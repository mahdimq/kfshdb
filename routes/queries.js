/** Routes for queries. */

const express = require('express');
const router = new express.Router();

const Query = require('../models/Query');
const { isAuthenticated, ensureIsAdmin } = require('../middleware/auth');

// GET PROCEDURE REPORT BY DATE AND AGE GROUP /queries/
router.get('/', async (req, res, next) => {
  try {
    const report = await Query.monthly(req.query);
    return res.json(report);
  } catch (err) {
    return next(err);
  }
});

// GET PROCEDURE REPORT BY NPL DEPARTMENT /queries/npl
router.get('/npl', isAuthenticated, async (req, res, next) => {
  try {
    const report = await Query.byDepartment(req.query);
    return res.json(report);
  } catch (err) {
    return next(err);
  }
});

// GET PROCEDURE REPORT BY USER /queries/user
router.get('/user', ensureIsAdmin, async (req, res, next) => {
  try {
    const report = await Query.byUser(req.query);
    return res.json(report);
  } catch (err) {
    return next(err);
  }
});

// GET PROCEDURE REPORT BY PHYSICIAN /queries/physician
router.get('/physician', ensureIsAdmin, async (req, res, next) => {
  try {
    const report = await Query.byPhysician(req.query);
    return res.json(report);
  } catch (err) {
    return next(err);
  }
});

// GET PROCEDURE REPORT BY PHYSICIAN DEPARTMENT/queries/physiciandept
router.get('/department', ensureIsAdmin, async (req, res, next) => {
  try {
    const report = await Query.byPhysicianDept(req.query);
    return res.json(report);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
