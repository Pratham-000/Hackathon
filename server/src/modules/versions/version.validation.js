const ALLOWED_STATUS = ['DRAFT', 'FINAL', 'LOCKED'];

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

const validateCreateVersion = (body) => {
  const {
    budgetId,
    versionNumber,
    name,
    notes,
    status,
    revenue,
    expenses,
    profit,
    createdById,
    assumptions,
  } = body;

  if (!budgetId) {
    const error = new Error('budgetId is required');
    error.statusCode = 400;
    throw error;
  }

  if (isNil(versionNumber)) {
    const error = new Error('versionNumber is required');
    error.statusCode = 400;
    throw error;
  }

  if (!name || typeof name !== 'string' || !name.trim()) {
    const error = new Error('name is required');
    error.statusCode = 400;
    throw error;
  }

  if (!createdById) {
    const error = new Error('createdById is required');
    error.statusCode = 400;
    throw error;
  }

  if (status && !ALLOWED_STATUS.includes(status)) {
    const error = new Error(`status must be one of: ${ALLOWED_STATUS.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  const payload = {
    budgetId,
    versionNumber: Number(versionNumber),
    name: name.trim(),
    notes: notes?.trim() || null,
    status: status || 'DRAFT',
    revenue: toNumber(revenue, 'revenue') ?? 0,
    expenses: toNumber(expenses, 'expenses') ?? 0,
    profit: toNumber(profit, 'profit') ?? 0,
    createdById,
  };

  if (assumptions !== undefined) {
    if (!Array.isArray(assumptions)) {
      const error = new Error('assumptions must be an array');
      error.statusCode = 400;
      throw error;
    }

    payload.assumptions = assumptions.map((item, index) => {
      if (!item.name) {
        const error = new Error(`assumptions[${index}].name is required`);
        error.statusCode = 400;
        throw error;
      }
      if (!item.type) {
        const error = new Error(`assumptions[${index}].type is required`);
        error.statusCode = 400;
        throw error;
      }
      if (isNil(item.value)) {
        const error = new Error(`assumptions[${index}].value is required`);
        error.statusCode = 400;
        throw error;
      }

      return {
        name: item.name,
        type: item.type,
        value: Number(item.value),
        unit: item.unit || null,
        description: item.description || null,
      };
    });
  }

  return payload;
};

const validateUpdateVersion = (body) => {
  const payload = {};

  if ('budgetId' in body) {
    payload.budgetId = body.budgetId;
  }

  if ('versionNumber' in body) {
    payload.versionNumber = Number(body.versionNumber);
  }

  if ('name' in body) {
    if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
      const error = new Error('name must be a non-empty string');
      error.statusCode = 400;
      throw error;
    }
    payload.name = body.name.trim();
  }

  if ('notes' in body) {
    payload.notes = body.notes?.trim() || null;
  }

  if ('status' in body) {
    if (!ALLOWED_STATUS.includes(body.status)) {
      const error = new Error(`status must be one of: ${ALLOWED_STATUS.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }
    payload.status = body.status;
  }

  if ('revenue' in body) {
    payload.revenue = toNumber(body.revenue, 'revenue');
  }

  if ('expenses' in body) {
    payload.expenses = toNumber(body.expenses, 'expenses');
  }

  if ('profit' in body) {
    payload.profit = toNumber(body.profit, 'profit');
  }

  if ('createdById' in body) {
    payload.createdById = body.createdById;
  }

  if (Object.keys(payload).length === 0) {
    const error = new Error('At least one field is required to update version');
    error.statusCode = 400;
    throw error;
  }

  return payload;
};

module.exports = {
  validateCreateVersion,
  validateUpdateVersion,
};