const express = require('express');
const insightsController = require('./insights.controller');
const authenticate = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/authorize.middleware');

const router = express.Router();

router.get(
  '/',
  authenticate,
  insightsController.getInsights.bind(insightsController)
);

router.post(
  '/generate',
  authenticate,
  authorizeRoles('ADMIN', 'FINANCE_MANAGER', 'ANALYST'),
  insightsController.generateInsight.bind(insightsController)
);

router.get(
  '/:id',
  authenticate,
  insightsController.getInsightById.bind(insightsController)
);

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'FINANCE_MANAGER'),
  insightsController.createInsight.bind(insightsController)
);

router.put(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN', 'FINANCE_MANAGER'),
  insightsController.updateInsight.bind(insightsController)
);

router.delete(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  insightsController.deleteInsight.bind(insightsController)
);

module.exports = router;