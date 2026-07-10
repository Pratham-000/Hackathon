const express = require('express');
const employeeController = require('./employee.controller');
const authenticate = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get(
  '/',
  authenticate,
  employeeController.getEmployees.bind(employeeController)
);

router.get(
  '/stats',
  authenticate,
  employeeController.getEmployeeStats.bind(employeeController)
);

router.get(
  '/:id',
  authenticate,
  employeeController.getEmployeeById.bind(employeeController)
);

router.post(
  '/',
  authenticate,
  employeeController.createEmployee.bind(employeeController)
);

router.put(
  '/:id',
  authenticate,
  employeeController.updateEmployee.bind(employeeController)
);

router.delete(
  '/:id',
  authenticate,
  employeeController.deleteEmployee.bind(employeeController)
);

module.exports = router;