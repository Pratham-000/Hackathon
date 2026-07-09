const budgetRepository = require('./budget.repository');
const { mapBudget } = require('./budget.mapper');
const {
  validateCreateBudget,
  validateUpdateBudget,
} = require('./budget.validation');

class BudgetService {
  async getBudgets(query) {
    const page = Number(query.page) > 0 ? Number(query.page) : 1;
    const limit = Number(query.limit) > 0 ? Number(query.limit) : 10;

    const filters = {
      search: query.search?.trim() || '',
      status: query.status || null,
      organizationId: query.organizationId || null,
      departmentId: query.departmentId || null,
      fiscalYear: query.fiscalYear ? Number(query.fiscalYear) : null,
      page,
      limit,
    };

    const result = await budgetRepository.findAll(filters);

    return {
      budgets: result.items.map(mapBudget),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  async getBudgetById(id) {
    if (!id) {
      const error = new Error('Budget id is required');
      error.statusCode = 400;
      throw error;
    }

    const budget = await budgetRepository.findById(id);

    if (!budget) {
      const error = new Error('Budget not found');
      error.statusCode = 404;
      throw error;
    }

    return mapBudget(budget);
  }

  async createBudget(body) {
    const payload = validateCreateBudget(body);
    const createdBudget = await budgetRepository.create(payload);
    return mapBudget(createdBudget);
  }

  async updateBudget(id, body) {
    if (!id) {
      const error = new Error('Budget id is required');
      error.statusCode = 400;
      throw error;
    }

    const payload = validateUpdateBudget(body);

    try {
      const updatedBudget = await budgetRepository.update(id, payload);
      return mapBudget(updatedBudget);
    } catch (error) {
      if (error.code === 'P2025') {
        const notFoundError = new Error('Budget not found');
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      throw error;
    }
  }

  async deleteBudget(id) {
    if (!id) {
      const error = new Error('Budget id is required');
      error.statusCode = 400;
      throw error;
    }

    try {
      const deletedBudget = await budgetRepository.delete(id);
      return mapBudget(deletedBudget);
    } catch (error) {
      if (error.code === 'P2025') {
        const notFoundError = new Error('Budget not found');
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      throw error;
    }
  }
}

module.exports = new BudgetService();