const scenarioService = require('./scenario.service');

class ScenarioController {
  async getScenarios(req, res, next) {
    try {
      const data = await scenarioService.getScenarios(req.query);

      return res.status(200).json({
        success: true,
        message: 'Scenarios fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getScenarioById(req, res, next) {
    try {
      const data = await scenarioService.getScenarioById(req.params.id);

      return res.status(200).json({
        success: true,
        message: 'Scenario fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async createScenario(req, res, next) {
    try {
      const data = await scenarioService.createScenario(req.body);

      return res.status(201).json({
        success: true,
        message: 'Scenario created successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateScenario(req, res, next) {
    try {
      const data = await scenarioService.updateScenario(req.params.id, req.body);

      return res.status(200).json({
        success: true,
        message: 'Scenario updated successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteScenario(req, res, next) {
    try {
      const data = await scenarioService.deleteScenario(req.params.id);

      return res.status(200).json({
        success: true,
        message: 'Scenario deleted successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ScenarioController();