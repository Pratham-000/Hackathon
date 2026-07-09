const express = require('express');
const payrollController = require('./payroll.controller');
const authenticate = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/authorize.middleware');

const router = express.Router();

router.get(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'FINANCE_MANAGER'),
  payrollController.getPayrolls.bind(payrollController)
);

router.get(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN', 'FINANCE_MANAGER'),
  payrollController.getPayrollById.bind(payrollController)
);

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'FINANCE_MANAGER'),
  payrollController.createPayroll.bind(payrollController)
);

router.put(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN', 'FINANCE_MANAGER'),
  payrollController.updatePayroll.bind(payrollController)
);

router.delete(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  payrollController.deletePayroll.bind(payrollController)
);

module.exports = router;