const employeeRepository = require('./employee.repository');
const { mapEmployee } = require('./employee.mapper');

class EmployeeService {
  async getEmployees(query) {
    const page = Number(query.page) > 0 ? Number(query.page) : 1;
    const limit = Number(query.limit) > 0 ? Number(query.limit) : 10;

    const filters = {
      search: query.search?.trim() || '',
      departmentId: query.departmentId || null,
      roleId: query.roleId || null,
      isActive:
        query.isActive === 'true'
          ? true
          : query.isActive === 'false'
          ? false
          : undefined,
      page,
      limit,
    };

    const result = await employeeRepository.findAll(filters);

    return {
      employees: result.items.map(mapEmployee),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  async getEmployeeById(id) {
    if (!id) {
      const error = new Error('Employee id is required');
      error.statusCode = 400;
      throw error;
    }

    const employee = await employeeRepository.findById(id);

    if (!employee) {
      const error = new Error('Employee not found');
      error.statusCode = 404;
      throw error;
    }

    return mapEmployee(employee);
  }
}

module.exports = new EmployeeService();