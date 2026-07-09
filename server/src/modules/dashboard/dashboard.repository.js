const prisma = require('../../config/db');

class DashboardRepository {
  async getOverview(organizationId) {
    const [budgetCount, versionCount, scenarioCount, forecastCount, payrollCount, insightCount, budgetTotals, scenarioTotals, payrollTotals, scenarioByType, budgetByStatus] =
      await Promise.all([
        prisma.budget.count({
          where: { organizationId },
        }),

        prisma.budgetVersion.count({
          where: {
            budget: {
              organizationId,
            },
          },
        }),

        prisma.scenario.count({
          where: { organizationId },
        }),

        prisma.forecast.count({
          where: { organizationId },
        }),

        prisma.payroll.count({
          where: { organizationId },
        }),

        prisma.aIInsight.count({
          where: { organizationId },
        }),

        prisma.budget.aggregate({
          where: { organizationId },
          _sum: {
            totalRevenue: true,
            totalExpenses: true,
            totalProfit: true,
          },
        }),

        prisma.scenario.aggregate({
          where: { organizationId },
          _sum: {
            revenueImpact: true,
            expenseImpact: true,
            profitImpact: true,
            payrollImpact: true,
          },
        }),

        prisma.payroll.aggregate({
          where: { organizationId },
          _sum: {
            baseSalaryTotal: true,
            bonusTotal: true,
            deductionsTotal: true,
            netPayrollTotal: true,
          },
        }),

        prisma.scenario.groupBy({
          by: ['type'],
          where: { organizationId },
          _count: {
            _all: true,
          },
        }),

        prisma.budget.groupBy({
          by: ['status'],
          where: { organizationId },
          _count: {
            _all: true,
          },
        }),
      ]);

    return {
      counts: {
        budgets: budgetCount,
        versions: versionCount,
        scenarios: scenarioCount,
        forecasts: forecastCount,
        payrolls: payrollCount,
        insights: insightCount,
      },
      totals: {
        budgetRevenue: Number(budgetTotals._sum.totalRevenue || 0),
        budgetExpenses: Number(budgetTotals._sum.totalExpenses || 0),
        budgetProfit: Number(budgetTotals._sum.totalProfit || 0),
        scenarioRevenueImpact: Number(scenarioTotals._sum.revenueImpact || 0),
        scenarioExpenseImpact: Number(scenarioTotals._sum.expenseImpact || 0),
        scenarioProfitImpact: Number(scenarioTotals._sum.profitImpact || 0),
        scenarioPayrollImpact: Number(scenarioTotals._sum.payrollImpact || 0),
        payrollBaseTotal: Number(payrollTotals._sum.baseSalaryTotal || 0),
        payrollBonusTotal: Number(payrollTotals._sum.bonusTotal || 0),
        payrollDeductionsTotal: Number(payrollTotals._sum.deductionsTotal || 0),
        payrollNetTotal: Number(payrollTotals._sum.netPayrollTotal || 0),
      },
      scenarioByType,
      budgetByStatus,
    };
  }

  async getRecentScenarios(organizationId, limit = 5) {
    return prisma.scenario.findMany({
      where: { organizationId },
      include: {
        budget: true,
        budgetVersion: true,
        createdBy: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getRecentForecasts(organizationId, limit = 5) {
    return prisma.forecast.findMany({
      where: { organizationId },
      include: {
        budget: true,
        budgetVersion: true,
        scenario: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}

module.exports = new DashboardRepository();