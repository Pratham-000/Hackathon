const express = require('express');
const dashboardController = require('./dashboard.controller');
const authenticate = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get(
  '/',
  authenticate,
  dashboardController.getDashboard.bind(dashboardController)
);

module.exports = router;