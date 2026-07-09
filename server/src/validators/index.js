const { z } = require('zod');
const {
  USER_ROLES,
  SCENARIO_TYPES,
  ASSUMPTION_TYPES,
  FORECAST_PERIODS,
  BUDGET_STATUS,
  VERSION_STATUS,
  INSIGHT_TYPES,
} = require('../types');

const uuid = z.uuid('Invalid UUID');

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

const idParamSchema = z.object({
  id: uuid,
});

const moneySchema = z.coerce.number().finite().nonnegative();

const signedPercentSchema = z.coerce.number().min(-100).max(100);

const emailSchema = z.email('Invalid email address').trim().toLowerCase();

const roleEnumSchema = z.enum(Object.values(USER_ROLES));
const scenarioTypeEnumSchema = z.enum(Object.values(SCENARIO_TYPES));
const assumptionTypeEnumSchema = z.enum(Object.values(ASSUMPTION_TYPES));
const forecastPeriodEnumSchema = z.enum(Object.values(FORECAST_PERIODS));
const budgetStatusEnumSchema = z.enum(Object.values(BUDGET_STATUS));
const versionStatusEnumSchema = z.enum(Object.values(VERSION_STATUS));
const insightTypeEnumSchema = z.enum(Object.values(INSIGHT_TYPES));

module.exports = {
  z,
  uuid,
  paginationSchema,
  idParamSchema,
  moneySchema,
  signedPercentSchema,
  emailSchema,
  roleEnumSchema,
  scenarioTypeEnumSchema,
  assumptionTypeEnumSchema,
  forecastPeriodEnumSchema,
  budgetStatusEnumSchema,
  versionStatusEnumSchema,
  insightTypeEnumSchema,
};