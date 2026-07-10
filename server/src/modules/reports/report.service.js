const prisma = require('../../config/db');
const geminiService = require('../../services/gemini.service');

class ReportService {
  async getReports(query) {
    const [budgets, scenarios] = await Promise.all([
      prisma.budget.findMany({ take: 10 }),
      prisma.scenario.findMany({ take: 10 }),
    ]);

    const reports = [];

    budgets.forEach((b) => {
      reports.push({
        id: `REP-BUD-${b.id}`,
        title: `${b.name} Financial Summary Report`,
        type: 'BUDGET',
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
        description: `Comprehensive review of plans, revenues, and operating expenses.`,
      });
    });

    scenarios.forEach((s) => {
      reports.push({
        id: `REP-SCE-${s.id}`,
        title: `${s.name} Scenario Comparison Report`,
        type: 'SCENARIO',
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        description: `Comparative variance analysis showing plan impact and key trade-offs.`,
      });
    });

    return reports;
  }

  async getReportById(id) {
    if (id.startsWith('REP-BUD-')) {
      const budgetId = id.replace('REP-BUD-', '');
      const budget = await prisma.budget.findUnique({
        where: { id: budgetId },
        include: { createdBy: true }
      });

      if (!budget) {
        throw new Error('Budget not found');
      }

      const analysis = await geminiService.generateFinanceSummary({
        type: 'BUDGET',
        name: budget.name,
        totalRevenue: budget.totalRevenue,
        totalExpenses: budget.totalExpenses,
        totalProfit: budget.totalProfit,
      });

      return {
        id,
        title: `${budget.name} Financial Summary Report`,
        type: 'BUDGET',
        data: budget,
        analysis,
        createdAt: budget.createdAt,
      };
    } else if (id.startsWith('REP-SCE-')) {
      const scenarioId = id.replace('REP-SCE-', '');
      const scenario = await prisma.scenario.findUnique({
        where: { id: scenarioId },
        include: { budget: true }
      });

      if (!scenario) {
        throw new Error('Scenario not found');
      }

      const analysis = await geminiService.generateFinanceSummary({
        type: 'SCENARIO',
        name: scenario.name,
        revenueImpact: scenario.revenueImpact,
        expenseImpact: scenario.expenseImpact,
        profitImpact: scenario.profitImpact,
      });

      return {
        id,
        title: `${scenario.name} Scenario Comparison Report`,
        type: 'SCENARIO',
        data: scenario,
        analysis,
        createdAt: scenario.createdAt,
      };
    }

    throw new Error('Invalid report ID format');
  }
}

module.exports = new ReportService();
