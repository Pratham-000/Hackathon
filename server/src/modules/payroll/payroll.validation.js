const isNil = (value) => value === undefined || value === null;

const toNumber = (value, fieldName) => {
  if (isNil(value) || value === '') return null;

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    const error = new Error(`${fieldName} must be a valid number`);
    error.statusCode = 400;
    throw error;
  }

  return parsed;
};

const toInteger = (value, fieldName) => {
  if (isNil(value) || value === '') return null;

  const parsed = Number(value);

  if (!Number.isInteger(parsed)) {
    const error = new Error(`${fieldName} must be a valid integer`);
    error.statusCode = 400;
    throw error;
  }

  return parsed;
};

const validateMonthYear = (month, year) => {
  if (month < 1 || month > 12) {
    const error = new Error('month must be between 1 and 12');
    error.statusCode = 400;
    throw error;
  }

  if (year < 2000 || year > 2100) {
    const error = new Error('year must be between 2000 and 2100');
    error.statusCode = 400;
    throw error;
  }
};

const validateCreatePayroll = (body) => {
  const {
    month,
    year,
    baseSalaryTotal,
    bonusTotal,
    deductionsTotal,
    netPayrollTotal,
    organizationId,
    departmentId,
    employeeId,
    budgetId,
    budgetVersionId,
  } = body;

  const parsedMonth = toInteger(month, 'month');
  const parsedYear = toInteger(year, 'year');

  if (parsedMonth === null) {
    const error = new Error('month is required');
    error.statusCode = 400;
    throw error;
  }

  if (parsedYear === null) {
    const error = new Error('year is required');
    error.statusCode = 400;
    throw error;
  }

  validateMonthYear(parsedMonth, parsedYear);

  if (!organizationId || typeof organizationId !== 'string') {
    const error = new Error('organizationId is required');
    error.statusCode = 400;
    throw error;
  }

  return {
    month: parsedMonth,
    year: parsedYear,
    baseSalaryTotal: toNumber(baseSalaryTotal, 'baseSalaryTotal') ?? 0,
    bonusTotal: toNumber(bonusTotal, 'bonusTotal') ?? 0,
    deductionsTotal: toNumber(deductionsTotal, 'deductionsTotal') ?? 0,
    netPayrollTotal: toNumber(netPayrollTotal, 'netPayrollTotal') ?? 0,
    organizationId,
    departmentId: departmentId || null,
    employeeId: employeeId || null,
    budgetId: budgetId || null,
    budgetVersionId: budgetVersionId || null,
  };
};

const validateUpdatePayroll = (body) => {
  const payload = {};

  if ('month' in body) {
    const parsedMonth = toInteger(body.month, 'month');
    if (parsedMonth < 1 || parsedMonth > 12) {
      const error = new Error('month must be between 1 and 12');
      error.statusCode = 400;
      throw error;
    }
    payload.month = parsedMonth;
  }

  if ('year' in body) {
    const parsedYear = toInteger(body.year, 'year');
    if (parsedYear < 2000 || parsedYear > 2100) {
      const error = new Error('year must be between 2000 and 2100');
      error.statusCode = 400;
      throw error;
    }
    payload.year = parsedYear;
  }

  if ('baseSalaryTotal' in body) {
    payload.baseSalaryTotal = toNumber(body.baseSalaryTotal, 'baseSalaryTotal');
  }

  if ('bonusTotal' in body) {
    payload.bonusTotal = toNumber(body.bonusTotal, 'bonusTotal');
  }

  if ('deductionsTotal' in body) {
    payload.deductionsTotal = toNumber(body.deductionsTotal, 'deductionsTotal');
  }

  if ('netPayrollTotal' in body) {
    payload.netPayrollTotal = toNumber(body.netPayrollTotal, 'netPayrollTotal');
  }

  if ('organizationId' in body) payload.organizationId = body.organizationId;
  if ('departmentId' in body) payload.departmentId = body.departmentId || null;
  if ('employeeId' in body) payload.employeeId = body.employeeId || null;
  if ('budgetId' in body) payload.budgetId = body.budgetId || null;
  if ('budgetVersionId' in body) payload.budgetVersionId = body.budgetVersionId || null;

  if (Object.keys(payload).length === 0) {
    const error = new Error('At least one field is required to update payroll');
    error.statusCode = 400;
    throw error;
  }

  return payload;
};

module.exports = {
  validateCreatePayroll,
  validateUpdatePayroll,
};