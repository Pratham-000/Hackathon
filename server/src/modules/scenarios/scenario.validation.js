const ALLOWED_TYPES = ['BASELINE', 'BEST_CASE', 'WORST_CASE', 'CUSTOM'];

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

const validateScenarioResult = (item, index) => {
  if (!item.metricName) {
    const error = new Error(`scenarioResults[${index}].metricName is required`);
    error.statusCode = 400;
    throw error;
  }

  if (isNil(item.metricValue)) {
    const error = new Error(`scenarioResults[${index}].metricValue is required`);
    error.statusCode = 400;
    throw error;
  }

  return {
    metricName: item.metricName,
    metricValue: Number(item.metricValue),
    metricUnit: item.metricUnit || null,
    changePercent: item.changePercent !== undefined ? Number(item.changePercent) : null,
    notes: item.notes || null,
  };
};

const validateCreateScenario = (body) => {
  const {
    name,
    description,
    type,
    budgetId,
    budgetVersionId,
    organizationId,
    createdById,
    revenueImpact,
    expenseImpact,
    profitImpact,
    payrollImpact,
    assumptionIds,
    scenarioResults,
  } = body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    const error = new Error('name is required');
    error.statusCode = 400;
    throw error;
  }

  if (!budgetId) {
    const error = new Error('budgetId is required');
    error.statusCode = 400;
    throw error;
  }

  if (!budgetVersionId) {
    const error = new Error('budgetVersionId is required');
    error.statusCode = 400;
    throw error;
  }

  if (!organizationId) {
    const error = new Error('organizationId is required');
    error.statusCode = 400;
    throw error;
  }

  if (!createdById) {
    const error = new Error('createdById is required');
    error.statusCode = 400;
    throw error;
  }

  if (type && !ALLOWED_TYPES.includes(type)) {
    const error = new Error(`type must be one of: ${ALLOWED_TYPES.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  if (assumptionIds !== undefined && !Array.isArray(assumptionIds)) {
    const error = new Error('assumptionIds must be an array');
    error.statusCode = 400;
    throw error;
  }

  if (scenarioResults !== undefined && !Array.isArray(scenarioResults)) {
    const error = new Error('scenarioResults must be an array');
    error.statusCode = 400;
    throw error;
  }

  return {
    name: name.trim(),
    description: description?.trim() || null,
    type: type || 'CUSTOM',
    budgetId,
    budgetVersionId,
    organizationId,
    createdById,
    revenueImpact: toNumber(revenueImpact, 'revenueImpact'),
    expenseImpact: toNumber(expenseImpact, 'expenseImpact'),
    profitImpact: toNumber(profitImpact, 'profitImpact'),
    payrollImpact: toNumber(payrollImpact, 'payrollImpact'),
    assumptionIds: assumptionIds || [],
    scenarioResults: scenarioResults ? scenarioResults.map(validateScenarioResult) : [],
  };
};

const validateUpdateScenario = (body) => {
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

  if ('type' in body) {
    if (!ALLOWED_TYPES.includes(body.type)) {
      const error = new Error(`type must be one of: ${ALLOWED_TYPES.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }
    payload.type = body.type;
  }

  if ('budgetId' in body) payload.budgetId = body.budgetId;
  if ('budgetVersionId' in body) payload.budgetVersionId = body.budgetVersionId;
  if ('organizationId' in body) payload.organizationId = body.organizationId;
  if ('createdById' in body) payload.createdById = body.createdById;
  if ('revenueImpact' in body) payload.revenueImpact = toNumber(body.revenueImpact, 'revenueImpact');
  if ('expenseImpact' in body) payload.expenseImpact = toNumber(body.expenseImpact, 'expenseImpact');
  if ('profitImpact' in body) payload.profitImpact = toNumber(body.profitImpact, 'profitImpact');
  if ('payrollImpact' in body) payload.payrollImpact = toNumber(body.payrollImpact, 'payrollImpact');

  if (Object.keys(payload).length === 0) {
    const error = new Error('At least one field is required to update scenario');
    error.statusCode = 400;
    throw error;
  }

  return payload;
};

module.exports = {
  validateCreateScenario,
  validateUpdateScenario,
};