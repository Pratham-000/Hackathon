const express = require('express');
const reportController = require('./report.controller');
const authenticate = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get(
  '/',
  authenticate,
  reportController.getReports.bind(reportController)
);

router.get(
  '/:id',
  authenticate,
  reportController.getReportById.bind(reportController)
);

module.exports = router;