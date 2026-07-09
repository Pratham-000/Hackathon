const insightsService = require('./insights.service');

class InsightsController {
  async getInsights(req, res, next) {
    try {
      const data = await insightsService.getInsights(req.query);

      return res.status(200).json({
        success: true,
        message: 'Insights fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getInsightById(req, res, next) {
    try {
      const data = await insightsService.getInsightById(req.params.id);

      return res.status(200).json({
        success: true,
        message: 'Insight fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async createInsight(req, res, next) {
    try {
      const data = await insightsService.createInsight(req.body);

      return res.status(201).json({
        success: true,
        message: 'Insight created successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateInsight(req, res, next) {
    try {
      const data = await insightsService.updateInsight(req.params.id, req.body);

      return res.status(200).json({
        success: true,
        message: 'Insight updated successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteInsight(req, res, next) {
    try {
      const data = await insightsService.deleteInsight(req.params.id);

      return res.status(200).json({
        success: true,
        message: 'Insight deleted successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async generateInsight(req, res, next) {
    try {
      const data = await insightsService.generateInsight(req.body);

      return res.status(201).json({
        success: true,
        message: 'Insight generated successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InsightsController();