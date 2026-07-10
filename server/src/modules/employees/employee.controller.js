const employeeService = require('./employee.service');

class EmployeeController {
  async getEmployees(req, res, next) {
    try {
      const data = await employeeService.getEmployees(req.query);

      return res.status(200).json({  
        success: true,
        message: 'Employees fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getEmployeeById(req, res, next) {
    try {
      const data = await employeeService.getEmployeeById(req.params.id);

      return res.status(200).json({
        success: true,
        message: 'Employee fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async createEmployee(req, res, next) {
    try {
      const data = await employeeService.createEmployee(req.body);
      return res.status(201).json({
        success: true,
        message: 'Employee created successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateEmployee(req, res, next) {
    try {
      const data = await employeeService.updateEmployee(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Employee updated successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteEmployee(req, res, next) {
    try {
      const data = await employeeService.deleteEmployee(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Employee deleted successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getEmployeeStats(req, res, next) {
    try {
      const result = await employeeService.getEmployees({ limit: 1000 });
      const items = result.employees || [];
      const total = items.length;
      const active = items.filter(e => e.isActive).length;
      const totalSalary = items.reduce((sum, e) => sum + Number(e.salary || 0), 0);
      const avgSalary = total > 0 ? totalSalary / total : 0;

      return res.status(200).json({
        success: true,
        data: {
          total,
          active,
          totalSalary,
          avgSalary,
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EmployeeController();