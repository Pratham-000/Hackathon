const ALLOWED_TYPES = [
  'REVENUE_GROWTH',
  'COST_GROWTH',
  'HEADCOUNT_CHANGE',
  'SALARY_INCREMENT',
  'ATTRITION_RATE',
  'BONUS_PERCENT',
  'CUSTOM',
];

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

const validateCreateAssumption = (body) => {
  const { name, type, value, unit, description, budgetVersionId } = body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    const error = new Error('name is required');
    error.statusCode = 400;
    throw error;
  }

  if (!type || !ALLOWED_TYPES.includes(type)) {
    const error = new Error(`type must be one of: ${ALLOWED_TYPES.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  if (isNil(value)) {
    const error = new Error('value is required');
    error.statusCode = 400;
    throw error;
  }

  if (!budgetVersionId || typeof budgetVersionId !== 'string') {
    const error = new Error('budgetVersionId is required');
    error.statusCode = 400;
    throw error;
  }

  return {
    name: name.trim(),
    type,
    value: toNumber(value, 'value'),
    unit: unit?.trim() || null,
    description: description?.trim() || null,
    budgetVersionId,
  };
};

const validateUpdateAssumption = (body) => {
  const payload = {};

  if ('name' in body) {
    if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
      const error = new Error('name must be a non-empty string');
      error.statusCode = 400;
      throw error;
    }
    payload.name = body.name.trim();
  }

  if ('type' in body) {
    if (!ALLOWED_TYPES.includes(body.type)) {
      const error = new Error(`type must be one of: ${ALLOWED_TYPES.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }
    payload.type = body.type;
  }

  if ('value' in body) {
    payload.value = toNumber(body.value, 'value');
  }

  if ('unit' in body) {
    payload.unit = body.unit?.trim() || null;
  }

  if ('description' in body) {
    payload.description = body.description?.trim() || null;
  }

  if ('budgetVersionId' in body) {
    if (!body.budgetVersionId || typeof body.budgetVersionId !== 'string') {
      const error = new Error('budgetVersionId must be a valid string');
      error.statusCode = 400;
      throw error;
    }
    payload.budgetVersionId = body.budgetVersionId;
  }

  if (Object.keys(payload).length === 0) {
    const error = new Error('At least one field is required to update assumption');
    error.statusCode = 400;
    throw error;
  }

  return payload;
};

module.exports = {
  validateCreateAssumption,
  validateUpdateAssumption,
};