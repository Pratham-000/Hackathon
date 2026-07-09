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
}

module.exports = new EmployeeController();