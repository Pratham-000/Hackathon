const express = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('../modules/auth/auth.routes');
const analyticsRoutes = require('../modules/analytics/analytics.routes');
const employeeRoutes = require('../modules/employees/employee.routes');
const budgetRoutes = require('../modules/budgets/budget.routes');
const versionRoutes = require('../modules/versions/version.routes');
const scenarioRoutes = require('../modules/scenarios/scenario.routes');
const dashboardRoutes = require('../modules/dashboard/dashboard.routes');
const forecastRoutes = require('../modules/forecasts/forecast.routes');
const assumptionRoutes = require('../modules/assumptions/assumption.routes');
const payrollRoutes = require('../modules/payroll/payroll.routes');
const insightsRoutes = require('../modules/insights/insights.routes');
const notificationRoutes = require('../modules/notifications/notification.routes');
const reportRoutes = require('../modules/reports/report.routes');

const router = express.Router();
console.log({
  healthRoutes: typeof healthRoutes,
  authRoutes: typeof authRoutes,
  analyticsRoutes: typeof analyticsRoutes,
  employeeRoutes: typeof employeeRoutes,
  budgetRoutes: typeof budgetRoutes,
  versionRoutes: typeof versionRoutes,
  scenarioRoutes: typeof scenarioRoutes,
  dashboardRoutes: typeof dashboardRoutes,
  forecastRoutes: typeof forecastRoutes,
  assumptionRoutes: typeof assumptionRoutes,
  payrollRoutes: typeof payrollRoutes,
  insightsRoutes: typeof insightsRoutes,
  notificationRoutes: typeof notificationRoutes,
  reportRoutes: typeof reportRoutes,
});
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/employees', employeeRoutes);
router.use('/budgets', budgetRoutes);
router.use('/versions', versionRoutes);
router.use('/scenarios', scenarioRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/forecasts', forecastRoutes);
router.use('/assumptions', assumptionRoutes);
router.use('/payrolls', payrollRoutes);
router.use('/insights', insightsRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reports', reportRoutes);

module.exports = router;