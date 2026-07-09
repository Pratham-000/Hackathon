const prisma = require('../../config/db');

class VersionRepository {
  async findAll({ budgetId, status, createdById, page, limit }) {
    const where = {
      ...(budgetId ? { budgetId } : {}),
      ...(status ? { status } : {}),
      ...(createdById ? { createdById } : {}),
    };

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.budgetVersion.findMany({
        where,
        include: {
          budget: true,
          createdBy: true,
          assumptions: true,
        },
        orderBy: [
          { budgetId: 'asc' },
          { versionNumber: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.budgetVersion.count({ where }),
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
    return prisma.budgetVersion.findUnique({
      where: { id },
      include: {
        budget: true,
        createdBy: true,
        assumptions: true,
      },
    });
  }

  async findByBudgetAndVersionNumber(budgetId, versionNumber) {
    return prisma.budgetVersion.findUnique({
      where: {
        budgetId_versionNumber: {
          budgetId,
          versionNumber,
        },
      },
    });
  }

  async create(data) {
    return prisma.budgetVersion.create({
      data,
      include: {
        budget: true,
        createdBy: true,
        assumptions: true,
      },
    });
  }

  async update(id, data) {
    return prisma.budgetVersion.update({
      where: { id },
      data,
      include: {
        budget: true,
        createdBy: true,
        assumptions: true,
      },
    });
  }

  async delete(id) {
    return prisma.budgetVersion.delete({
      where: { id },
      include: {
        budget: true,
        createdBy: true,
        assumptions: true,
      },
    });
  }
}

module.exports = new VersionRepository();