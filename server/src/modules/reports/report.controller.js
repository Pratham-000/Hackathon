const reportService = require('./report.service');

class ReportController {
  async getReports(req, res, next) {
    try {
      const data = await reportService.getReports(req.query);
      return res.status(200).json({
        success: true,
        message: 'Reports fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getReportById(req, res, next) {
    try {
      const data = await reportService.getReportById(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Report details fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReportController();
