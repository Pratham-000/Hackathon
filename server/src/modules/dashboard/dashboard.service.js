const dashboardRepository = require('./dashboard.repository');

const toNumber = (value) => (value === null || value === undefined ? 0 : Number(value));

const mapScenario = (item) => ({
  id: item.id,
  name: item.name,
  type: item.type,
  budgetName: item.budget?.name || null,
  versionName: item.budgetVersion?.name || null,
  createdBy: item.createdBy?.fullName || null,
  createdAt: item.createdAt,
  revenueImpact: toNumber(item.revenueImpact),
  expenseImpact: toNumber(item.expenseImpact),
  profitImpact: toNumber(item.profitImpact),
  payrollImpact: toNumber(item.payrollImpact),
});

const mapForecast = (item) => ({
  id: item.id,
  title: item.title,
  period: item.period,
  budgetName: item.budget?.name || null,
  versionName: item.budgetVersion?.name || null,
  scenarioName: item.scenario?.name || null,
  createdAt: item.createdAt,
  projectedRevenue: toNumber(item.projectedRevenue),
  projectedExpenses: toNumber(item.projectedExpenses),
  projectedProfit: toNumber(item.projectedProfit),
  projectedHeadcount: item.projectedHeadcount,
  projectedPayroll: toNumber(item.projectedPayroll),
});

class DashboardService {
  async getDashboard(organizationId) {
    if (!organizationId) {
      const error = new Error('organizationId is required');
      error.statusCode = 400;
      throw error;
    }

    const [overview, recentScenarios, recentForecasts] = await Promise.all([
      dashboardRepository.getOverview(organizationId),
      dashboardRepository.getRecentScenarios(organizationId, 5),
      dashboardRepository.getRecentForecasts(organizationId, 5),
    ]);

    return {
      overview: {
        counts: overview.counts,
        totals: overview.totals,
        scenarioByType: overview.scenarioByType,
        budgetByStatus: overview.budgetByStatus,
      },
      recentScenarios: recentScenarios.map(mapScenario),
      recentForecasts: recentForecasts.map(mapForecast),
    };
  }
}

module.exports = new DashboardService();