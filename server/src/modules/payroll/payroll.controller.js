const payrollService = require('./payroll.service');

class PayrollController {
  async getPayrolls(req, res, next) {
    try {
      const data = await payrollService.getPayrolls(req.query);

      return res.status(200).json({
        success: true,
        message: 'Payrolls fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPayrollById(req, res, next) {
    try {
      const data = await payrollService.getPayrollById(req.params.id);

      return res.status(200).json({
        success: true,
        message: 'Payroll fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async createPayroll(req, res, next) {
    try {
      const data = await payrollService.createPayroll(req.body);

      return res.status(201).json({
        success: true,
        message: 'Payroll created successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePayroll(req, res, next) {
    try {
      const data = await payrollService.updatePayroll(req.params.id, req.body);

      return res.status(200).json({
        success: true,
        message: 'Payroll updated successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePayroll(req, res, next) {
    try {
      const data = await payrollService.deletePayroll(req.params.id);

      return res.status(200).json({
        success: true,
        message: 'Payroll deleted successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PayrollController();