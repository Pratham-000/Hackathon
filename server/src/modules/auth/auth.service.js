const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRepository = require('./auth.repository');
const prisma = require('../../config/db');

const getJwtSecret = () => process.env.JWT_SECRET || 'hackathon-dev-secret';

const normalizeRole = (role) => {
  const mapped = String(role || '').toUpperCase();
  const roleMap = {
    ADMIN: 'SUPER_ADMIN',
    ORG_ADMIN: 'ORG_ADMIN',
    FINANCE: 'FINANCE_MANAGER',
    FINANCE_MANAGER: 'FINANCE_MANAGER',
    HR: 'HR_MANAGER',
    HR_MANAGER: 'HR_MANAGER',
    EMPLOYEE: 'EMPLOYEE',
  };

  return roleMap[mapped] || 'EMPLOYEE';
};

class AuthService {
  async register(payload) {
    const { fullName, email, password, role } = payload;

    if (!fullName || !email || !password) {
      const error = new Error('fullName, email and password are required');
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await authRepository.findByEmail(email.trim().toLowerCase());
    if (existingUser) {
      const error = new Error('Email already registered');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const org = await prisma.organization.findFirst();
    const organizationId = org ? org.id : null;

    const user = await authRepository.createUser({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: hashedPassword,
      role: normalizeRole(role || 'ORG_ADMIN'),
      organizationId,
    });

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    };
  }

  async login(payload) {
    const { email, password } = payload;

    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.statusCode = 400;
      throw error;
    }

    const user = await authRepository.findByEmail(email.trim().toLowerCase());
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
      },
      getJwtSecret(),
      { expiresIn: '1d' }
    );

    return {
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
      },
    };
  }

  async getProfile(userId) {
    const user = await authRepository.findById(userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };
  }
}

module.exports = new AuthService();