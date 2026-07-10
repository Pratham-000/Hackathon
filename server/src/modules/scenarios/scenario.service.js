const scenarioRepository = require('./scenario.repository');
const prisma = require('../../config/db');
const { mapScenario } = require('./scenario.mapper');
const {
  validateCreateScenario,
  validateUpdateScenario,
} = require('./scenario.validation');

class ScenarioService {
  async getScenarios(query) {
    const page = Number(query.page) > 0 ? Number(query.page) : 1;
    const limit = Number(query.limit) > 0 ? Number(query.limit) : 10;

    const filters = {
      budgetId: query.budgetId || null,
      budgetVersionId: query.budgetVersionId || null,
      organizationId: query.organizationId || null,
      type: query.type || null,
      page,
      limit,
    };

    const result = await scenarioRepository.findAll(filters);

    return {
      scenarios: result.items.map(mapScenario),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  async getScenarioById(id) {
    if (!id) {
      const error = new Error('Scenario id is required');
      error.statusCode = 400;
      throw error;
    }

    const scenario = await scenarioRepository.findById(id);

    if (!scenario) {
      const error = new Error('Scenario not found');
      error.statusCode = 404;
      throw error;
    }

    return mapScenario(scenario);
  }

  async createScenario(body) {
    let budgetVersionId = body.budgetVersionId;
    if (budgetVersionId === body.budgetId || !budgetVersionId) {
      const existingVersion = await prisma.budgetVersion.findFirst({
        where: { budgetId: body.budgetId }
      });
      
      if (existingVersion) {
        budgetVersionId = existingVersion.id;
      } else {
        const budget = await prisma.budget.findUnique({ where: { id: body.budgetId } });
        if (budget) {
          const newVersion = await prisma.budgetVersion.create({
            data: {
              versionNumber: 1,
              name: 'v1.0 - Draft Baseline',
              status: 'DRAFT',
              revenue: budget.totalRevenue,
              expenses: budget.totalExpenses,
              profit: budget.totalProfit,
              budgetId: budget.id,
              createdById: body.createdById,
            }
          });
          budgetVersionId = newVersion.id;
        }
      }
      body.budgetVersionId = budgetVersionId;
    }

    const payload = validateCreateScenario(body);

    if (payload.assumptionIds.length > 0) {
      const assumptions = await scenarioRepository.findAssumptionsByIds(payload.assumptionIds);

      if (assumptions.length !== payload.assumptionIds.length) {
        const error = new Error('One or more assumptionIds are invalid');
        error.statusCode = 400;
        throw error;
      }
    }

    const createdScenario = await scenarioRepository.create({
      name: payload.name,
      description: payload.description,
      type: payload.type,
      budgetId: payload.budgetId,
      budgetVersionId: payload.budgetVersionId,
      organizationId: payload.organizationId,
      createdById: payload.createdById,
      revenueImpact: payload.revenueImpact,
      expenseImpact: payload.expenseImpact,
      profitImpact: payload.profitImpact,
      payrollImpact: payload.payrollImpact,
      ...(payload.assumptionIds.length > 0
        ? {
            assumptions: {
              connect: payload.assumptionIds.map((id) => ({ id })),
            },
          }
        : {}),
      ...(payload.scenarioResults.length > 0
        ? {
            scenarioResults: {
              create: payload.scenarioResults,
            },
          }
        : {}),
    });

    return mapScenario(createdScenario);
  }

  async updateScenario(id, body) {
    if (!id) {
      const error = new Error('Scenario id is required');
      error.statusCode = 400;
      throw error;
    }

    const payload = validateUpdateScenario(body);

    try {
      const updatedScenario = await scenarioRepository.update(id, payload);
      return mapScenario(updatedScenario);
    } catch (error) {
      if (error.code === 'P2025') {
        const notFoundError = new Error('Scenario not found');
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      throw error;
    }
  }

  async deleteScenario(id) {
    if (!id) {
      const error = new Error('Scenario id is required');
      error.statusCode = 400;
      throw error;
    }

    try {
      const deletedScenario = await scenarioRepository.delete(id);
      return mapScenario(deletedScenario);
    } catch (error) {
      if (error.code === 'P2025') {
        const notFoundError = new Error('Scenario not found');
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      throw error;
    }
  }
}

module.exports = new ScenarioService();