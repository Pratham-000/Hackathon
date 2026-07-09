const payrollRepository = require('./payroll.repository');
const { mapPayroll } = require('./payroll.mapper');
const {
  validateCreatePayroll,
  validateUpdatePayroll,
} = require('./payroll.validation');

class PayrollService {
  async getPayrolls(query) {
    const page = Number(query.page) > 0 ? Number(query.page) : 1;
    const limit = Number(query.limit) > 0 ? Number(query.limit) : 10;

    const filters = {
      organizationId: query.organizationId || null,
      departmentId: query.departmentId || null,
      employeeId: query.employeeId || null,
      budgetId: query.budgetId || null,
      budgetVersionId: query.budgetVersionId || null,
      month: query.month ? Number(query.month) : null,
      year: query.year ? Number(query.year) : null,
      page,
      limit,
    };

    const result = await payrollRepository.findAll(filters);

    return {
      payrolls: result.items.map(mapPayroll),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  async getPayrollById(id) {
    if (!id) {
      const error = new Error('Payroll id is required');
      error.statusCode = 400;
      throw error;
    }

    const payroll = await payrollRepository.findById(id);

    if (!payroll) {
      const error = new Error('Payroll not found');
      error.statusCode = 404;
      throw error;
    }

    return mapPayroll(payroll);
  }

  async createPayroll(body) {
    const payload = validateCreatePayroll(body);
    const createdPayroll = await payrollRepository.create(payload);
    return mapPayroll(createdPayroll);
  }

  async updatePayroll(id, body) {
    if (!id) {
      const error = new Error('Payroll id is required');
      error.statusCode = 400;
      throw error;
    }

    const payload = validateUpdatePayroll(body);

    try {
      const updatedPayroll = await payrollRepository.update(id, payload);
      return mapPayroll(updatedPayroll);
    } catch (error) {
      if (error.code === 'P2025') {
        const notFoundError = new Error('Payroll not found');
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      throw error;
    }
  }

  async deletePayroll(id) {
    if (!id) {
      const error = new Error('Payroll id is required');
      error.statusCode = 400;
      throw error;
    }

    try {
      const deletedPayroll = await payrollRepository.delete(id);
      return mapPayroll(deletedPayroll);
    } catch (error) {
      if (error.code === 'P2025') {
        const notFoundError = new Error('Payroll not found');
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      throw error;
    }
  }
}

module.exports = new PayrollService();