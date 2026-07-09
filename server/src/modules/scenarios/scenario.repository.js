const prisma = require('../../config/db');

class ScenarioRepository {
  async findAll({ budgetId, budgetVersionId, organizationId, type, page, limit }) {
    const where = {
      ...(budgetId ? { budgetId } : {}),
      ...(budgetVersionId ? { budgetVersionId } : {}),
      ...(organizationId ? { organizationId } : {}),
      ...(type ? { type } : {}),
    };

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.scenario.findMany({
        where,
        include: {
          budget: true,
          budgetVersion: true,
          organization: true,
          createdBy: true,
          assumptions: true,
          scenarioResults: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.scenario.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id) {
    return prisma.scenario.findUnique({
      where: { id },
      include: {
        budget: true,
        budgetVersion: true,
        organization: true,
        createdBy: true,
        assumptions: true,
        scenarioResults: true,
      },
    });
  }

  async create(data) {
    return prisma.scenario.create({
      data,
      include: {
        budget: true,
        budgetVersion: true,
        organization: true,
        createdBy: true,
        assumptions: true,
        scenarioResults: true,
      },
    });
  }

  async update(id, data) {
    return prisma.scenario.update({
      where: { id },
      data,
      include: {
        budget: true,
        budgetVersion: true,
        organization: true,
        createdBy: true,
        assumptions: true,
        scenarioResults: true,
      },
    });
  }

  async delete(id) {
    return prisma.scenario.delete({
      where: { id },
      include: {
        budget: true,
        budgetVersion: true,
        organization: true,
        createdBy: true,
        assumptions: true,
        scenarioResults: true,
      },
    });
  }

  async findAssumptionsByIds(ids) {
    return prisma.assumption.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}

module.exports = new ScenarioRepository();