const mapPayroll = (payroll) => ({
  id: payroll.id,
  month: payroll.month,
  year: payroll.year,
  baseSalaryTotal:
    payroll.baseSalaryTotal !== null ? Number(payroll.baseSalaryTotal) : null,
  bonusTotal: payroll.bonusTotal !== null ? Number(payroll.bonusTotal) : null,
  deductionsTotal:
    payroll.deductionsTotal !== null ? Number(payroll.deductionsTotal) : null,
  netPayrollTotal:
    payroll.netPayrollTotal !== null ? Number(payroll.netPayrollTotal) : null,
  organizationId: payroll.organizationId,
  departmentId: payroll.departmentId,
  employeeId: payroll.employeeId,
  budgetId: payroll.budgetId,
  budgetVersionId: payroll.budgetVersionId,
  createdAt: payroll.createdAt,
  updatedAt: payroll.updatedAt,
  organization: payroll.organization
    ? {
        id: payroll.organization.id,
        name: payroll.organization.name,
        currency: payroll.organization.currency,
      }
    : null,
  department: payroll.department
    ? {
        id: payroll.department.id,
        name: payroll.department.name,
        code: payroll.department.code,
      }
    : null,
  employee: payroll.employee
    ? {
        id: payroll.employee.id,
        fullName: payroll.employee.fullName,
        employeeCode: payroll.employee.employeeCode,
        email: payroll.employee.email,
        salary: Number(payroll.employee.salary),
        bonus: payroll.employee.bonus !== null ? Number(payroll.employee.bonus) : null,
      }
    : null,
  budget: payroll.budget
    ? {
        id: payroll.budget.id,
        name: payroll.budget.name,
        fiscalYear: payroll.budget.fiscalYear,
        status: payroll.budget.status,
      }
    : null,
  budgetVersion: payroll.budgetVersion
    ? {
        id: payroll.budgetVersion.id,
        name: payroll.budgetVersion.name,
        versionNumber: payroll.budgetVersion.versionNumber,
        status: payroll.budgetVersion.status,
      }
    : null,
});

module.exports = { mapPayroll };