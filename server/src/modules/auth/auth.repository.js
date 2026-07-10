const prisma = require('../../config/db');

class AuthRepository {
  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
      },
    });
  }

  async createUser({ fullName, email, passwordHash, role, organizationId }) {
    return prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        role,
        organizationId,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        organizationId: true,
      },
    });
  }
}

module.exports = new AuthRepository();