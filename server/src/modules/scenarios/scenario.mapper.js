const mapScenario = (scenario) => ({
  id: scenario.id,
  name: scenario.name,
  description: scenario.description,
  type: scenario.type,
  budgetId: scenario.budgetId,
  budgetVersionId: scenario.budgetVersionId,
  organizationId: scenario.organizationId,
  createdById: scenario.createdById,
  revenueImpact: scenario.revenueImpact !== null ? Number(scenario.revenueImpact) : null,
  expenseImpact: scenario.expenseImpact !== null ? Number(scenario.expenseImpact) : null,
  profitImpact: scenario.profitImpact !== null ? Number(scenario.profitImpact) : null,
  payrollImpact: scenario.payrollImpact !== null ? Number(scenario.payrollImpact) : null,
  createdAt: scenario.createdAt,
  updatedAt: scenario.updatedAt,
  budget: scenario.budget
    ? {
        id: scenario.budget.id,
        name: scenario.budget.name,
        fiscalYear: scenario.budget.fiscalYear,
        status: scenario.budget.status,
      }
    : null,
  budgetVersion: scenario.budgetVersion
    ? {
        id: scenario.budgetVersion.id,
        name: scenario.budgetVersion.name,
        versionNumber: scenario.budgetVersion.versionNumber,
        status: scenario.budgetVersion.status,
      }
    : null,
  organization: scenario.organization
    ? {
        id: scenario.organization.id,
        name: scenario.organization.name,
        currency: scenario.organization.currency,
      }
    : null,
  createdBy: scenario.createdBy
    ? {
        id: scenario.createdBy.id,
        fullName: scenario.createdBy.fullName,
        email: scenario.createdBy.email,
        role: scenario.createdBy.role,
      }
    : null,
  assumptions: Array.isArray(scenario.assumptions)
    ? scenario.assumptions.map((assumption) => ({
        id: assumption.id,
        name: assumption.name,
        type: assumption.type,
        value: Number(assumption.value),
        unit: assumption.unit,
        description: assumption.description,
        budgetVersionId: assumption.budgetVersionId,
      }))
    : [],
  scenarioResults: Array.isArray(scenario.scenarioResults)
    ? scenario.scenarioResults.map((result) => ({
        id: result.id,
        metricName: result.metricName,
        metricValue: Number(result.metricValue),
        metricUnit: result.metricUnit,
        changePercent: result.changePercent !== null ? Number(result.changePercent) : null,
        notes: result.notes,
      }))
    : [],
});

module.exports = { mapScenario };