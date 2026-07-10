const employeeRepository = require('./employee.repository');
const prisma = require('../../config/db');
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

  async createEmployee(body) {
    if (!body.fullName || !body.departmentId || !body.roleId) {
      const error = new Error('fullName, departmentId, and roleId are required');
      error.statusCode = 400;
      throw error;
    }

    let organizationId = body.organizationId;
    if (!organizationId || organizationId === 'org-id') {
      const org = await prisma.organization.findFirst();
      if (org) {
        organizationId = org.id;
      }
    }

    const payload = {
      fullName: body.fullName,
      employeeCode: body.employeeCode || `EMP-${Date.now().toString().slice(-6)}`,
      email: body.email || null,
      salary: Number(body.salary || 0),
      bonus: Number(body.bonus || 0),
      experienceYears: Number(body.experienceYears || 0),
      performanceScore: Number(body.performanceScore || 5.0),
      workloadScore: Number(body.workloadScore || 5.0),
      isActive: body.isActive !== false,
      hiredAt: body.hiredAt ? new Date(body.hiredAt) : new Date(),
      organizationId,
      departmentId: body.departmentId,
      roleId: body.roleId,
    };

    const employee = await employeeRepository.create(payload);
    return mapEmployee(employee);
  }

  async updateEmployee(id, body) {
    if (!id) {
      const error = new Error('Employee id is required');
      error.statusCode = 400;
      throw error;
    }

    const payload = {};
    if ('fullName' in body) payload.fullName = body.fullName;
    if ('employeeCode' in body) payload.employeeCode = body.employeeCode;
    if ('email' in body) payload.email = body.email;
    if ('salary' in body) payload.salary = Number(body.salary);
    if ('bonus' in body) payload.bonus = Number(body.bonus);
    if ('experienceYears' in body) payload.experienceYears = Number(body.experienceYears);
    if ('performanceScore' in body) payload.performanceScore = Number(body.performanceScore);
    if ('workloadScore' in body) payload.workloadScore = Number(body.workloadScore);
    if ('isActive' in body) payload.isActive = Boolean(body.isActive);
    if ('hiredAt' in body) payload.hiredAt = new Date(body.hiredAt);
    if ('departmentId' in body) payload.departmentId = body.departmentId;
    if ('roleId' in body) payload.roleId = body.roleId;

    try {
      const employee = await employeeRepository.update(id, payload);
      return mapEmployee(employee);
    } catch (error) {
      if (error.code === 'P2025') {
        const notFoundError = new Error('Employee not found');
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      throw error;
    }
  }

  async deleteEmployee(id) {
    if (!id) {
      const error = new Error('Employee id is required');
      error.statusCode = 400;
      throw error;
    }

    try {
      const employee = await employeeRepository.delete(id);
      return mapEmployee(employee);
    } catch (error) {
      if (error.code === 'P2025') {
        const notFoundError = new Error('Employee not found');
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      throw error;
    }
  }
}

module.exports = new EmployeeService();