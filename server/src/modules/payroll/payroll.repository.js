const prisma = require('../../config/db');

class PayrollRepository {
  async findAll({ organizationId, departmentId, employeeId, budgetId, budgetVersionId, month, year, page, limit }) {
    const where = {
      ...(organizationId ? { organizationId } : {}),
      ...(departmentId ? { departmentId } : {}),
      ...(employeeId ? { employeeId } : {}),
      ...(budgetId ? { budgetId } : {}),
      ...(budgetVersionId ? { budgetVersionId } : {}),
      ...(month ? { month } : {}),
      ...(year ? { year } : {}),
    };

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.payroll.findMany({
        where,
        include: {
          organization: true,
          department: true,
          employee: true,
          budget: true,
          budgetVersion: true,
        },
        orderBy: [
          { year: 'desc' },
          { month: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.payroll.count({ where }),
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
    return prisma.payroll.findUnique({
      where: { id },
      include: {
        organization: true,
        department: true,
        employee: true,
        budget: true,
        budgetVersion: true,
      },
    });
  }

  async create(data) {
    return prisma.payroll.create({
      data,
      include: {
        organization: true,
        department: true,
        employee: true,
        budget: true,
        budgetVersion: true,
      },
    });
  }

  async update(id, data) {
    return prisma.payroll.update({
      where: { id },
      data,
      include: {
        organization: true,
        department: true,
        employee: true,
        budget: true,
        budgetVersion: true,
      },
    });
  }

  async delete(id) {
    return prisma.payroll.delete({
      where: { id },
      include: {
        organization: true,
        department: true,
        employee: true,
        budget: true,
        budgetVersion: true,
      },
    });
  }
}

module.exports = new PayrollRepository();