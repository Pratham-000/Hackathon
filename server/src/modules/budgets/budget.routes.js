const express = require('express');
const budgetController = require('./budget.controller');
const authenticate = require('../../middlewares/auth.middleware');
const authorizeRoles = require('../../middlewares/authorize.middleware');

const router = express.Router();

router.get(
  '/',
  authenticate,
  budgetController.getBudgets.bind(budgetController)
);

router.get(
  '/:id',
  authenticate,
  budgetController.getBudgetById.bind(budgetController)
);

router.post(
  '/',
  authenticate,
  authorizeRoles('ADMIN', 'FINANCE_MANAGER'),
  budgetController.createBudget.bind(budgetController)
);

router.put(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN', 'FINANCE_MANAGER'),
  budgetController.updateBudget.bind(budgetController)
);

router.delete(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  budgetController.deleteBudget.bind(budgetController)
);

module.exports = router;