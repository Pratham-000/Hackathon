const ALLOWED_STATUS = ['DRAFT', 'ACTIVE', 'ARCHIVED'];

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

const validateCreateBudget = (body) => {
  const {
    name,
    description,
    totalRevenue,
    totalExpenses,
    totalProfit,
    status,
    fiscalYear,
    organizationId,
    departmentId,
    createdById,
  } = body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    const error = new Error('name is required');
    error.statusCode = 400;
    throw error;
  }

  if (isNil(totalRevenue)) {
    const error = new Error('totalRevenue is required');
    error.statusCode = 400;
    throw error;
  }

  if (isNil(totalExpenses)) {
    const error = new Error('totalExpenses is required');
    error.statusCode = 400;
    throw error;
  }

  if (isNil(totalProfit)) {
    const error = new Error('totalProfit is required');
    error.statusCode = 400;
    throw error;
  }

  if (isNil(fiscalYear)) {
    const error = new Error('fiscalYear is required');
    error.statusCode = 400;
    throw error;
  }

  if (!organizationId || typeof organizationId !== 'string') {
    const error = new Error('organizationId is required');
    error.statusCode = 400;
    throw error;
  }

  if (!createdById || typeof createdById !== 'string') {
    const error = new Error('createdById is required');
    error.statusCode = 400;
    throw error;
  }

  if (status && !ALLOWED_STATUS.includes(status)) {
    const error = new Error(`status must be one of: ${ALLOWED_STATUS.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  return {
    name: name.trim(),
    description: description?.trim() || null,
    totalRevenue: toNumber(totalRevenue, 'totalRevenue'),
    totalExpenses: toNumber(totalExpenses, 'totalExpenses'),
    totalProfit: toNumber(totalProfit, 'totalProfit'),
    status: status || 'DRAFT',
    fiscalYear: toNumber(fiscalYear, 'fiscalYear'),
    organizationId,
    departmentId: departmentId || null,
    createdById,
  };
};

const validateUpdateBudget = (body) => {
  const payload = {};

  if ('name' in body) {
    if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
      const error = new Error('name must be a non-empty string');
      error.statusCode = 400;
      throw error;
    }
    payload.name = body.name.trim();
  }

  if ('description' in body) {
    payload.description = body.description?.trim() || null;
  }

  if ('totalRevenue' in body) {
    payload.totalRevenue = toNumber(body.totalRevenue, 'totalRevenue');
  }

  if ('totalExpenses' in body) {
    payload.totalExpenses = toNumber(body.totalExpenses, 'totalExpenses');
  }

  if ('totalProfit' in body) {
    payload.totalProfit = toNumber(body.totalProfit, 'totalProfit');
  }

  if ('fiscalYear' in body) {
    payload.fiscalYear = toNumber(body.fiscalYear, 'fiscalYear');
  }

  if ('status' in body) {
    if (!ALLOWED_STATUS.includes(body.status)) {
      const error = new Error(`status must be one of: ${ALLOWED_STATUS.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }
    payload.status = body.status;
  }

  if ('organizationId' in body) {
    if (!body.organizationId || typeof body.organizationId !== 'string') {
      const error = new Error('organizationId must be a valid string');
      error.statusCode = 400;
      throw error;
    }
    payload.organizationId = body.organizationId;
  }

  if ('departmentId' in body) {
    payload.departmentId = body.departmentId || null;
  }

  if ('createdById' in body) {
    if (!body.createdById || typeof body.createdById !== 'string') {
      const error = new Error('createdById must be a valid string');
      error.statusCode = 400;
      throw error;
    }
    payload.createdById = body.createdById;
  }

  if (Object.keys(payload).length === 0) {
    const error = new Error('At least one field is required to update budget');
    error.statusCode = 400;
    throw error;
  }

  return payload;
};

module.exports = {
  validateCreateBudget,
  validateUpdateBudget,
};