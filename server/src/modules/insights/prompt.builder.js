const prisma = require('../../config/db');
const { promptTemplates } = require('./prompt.templates');

class PromptBuilder {
  async build(type, payload) {
    const { organizationId, budgetId, budgetVersionId, scenarioId } = payload;

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      const error = new Error('Organization not found');
      error.statusCode = 404;
      throw error;
    }

    switch (type) {
      case 'BUDGET': {
        if (!budgetId) {
          const error = new Error('budgetId is required for BUDGET insight');
          error.statusCode = 400;
          throw error;
        }

        const budget = await prisma.budget.findUnique({
          where: { id: budgetId },
        });

        if (!budget) {
          const error = new Error('Budget not found');
          error.statusCode = 404;
          throw error;
        }

        return promptTemplates.BUDGET({
          organizationName: organization.name,
          budgetName: budget.name,
          fiscalYear: budget.fiscalYear,
          revenue: Number(budget.totalRevenue),
          expenses: Number(budget.totalExpenses),
          profit: Number(budget.totalProfit),
        });
      }

      case 'SCENARIO': {
        if (!scenarioId) {
          const error = new Error('scenarioId is required for SCENARIO insight');
          error.statusCode = 400;
          throw error;
        }

        const scenario = await prisma.scenario.findUnique({
          where: { id: scenarioId },
        });

        if (!scenario) {
          const error = new Error('Scenario not found');
          error.statusCode = 404;
          throw error;
        }

        return promptTemplates.SCENARIO({
          organizationName: organization.name,
          scenarioName: scenario.name,
          scenarioType: scenario.type,
          revenueImpact: Number(scenario.revenueImpact || 0),
          expenseImpact: Number(scenario.expenseImpact || 0),
          profitImpact: Number(scenario.profitImpact || 0),
          payrollImpact: Number(scenario.payrollImpact || 0),
        });
      }

      case 'FORECAST': {
        const forecast = await prisma.forecast.findFirst({
          where: {
            organizationId,
            ...(budgetVersionId ? { budgetVersionId } : {}),
            ...(scenarioId ? { scenarioId } : {}),
          },
          orderBy: { createdAt: 'desc' },
        });

        if (!forecast) {
          const error = new Error('Forecast not found for given filters');
          error.statusCode = 404;
          throw error;
        }

        return promptTemplates.FORECAST({
          organizationName: organization.name,
          title: forecast.title,
          period: forecast.period,
          projectedRevenue: Number(forecast.projectedRevenue),
          projectedExpenses: Number(forecast.projectedExpenses),
          projectedProfit: Number(forecast.projectedProfit),
          projectedHeadcount: forecast.projectedHeadcount || 0,
          projectedPayroll: Number(forecast.projectedPayroll || 0),
        });
      }

      case 'PAYROLL': {
        const payroll = await prisma.payroll.findFirst({
          where: { organizationId },
          orderBy: [{ year: 'desc' }, { month: 'desc' }],
        });

        if (!payroll) {
          const error = new Error('Payroll not found');
          error.statusCode = 404;
          throw error;
        }

        return promptTemplates.PAYROLL({
          organizationName: organization.name,
          baseSalaryTotal: Number(payroll.baseSalaryTotal),
          bonusTotal: Number(payroll.bonusTotal),
          deductionsTotal: Number(payroll.deductionsTotal),
          netPayrollTotal: Number(payroll.netPayrollTotal),
        });
      }

      case 'WORKFORCE': {
        const [totalEmployees, activeEmployees, payrollAgg] = await Promise.all([
          prisma.employee.count({ where: { organizationId } }),
          prisma.employee.count({ where: { organizationId, isActive: true } }),
          prisma.payroll.aggregate({
            where: { organizationId },
            _sum: { netPayrollTotal: true },
          }),
        ]);

        return promptTemplates.WORKFORCE({
          organizationName: organization.name,
          totalEmployees,
          activeEmployees,
          totalPayroll: Number(payrollAgg._sum.netPayrollTotal || 0),
        });
      }

      case 'KPI': {
        const [budgetCount, versionCount, scenarioCount, forecastCount, payrollCount] =
          await Promise.all([
            prisma.budget.count({ where: { organizationId } }),
            prisma.budgetVersion.count({
              where: {
                budget: { organizationId },
              },
            }),
            prisma.scenario.count({ where: { organizationId } }),
            prisma.forecast.count({ where: { organizationId } }),
            prisma.payroll.count({ where: { organizationId } }),
          ]);

        return promptTemplates.KPI({
          organizationName: organization.name,
          budgetCount,
          versionCount,
          scenarioCount,
          forecastCount,
          payrollCount,
        });
      }

      default: {
        const error = new Error('Unsupported insight type');
        error.statusCode = 400;
        throw error;
      }
    }
  }
}

module.exports = new PromptBuilder();