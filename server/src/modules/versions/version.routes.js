const express = require('express');
const versionController = require('./version.controller');
const authenticate = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/authorize.middleware');

const router = express.Router();

router.get(
  '/',
  authenticate,
  versionController.getVersions.bind(versionController)
);

router.get(
  '/:id',
  authenticate,
  versionController.getVersionById.bind(versionController)
);

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'FINANCE_MANAGER'),
  versionController.createVersion.bind(versionController)
);

router.put(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN', 'FINANCE_MANAGER'),
  versionController.updateVersion.bind(versionController)
);

router.delete(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  versionController.deleteVersion.bind(versionController)
);

module.exports = router;