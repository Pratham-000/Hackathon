const mapBudget = (budget) => ({
  id: budget.id,
  name: budget.name,
  description: budget.description,
  totalRevenue: Number(budget.totalRevenue),
  totalExpenses: Number(budget.totalExpenses),
  totalProfit: Number(budget.totalProfit),
  status: budget.status,
  fiscalYear: budget.fiscalYear,
  organizationId: budget.organizationId,
  departmentId: budget.departmentId,
  createdById: budget.createdById,
  createdAt: budget.createdAt,
  updatedAt: budget.updatedAt,
  organization: budget.organization
    ? {
        id: budget.organization.id,
        name: budget.organization.name,
        industry: budget.organization.industry,
        currency: budget.organization.currency,
        fiscalYearStart: budget.organization.fiscalYearStart,
      }
    : null,
  department: budget.department
    ? {
        id: budget.department.id,
        name: budget.department.name,
        code: budget.department.code,
      }
    : null,
  createdBy: budget.createdBy
    ? {
        id: budget.createdBy.id,
        fullName: budget.createdBy.fullName,
        email: budget.createdBy.email,
        role: budget.createdBy.role,
      }
    : null,
  versions: Array.isArray(budget.versions)
    ? budget.versions.map((version) => ({
        id: version.id,
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
      }))
    : [],
});

module.exports = { mapBudget };