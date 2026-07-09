const forecastRepository = require('./forecast.repository');
const { mapForecast } = require('./forecast.mapper');
const {
  validateCreateForecast,
  validateUpdateForecast,
} = require('./forecast.validation');

class ForecastService {
  async getForecasts(query) {
    const page = Number(query.page) > 0 ? Number(query.page) : 1;
    const limit = Number(query.limit) > 0 ? Number(query.limit) : 10;

    const filters = {
      organizationId: query.organizationId || null,
      departmentId: query.departmentId || null,
      budgetId: query.budgetId || null,
      budgetVersionId: query.budgetVersionId || null,
      scenarioId: query.scenarioId || null,
      period: query.period || null,
      page,
      limit,
    };

    const result = await forecastRepository.findAll(filters);

    return {
      forecasts: result.items.map(mapForecast),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  async getForecastById(id) {
    if (!id) {
      const error = new Error('Forecast id is required');
      error.statusCode = 400;
      throw error;
    }

    const forecast = await forecastRepository.findById(id);

    if (!forecast) {
      const error = new Error('Forecast not found');
      error.statusCode = 404;
      throw error;
    }

    return mapForecast(forecast);
  }

  async createForecast(body) {
    const payload = validateCreateForecast(body);
    const createdForecast = await forecastRepository.create(payload);
    return mapForecast(createdForecast);
  }

  async updateForecast(id, body) {
    if (!id) {
      const error = new Error('Forecast id is required');
      error.statusCode = 400;
      throw error;
    }

    const payload = validateUpdateForecast(body);

    try {
      const updatedForecast = await forecastRepository.update(id, payload);
      return mapForecast(updatedForecast);
    } catch (error) {
      if (error.code === 'P2025') {
        const notFoundError = new Error('Forecast not found');
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      throw error;
    }
  }

  async deleteForecast(id) {
    if (!id) {
      const error = new Error('Forecast id is required');
      error.statusCode = 400;
      throw error;
    }

    try {
      const deletedForecast = await forecastRepository.delete(id);
      return mapForecast(deletedForecast);
    } catch (error) {
      if (error.code === 'P2025') {
        const notFoundError = new Error('Forecast not found');
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      throw error;
    }
  }
}

module.exports = new ForecastService();