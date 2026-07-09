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
        name: true,
        email: true,
        role: true,
      },
    });
  }

  async createUser({ name, email, password, role }) {
    return prisma.user.create({
      data: {
        name,
        email,
        password,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }
}

module.exports = new AuthRepository();