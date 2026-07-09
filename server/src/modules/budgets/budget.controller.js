const budgetService = require('./budget.service');

class BudgetController {
  async getBudgets(req, res, next) {
    try {
      const data = await budgetService.getBudgets(req.query);

      return res.status(200).json({
        success: true,
        message: 'Budgets fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBudgetById(req, res, next) {
    try {
      const data = await budgetService.getBudgetById(req.params.id);

      return res.status(200).json({
        success: true,
        message: 'Budget fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async createBudget(req, res, next) {
    try {
      const data = await budgetService.createBudget(req.body);

      return res.status(201).json({
        success: true,
        message: 'Budget created successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateBudget(req, res, next) {
    try {
      const data = await budgetService.updateBudget(req.params.id, req.body);

      return res.status(200).json({
        success: true,
        message: 'Budget updated successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteBudget(req, res, next) {
    try {
      const data = await budgetService.deleteBudget(req.params.id);

      return res.status(200).json({
        success: true,
        message: 'Budget deleted successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BudgetController();