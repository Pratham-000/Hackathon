const authService = require('./auth.service');

class AuthController {
  async register(req, res, next) {
    try {
      const data = await authService.register(req.body);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const data = await authService.login(req.body);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const data = await authService.getProfile(req.user.id);

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();