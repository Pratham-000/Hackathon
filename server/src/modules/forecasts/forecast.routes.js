const express = require('express');
const forecastController = require('./forecast.controller');
const authenticate = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/authorize.middleware');

const router = express.Router();

router.get(
  '/',
  authenticate,
  forecastController.getForecasts.bind(forecastController)
);

router.get(
  '/:id',
  authenticate,
  forecastController.getForecastById.bind(forecastController)
);

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'FINANCE_MANAGER'),
  forecastController.createForecast.bind(forecastController)
);

router.put(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN', 'FINANCE_MANAGER'),
  forecastController.updateForecast.bind(forecastController)
);

router.delete(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  forecastController.deleteForecast.bind(forecastController)
);

module.exports = router;