const prisma = require('../../config/db');

class InsightsRepository {
  async findAll({ organizationId, type, budgetId, budgetVersionId, scenarioId, userId, page, limit }) {
    const where = {
      ...(organizationId ? { organizationId } : {}),
      ...(type ? { type } : {}),
      ...(budgetId ? { budgetId } : {}),
      ...(budgetVersionId ? { budgetVersionId } : {}),
      ...(scenarioId ? { scenarioId } : {}),
      ...(userId ? { userId } : {}),
    };

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.aIInsight.findMany({
        where,
        include: {
          user: true,
          organization: true,
          budget: true,
          budgetVersion: true,
          scenario: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.aIInsight.count({ where }),
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
    return prisma.aIInsight.findUnique({
      where: { id },
      include: {
        user: true,
        organization: true,
        budget: true,
        budgetVersion: true,
        scenario: true,
      },
    });
  }

  async create(data) {
    return prisma.aIInsight.create({
      data,
      include: {
        user: true,
        organization: true,
        budget: true,
        budgetVersion: true,
        scenario: true,
      },
    });
  }

  async update(id, data) {
    return prisma.aIInsight.update({
      where: { id },
      data,
      include: {
        user: true,
        organization: true,
        budget: true,
        budgetVersion: true,
        scenario: true,
      },
    });
  }

  async delete(id) {
    return prisma.aIInsight.delete({
      where: { id },
      include: {
        user: true,
        organization: true,
        budget: true,
        budgetVersion: true,
        scenario: true,
      },
    });
  }
}

module.exports = new InsightsRepository();