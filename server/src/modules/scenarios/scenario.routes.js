const express = require('express');
const scenarioController = require('./scenario.controller');
const authenticate = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/authorize.middleware');

const router = express.Router();

router.get(
  '/',
  authenticate,
  scenarioController.getScenarios.bind(scenarioController)
);

router.get(
  '/:id',
  authenticate,
  scenarioController.getScenarioById.bind(scenarioController)
);

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'FINANCE_MANAGER'),
  scenarioController.createScenario.bind(scenarioController)
);

router.put(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN', 'FINANCE_MANAGER'),
  scenarioController.updateScenario.bind(scenarioController)
);

router.delete(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  scenarioController.deleteScenario.bind(scenarioController)
);

module.exports = router;