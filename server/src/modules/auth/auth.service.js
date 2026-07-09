const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRepository = require('./auth.repository');

class AuthService {
  async register(payload) {
    const { name, email, password, role } = payload;

    if (!name || !email || !password) {
      const error = new Error('Name, email and password are required');
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
      const error = new Error('Email already registered');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await authRepository.createUser({
      name,
      email,
      password: hashedPassword,
      role: role || 'USER',
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async login(payload) {
    const { email, password } = payload;

    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.statusCode = 400;
      throw error;
    }

    const user = await authRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
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
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
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
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}

module.exports = new AuthService();