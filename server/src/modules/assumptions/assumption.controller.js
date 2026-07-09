const assumptionService = require('./assumption.service');

class AssumptionController {
  async getAssumptions(req, res, next) {
    try {
      const data = await assumptionService.getAssumptions(req.query);

      return res.status(200).json({
        success: true,
        message: 'Assumptions fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAssumptionById(req, res, next) {
    try {
      const data = await assumptionService.getAssumptionById(req.params.id);

      return res.status(200).json({
        success: true,
        message: 'Assumption fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async createAssumption(req, res, next) {
    try {
      const data = await assumptionService.createAssumption(req.body);

      return res.status(201).json({
        success: true,
        message: 'Assumption created successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAssumption(req, res, next) {
    try {
      const data = await assumptionService.updateAssumption(req.params.id, req.body);

      return res.status(200).json({
        success: true,
        message: 'Assumption updated successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAssumption(req, res, next) {
    try {
      const data = await assumptionService.deleteAssumption(req.params.id);

      return res.status(200).json({
        success: true,
        message: 'Assumption deleted successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AssumptionController();