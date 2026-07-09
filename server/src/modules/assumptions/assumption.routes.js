const express = require('express');
const assumptionController = require('./assumption.controller');
const authenticate = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/authorize.middleware');

const router = express.Router();

router.get(
  '/',
  authenticate,
  assumptionController.getAssumptions.bind(assumptionController)
);

router.get(
  '/:id',
  authenticate,
  assumptionController.getAssumptionById.bind(assumptionController)
);

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'FINANCE_MANAGER'),
  assumptionController.createAssumption.bind(assumptionController)
);

router.put(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN', 'FINANCE_MANAGER'),
  assumptionController.updateAssumption.bind(assumptionController)
);

router.delete(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  assumptionController.deleteAssumption.bind(assumptionController)
);

module.exports = router;