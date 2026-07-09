const prisma = require('../../config/db');

class AssumptionRepository {
  async findAll({ budgetVersionId, type, page, limit }) {
    const where = {
      ...(budgetVersionId ? { budgetVersionId } : {}),
      ...(type ? { type } : {}),
    };

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.assumption.findMany({
        where,
        include: {
          budgetVersion: true,
          scenarios: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.assumption.count({ where }),
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
    return prisma.assumption.findUnique({
      where: { id },
      include: {
        budgetVersion: true,
        scenarios: true,
      },
    });
  }

  async create(data) {
    return prisma.assumption.create({
      data,
      include: {
        budgetVersion: true,
        scenarios: true,
      },
    });
  }

  async update(id, data) {
    return prisma.assumption.update({
      where: { id },
      data,
      include: {
        budgetVersion: true,
        scenarios: true,
      },
    });
  }

  async delete(id) {
    return prisma.assumption.delete({
      where: { id },
      include: {
        budgetVersion: true,
        scenarios: true,
      },
    });
  }
}

module.exports = new AssumptionRepository();