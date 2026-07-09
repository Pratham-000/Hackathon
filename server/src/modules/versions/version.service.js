const versionRepository = require('./version.repository');
const { mapVersion } = require('./version.mapper');
const {
  validateCreateVersion,
  validateUpdateVersion,
} = require('./version.validation');

class VersionService {
  async getVersions(query) {
    const page = Number(query.page) > 0 ? Number(query.page) : 1;
    const limit = Number(query.limit) > 0 ? Number(query.limit) : 10;

    const filters = {
      budgetId: query.budgetId || null,
      status: query.status || null,
      createdById: query.createdById || null,
      page,
      limit,
    };

    const result = await versionRepository.findAll(filters);

    return {
      versions: result.items.map(mapVersion),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  async getVersionById(id) {
    if (!id) {
      const error = new Error('Version id is required');
      error.statusCode = 400;
      throw error;
    }

    const version = await versionRepository.findById(id);

    if (!version) {
      const error = new Error('Version not found');
      error.statusCode = 404;
      throw error;
    }

    return mapVersion(version);
  }

  async createVersion(body) {
    const payload = validateCreateVersion(body);

    const existing = await versionRepository.findByBudgetAndVersionNumber(
      payload.budgetId,
      payload.versionNumber
    );

    if (existing) {
      const error = new Error('Version number already exists for this budget');
      error.statusCode = 409;
      throw error;
    }

    const createdVersion = await versionRepository.create({
      budgetId: payload.budgetId,
      versionNumber: payload.versionNumber,
      name: payload.name,
      notes: payload.notes,
      status: payload.status,
      revenue: payload.revenue,
      expenses: payload.expenses,
      profit: payload.profit,
      createdById: payload.createdById,
      ...(payload.assumptions
        ? {
            assumptions: {
              create: payload.assumptions,
            },
          }
        : {}),
    });

    return mapVersion(createdVersion);
  }

  async updateVersion(id, body) {
    if (!id) {
      const error = new Error('Version id is required');
      error.statusCode = 400;
      throw error;
    }

    const payload = validateUpdateVersion(body);

    try {
      const updatedVersion = await versionRepository.update(id, payload);
      return mapVersion(updatedVersion);
    } catch (error) {
      if (error.code === 'P2025') {
        const notFoundError = new Error('Version not found');
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      throw error;
    }
  }

  async deleteVersion(id) {
    if (!id) {
      const error = new Error('Version id is required');
      error.statusCode = 400;
      throw error;
    }

    try {
      const deletedVersion = await versionRepository.delete(id);
      return mapVersion(deletedVersion);
    } catch (error) {
      if (error.code === 'P2025') {
        const notFoundError = new Error('Version not found');
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      throw error;
    }
  }
}

module.exports = new VersionService();