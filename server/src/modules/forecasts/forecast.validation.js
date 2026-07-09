const ALLOWED_PERIODS = ['MONTHLY', 'QUARTERLY', 'YEARLY'];

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

const toDate = (value, fieldName) => {
  if (!value) {
    const error = new Error(`${fieldName} is required`);
    error.statusCode = 400;
    throw error;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    const error = new Error(`${fieldName} must be a valid date`);
    error.statusCode = 400;
    throw error;
  }

  return parsed;
};

const validateCreateForecast = (body) => {
  const {
    title,
    period,
    startDate,
    endDate,
    projectedRevenue,
    projectedExpenses,
    projectedProfit,
    projectedHeadcount,
    projectedPayroll,
    organizationId,
    departmentId,
    budgetId,
    budgetVersionId,
    scenarioId,
  } = body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    const error = new Error('title is required');
    error.statusCode = 400;
    throw error;
  }

  if (!period || !ALLOWED_PERIODS.includes(period)) {
    const error = new Error(`period must be one of: ${ALLOWED_PERIODS.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  if (!organizationId || typeof organizationId !== 'string') {
    const error = new Error('organizationId is required');
    error.statusCode = 400;
    throw error;
  }

  const parsedStartDate = toDate(startDate, 'startDate');
  const parsedEndDate = toDate(endDate, 'endDate');

  if (parsedStartDate > parsedEndDate) {
    const error = new Error('startDate cannot be after endDate');
    error.statusCode = 400;
    throw error;
  }

  return {
    title: title.trim(),
    period,
    startDate: parsedStartDate,
    endDate: parsedEndDate,
    projectedRevenue: toNumber(projectedRevenue, 'projectedRevenue') ?? 0,
    projectedExpenses: toNumber(projectedExpenses, 'projectedExpenses') ?? 0,
    projectedProfit: toNumber(projectedProfit, 'projectedProfit') ?? 0,
    projectedHeadcount: projectedHeadcount !== undefined ? Number(projectedHeadcount) : null,
    projectedPayroll: toNumber(projectedPayroll, 'projectedPayroll'),
    organizationId,
    departmentId: departmentId || null,
    budgetId: budgetId || null,
    budgetVersionId: budgetVersionId || null,
    scenarioId: scenarioId || null,
  };
};

const validateUpdateForecast = (body) => {
  const payload = {};

  if ('title' in body) {
    if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
      const error = new Error('title must be a non-empty string');
      error.statusCode = 400;
      throw error;
    }
    payload.title = body.title.trim();
  }

  if ('period' in body) {
    if (!ALLOWED_PERIODS.includes(body.period)) {
      const error = new Error(`period must be one of: ${ALLOWED_PERIODS.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }
    payload.period = body.period;
  }

  if ('startDate' in body) {
    payload.startDate = toDate(body.startDate, 'startDate');
  }

  if ('endDate' in body) {
    payload.endDate = toDate(body.endDate, 'endDate');
  }

  if (payload.startDate && payload.endDate && payload.startDate > payload.endDate) {
    const error = new Error('startDate cannot be after endDate');
    error.statusCode = 400;
    throw error;
  }

  if ('projectedRevenue' in body) {
    payload.projectedRevenue = toNumber(body.projectedRevenue, 'projectedRevenue');
  }

  if ('projectedExpenses' in body) {
    payload.projectedExpenses = toNumber(body.projectedExpenses, 'projectedExpenses');
  }

  if ('projectedProfit' in body) {
    payload.projectedProfit = toNumber(body.projectedProfit, 'projectedProfit');
  }

  if ('projectedHeadcount' in body) {
    const parsed = Number(body.projectedHeadcount);

    if (Number.isNaN(parsed)) {
      const error = new Error('projectedHeadcount must be a valid number');
      error.statusCode = 400;
      throw error;
    }

    payload.projectedHeadcount = parsed;
  }

  if ('projectedPayroll' in body) {
    payload.projectedPayroll = toNumber(body.projectedPayroll, 'projectedPayroll');
  }

  if ('organizationId' in body) payload.organizationId = body.organizationId;
  if ('departmentId' in body) payload.departmentId = body.departmentId || null;
  if ('budgetId' in body) payload.budgetId = body.budgetId || null;
  if ('budgetVersionId' in body) payload.budgetVersionId = body.budgetVersionId || null;
  if ('scenarioId' in body) payload.scenarioId = body.scenarioId || null;

  if (Object.keys(payload).length === 0) {
    const error = new Error('At least one field is required to update forecast');
    error.statusCode = 400;
    throw error;
  }

  return payload;
};

module.exports = {
  validateCreateForecast,
  validateUpdateForecast,
};