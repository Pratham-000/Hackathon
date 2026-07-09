const ALLOWED_TYPES = [
  'BUDGET',
  'SCENARIO',
  'PAYROLL',
  'FORECAST',
  'WORKFORCE',
  'KPI',
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

const validateCreateInsight = (body) => {
  const {
    title,
    type,
    prompt,
    response,
    confidenceScore,
    userId,
    organizationId,
    budgetId,
    budgetVersionId,
    scenarioId,
  } = body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    const error = new Error('title is required');
    error.statusCode = 400;
    throw error;
  }

  if (!type || !ALLOWED_TYPES.includes(type)) {
    const error = new Error(`type must be one of: ${ALLOWED_TYPES.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  if (!response || typeof response !== 'string' || !response.trim()) {
    const error = new Error('response is required');
    error.statusCode = 400;
    throw error;
  }

  if (!organizationId || typeof organizationId !== 'string') {
    const error = new Error('organizationId is required');
    error.statusCode = 400;
    throw error;
  }

  return {
    title: title.trim(),
    type,
    prompt: prompt?.trim() || null,
    response: response.trim(),
    confidenceScore: toNumber(confidenceScore, 'confidenceScore'),
    userId: userId || null,
    organizationId,
    budgetId: budgetId || null,
    budgetVersionId: budgetVersionId || null,
    scenarioId: scenarioId || null,
  };
};

const validateUpdateInsight = (body) => {
  const payload = {};

  if ('title' in body) {
    if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
      const error = new Error('title must be a non-empty string');
      error.statusCode = 400;
      throw error;
    }
    payload.title = body.title.trim();
  }

  if ('type' in body) {
    if (!ALLOWED_TYPES.includes(body.type)) {
      const error = new Error(`type must be one of: ${ALLOWED_TYPES.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }
    payload.type = body.type;
  }

  if ('prompt' in body) payload.prompt = body.prompt?.trim() || null;

  if ('response' in body) {
    if (!body.response || typeof body.response !== 'string' || !body.response.trim()) {
      const error = new Error('response must be a non-empty string');
      error.statusCode = 400;
      throw error;
    }
    payload.response = body.response.trim();
  }

  if ('confidenceScore' in body) {
    payload.confidenceScore = toNumber(body.confidenceScore, 'confidenceScore');
  }

  if ('userId' in body) payload.userId = body.userId || null;
  if ('organizationId' in body) payload.organizationId = body.organizationId;
  if ('budgetId' in body) payload.budgetId = body.budgetId || null;
  if ('budgetVersionId' in body) payload.budgetVersionId = body.budgetVersionId || null;
  if ('scenarioId' in body) payload.scenarioId = body.scenarioId || null;

  if (Object.keys(payload).length === 0) {
    const error = new Error('At least one field is required to update insight');
    error.statusCode = 400;
    throw error;
  }

  return payload;
};

const validateGenerateInsight = (body) => {
  const { type, organizationId, budgetId, budgetVersionId, scenarioId, userId } = body;

  if (!type || !ALLOWED_TYPES.includes(type)) {
    const error = new Error(`type must be one of: ${ALLOWED_TYPES.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  if (!organizationId || typeof organizationId !== 'string') {
    const error = new Error('organizationId is required');
    error.statusCode = 400;
    throw error;
  }

  return {
    type,
    organizationId,
    budgetId: budgetId || null,
    budgetVersionId: budgetVersionId || null,
    scenarioId: scenarioId || null,
    userId: userId || null,
  };
};

module.exports = {
  validateCreateInsight,
  validateUpdateInsight,
  validateGenerateInsight,
};