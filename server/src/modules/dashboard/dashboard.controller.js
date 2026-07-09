const dashboardService = require('./dashboard.service');

class DashboardController {
  async getDashboard(req, res, next) {
    try {
      const organizationId = req.query.organizationId;
      const data = await dashboardService.getDashboard(organizationId);

      return res.status(200).json({
        success: true,
        message: 'Dashboard data fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();