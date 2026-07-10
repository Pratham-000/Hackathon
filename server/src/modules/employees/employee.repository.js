const prisma = require('../../config/db');

class EmployeeRepository {
  async findAll({ search, departmentId, roleId, isActive, page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;

    const where = {
      ...(typeof isActive === 'boolean' ? { isActive } : {}),
      ...(departmentId ? { departmentId } : {}),
      ...(roleId ? { roleId } : {}),
      ...(search
        ? {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { employeeCode: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        include: {
          organization: true,
          department: true,
          role: true,
          employeeSkills: {
            include: {
              skill: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.employee.count({ where }),
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
    return prisma.employee.findUnique({
      where: { id },
      include: {
        organization: true,
        department: true,
        role: true,
        employeeSkills: {
          include: {
            skill: true,
          },
        },
      },
    });
  }

  async create(data) {
    return prisma.employee.create({
      data,
      include: {
        department: true,
        role: true,
      },
    });
  }

  async update(id, data) {
    return prisma.employee.update({
      where: { id },
      data,
      include: {
        department: true,
        role: true,
      },
    });
  }

  async delete(id) {
    return prisma.employee.delete({
      where: { id },
      include: {
        department: true,
        role: true,
      },
    });
  }
}

module.exports = new EmployeeRepository();