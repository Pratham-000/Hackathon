const forecastService = require('./forecast.service');

class ForecastController {
  async getForecasts(req, res, next) {
    try {
      const data = await forecastService.getForecasts(req.query);

      return res.status(200).json({
        success: true,
        message: 'Forecasts fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getForecastById(req, res, next) {
    try {
      const data = await forecastService.getForecastById(req.params.id);

      return res.status(200).json({
        success: true,
        message: 'Forecast fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async createForecast(req, res, next) {
    try {
      const data = await forecastService.createForecast(req.body);

      return res.status(201).json({
        success: true,
        message: 'Forecast created successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateForecast(req, res, next) {
    try {
      const data = await forecastService.updateForecast(req.params.id, req.body);

      return res.status(200).json({
        success: true,
        message: 'Forecast updated successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteForecast(req, res, next) {
    try {
      const data = await forecastService.deleteForecast(req.params.id);

      return res.status(200).json({
        success: true,
        message: 'Forecast deleted successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ForecastController();