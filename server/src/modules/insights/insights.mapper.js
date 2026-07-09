const mapInsight = (insight) => ({
  id: insight.id,
  title: insight.title,
  type: insight.type,
  prompt: insight.prompt,
  response: insight.response,
  confidenceScore:
    insight.confidenceScore !== null ? Number(insight.confidenceScore) : null,
  userId: insight.userId,
  organizationId: insight.organizationId,
  budgetId: insight.budgetId,
  budgetVersionId: insight.budgetVersionId,
  scenarioId: insight.scenarioId,
  createdAt: insight.createdAt,
  updatedAt: insight.updatedAt,
  user: insight.user
    ? {
        id: insight.user.id,
        fullName: insight.user.fullName,
        email: insight.user.email,
        role: insight.user.role,
      }
    : null,
  organization: insight.organization
    ? {
        id: insight.organization.id,
        name: insight.organization.name,
        currency: insight.organization.currency,
      }
    : null,
  budget: insight.budget
    ? {
        id: insight.budget.id,
        name: insight.budget.name,
        fiscalYear: insight.budget.fiscalYear,
        status: insight.budget.status,
      }
    : null,
  budgetVersion: insight.budgetVersion
    ? {
        id: insight.budgetVersion.id,
        name: insight.budgetVersion.name,
        versionNumber: insight.budgetVersion.versionNumber,
        status: insight.budgetVersion.status,
      }
    : null,
  scenario: insight.scenario
    ? {
        id: insight.scenario.id,
        name: insight.scenario.name,
        type: insight.scenario.type,
      }
    : null,
});

module.exports = { mapInsight };