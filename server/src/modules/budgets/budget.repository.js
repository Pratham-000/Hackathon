const prisma = require('../../config/db');

class BudgetRepository {
  async findAll({ search, status, organizationId, departmentId, fiscalYear, page, limit }) {
    const where = {
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(status ? { status } : {}),
      ...(organizationId ? { organizationId } : {}),
      ...(departmentId ? { departmentId } : {}),
      ...(fiscalYear ? { fiscalYear } : {}),
    };

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.budget.findMany({
        where,
        include: {
          organization: true,
          department: true,
          createdBy: true,
          versions: {
            orderBy: {
              versionNumber: 'desc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.budget.count({ where }),
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
    return prisma.budget.findUnique({
      where: { id },
      include: {
        organization: true,
        department: true,
        createdBy: true,
        versions: {
          orderBy: {
            versionNumber: 'desc',
          },
        },
      },
    });
  }

  async create(data) {
    return prisma.budget.create({
      data,
      include: {
        organization: true,
        department: true,
        createdBy: true,
        versions: true,
      },
    });
  }

  async update(id, data) {
    return prisma.budget.update({
      where: { id },
      data,
      include: {
        organization: true,
        department: true,
        createdBy: true,
        versions: {
          orderBy: {
            versionNumber: 'desc',
          },
        },
      },
    });
  }

  async delete(id) {
    return prisma.budget.delete({
      where: { id },
      include: {
        organization: true,
        department: true,
        createdBy: true,
        versions: true,
      },
    });
  }

  async existsById(id) {
    const budget = await prisma.budget.findUnique({
      where: { id },
      select: { id: true },
    });

    return !!budget;
  }
}

module.exports = new BudgetRepository();