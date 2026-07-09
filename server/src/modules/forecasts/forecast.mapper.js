const mapForecast = (forecast) => ({
  id: forecast.id,
  title: forecast.title,
  period: forecast.period,
  startDate: forecast.startDate,
  endDate: forecast.endDate,
  projectedRevenue:
    forecast.projectedRevenue !== null ? Number(forecast.projectedRevenue) : null,
  projectedExpenses:
    forecast.projectedExpenses !== null ? Number(forecast.projectedExpenses) : null,
  projectedProfit:
    forecast.projectedProfit !== null ? Number(forecast.projectedProfit) : null,
  projectedHeadcount: forecast.projectedHeadcount,
  projectedPayroll:
    forecast.projectedPayroll !== null ? Number(forecast.projectedPayroll) : null,
  organizationId: forecast.organizationId,
  departmentId: forecast.departmentId,
  budgetId: forecast.budgetId,
  budgetVersionId: forecast.budgetVersionId,
  scenarioId: forecast.scenarioId,
  createdAt: forecast.createdAt,
  updatedAt: forecast.updatedAt,
  organization: forecast.organization
    ? {
        id: forecast.organization.id,
        name: forecast.organization.name,
        currency: forecast.organization.currency,
        fiscalYearStart: forecast.organization.fiscalYearStart,
      }
    : null,
  department: forecast.department
    ? {
        id: forecast.department.id,
        name: forecast.department.name,
        code: forecast.department.code,
      }
    : null,
  budget: forecast.budget
    ? {
        id: forecast.budget.id,
        name: forecast.budget.name,
        fiscalYear: forecast.budget.fiscalYear,
        status: forecast.budget.status,
      }
    : null,
  budgetVersion: forecast.budgetVersion
    ? {
        id: forecast.budgetVersion.id,
        name: forecast.budgetVersion.name,
        versionNumber: forecast.budgetVersion.versionNumber,
        status: forecast.budgetVersion.status,
      }
    : null,
  scenario: forecast.scenario
    ? {
        id: forecast.scenario.id,
        name: forecast.scenario.name,
        type: forecast.scenario.type,
      }
    : null,
});

module.exports = { mapForecast };