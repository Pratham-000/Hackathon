const mapVersion = (version) => ({
  id: version.id,
  budgetId: version.budgetId,
  versionNumber: version.versionNumber,
  name: version.name,
  notes: version.notes,
  status: version.status,
  revenue: Number(version.revenue),
  expenses: Number(version.expenses),
  profit: Number(version.profit),
  createdById: version.createdById,
  createdAt: version.createdAt,
  updatedAt: version.updatedAt,
  budget: version.budget
    ? {
        id: version.budget.id,
        name: version.budget.name,
        fiscalYear: version.budget.fiscalYear,
        status: version.budget.status,
      }
    : null,
  createdBy: version.createdBy
    ? {
        id: version.createdBy.id,
        fullName: version.createdBy.fullName,
        email: version.createdBy.email,
      }
    : null,
  assumptions: Array.isArray(version.assumptions)
    ? version.assumptions.map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        value: Number(item.value),
        unit: item.unit,
        description: item.description,
        budgetVersionId: item.budgetVersionId,
      }))
    : [],
});

module.exports = { mapVersion };