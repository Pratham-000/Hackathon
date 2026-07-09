const prisma = require('../../config/db');

class ForecastRepository {
  async findAll({ organizationId, departmentId, budgetId, budgetVersionId, scenarioId, period, page, limit }) {
    const where = {
      ...(organizationId ? { organizationId } : {}),
      ...(departmentId ? { departmentId } : {}),
      ...(budgetId ? { budgetId } : {}),
      ...(budgetVersionId ? { budgetVersionId } : {}),
      ...(scenarioId ? { scenarioId } : {}),
      ...(period ? { period } : {}),
    };

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.forecast.findMany({
        where,
        include: {
          organization: true,
          department: true,
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
      prisma.forecast.count({ where }),
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
    return prisma.forecast.findUnique({
      where: { id },
      include: {
        organization: true,
        department: true,
        budget: true,
        budgetVersion: true,
        scenario: true,
      },
    });
  }

  async create(data) {
    return prisma.forecast.create({
      data,
      include: {
        organization: true,
        department: true,
        budget: true,
        budgetVersion: true,
        scenario: true,
      },
    });
  }

  async update(id, data) {
    return prisma.forecast.update({
      where: { id },
      data,
      include: {
        organization: true,
        department: true,
        budget: true,
        budgetVersion: true,
        scenario: true,
      },
    });
  }

  async delete(id) {
    return prisma.forecast.delete({
      where: { id },
      include: {
        organization: true,
        department: true,
        budget: true,
        budgetVersion: true,
        scenario: true,
      },
    });
  }
}

module.exports = new ForecastRepository();