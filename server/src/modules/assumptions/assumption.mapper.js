const mapAssumption = (assumption) => ({
  id: assumption.id,
  name: assumption.name,
  type: assumption.type,
  value: assumption.value !== null ? Number(assumption.value) : null,
  unit: assumption.unit,
  description: assumption.description,
  budgetVersionId: assumption.budgetVersionId,
  createdAt: assumption.createdAt,
  updatedAt: assumption.updatedAt,
  budgetVersion: assumption.budgetVersion
    ? {
        id: assumption.budgetVersion.id,
        budgetId: assumption.budgetVersion.budgetId,
        versionNumber: assumption.budgetVersion.versionNumber,
        name: assumption.budgetVersion.name,
        status: assumption.budgetVersion.status,
      }
    : null,
  scenarios: Array.isArray(assumption.scenarios)
    ? assumption.scenarios.map((scenario) => ({
        id: scenario.id,
        name: scenario.name,
        type: scenario.type,
        budgetId: scenario.budgetId,
        budgetVersionId: scenario.budgetVersionId,
      }))
    : [],
});

module.exports = { mapAssumption };