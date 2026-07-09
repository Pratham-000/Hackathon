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
  '/:id',
  authenticate,
  employeeController.getEmployeeById.bind(employeeController)
);

module.exports = router;