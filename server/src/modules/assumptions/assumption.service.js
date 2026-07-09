const assumptionRepository = require('./assumption.repository');
const { mapAssumption } = require('./assumption.mapper');
const {
  validateCreateAssumption,
  validateUpdateAssumption,
} = require('./assumption.validation');

class AssumptionService {
  async getAssumptions(query) {
    const page = Number(query.page) > 0 ? Number(query.page) : 1;
    const limit = Number(query.limit) > 0 ? Number(query.limit) : 10;

    const filters = {
      budgetVersionId: query.budgetVersionId || null,
      type: query.type || null,
      page,
      limit,
    };

    const result = await assumptionRepository.findAll(filters);

    return {
      assumptions: result.items.map(mapAssumption),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  async getAssumptionById(id) {
    if (!id) {
      const error = new Error('Assumption id is required');
      error.statusCode = 400;
      throw error;
    }

    const assumption = await assumptionRepository.findById(id);

    if (!assumption) {
      const error = new Error('Assumption not found');
      error.statusCode = 404;
      throw error;
    }

    return mapAssumption(assumption);
  }

  async createAssumption(body) {
    const payload = validateCreateAssumption(body);
    const createdAssumption = await assumptionRepository.create(payload);
    return mapAssumption(createdAssumption);
  }

  async updateAssumption(id, body) {
    if (!id) {
      const error = new Error('Assumption id is required');
      error.statusCode = 400;
      throw error;
    }

    const payload = validateUpdateAssumption(body);

    try {
      const updatedAssumption = await assumptionRepository.update(id, payload);
      return mapAssumption(updatedAssumption);
    } catch (error) {
      if (error.code === 'P2025') {
        const notFoundError = new Error('Assumption not found');
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      throw error;
    }
  }

  async deleteAssumption(id) {
    if (!id) {
      const error = new Error('Assumption id is required');
      error.statusCode = 400;
      throw error;
    }

    try {
      const deletedAssumption = await assumptionRepository.delete(id);
      return mapAssumption(deletedAssumption);
    } catch (error) {
      if (error.code === 'P2025') {
        const notFoundError = new Error('Assumption not found');
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      throw error;
    }
  }
}

module.exports = new AssumptionService();