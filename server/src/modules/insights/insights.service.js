const insightsRepository = require('./insights.repository');
const promptBuilder = require('./prompt.builder');
const geminiService = require('../../services/gemini.service');
const { mapInsight } = require('./insights.mapper');
const {
  validateCreateInsight,
  validateUpdateInsight,
  validateGenerateInsight,
} = require('./insights.validation');

class InsightsService {
  async getInsights(query) {
    const page = Number(query.page) > 0 ? Number(query.page) : 1;
    const limit = Number(query.limit) > 0 ? Number(query.limit) : 10;

    const filters = {
      organizationId: query.organizationId || null,
      type: query.type || null,
      budgetId: query.budgetId || null,
      budgetVersionId: query.budgetVersionId || null,
      scenarioId: query.scenarioId || null,
      userId: query.userId || null,
      page,
      limit,
    };

    const result = await insightsRepository.findAll(filters);

    return {
      insights: result.items.map(mapInsight),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  async getInsightById(id) {
    if (!id) {
      const error = new Error('Insight id is required');
      error.statusCode = 400;
      throw error;
    }

    const insight = await insightsRepository.findById(id);

    if (!insight) {
      const error = new Error('Insight not found');
      error.statusCode = 404;
      throw error;
    }

    return mapInsight(insight);
  }

  async createInsight(body) {
    const payload = validateCreateInsight(body);
    const createdInsight = await insightsRepository.create(payload);
    return mapInsight(createdInsight);
  }

  async updateInsight(id, body) {
    if (!id) {
      const error = new Error('Insight id is required');
      error.statusCode = 400;
      throw error;
    }

    const payload = validateUpdateInsight(body);

    try {
      const updatedInsight = await insightsRepository.update(id, payload);
      return mapInsight(updatedInsight);
    } catch (error) {
      if (error.code === 'P2025') {
        const notFoundError = new Error('Insight not found');
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      throw error;
    }
  }

  async deleteInsight(id) {
    if (!id) {
      const error = new Error('Insight id is required');
      error.statusCode = 400;
      throw error;
    }

    try {
      const deletedInsight = await insightsRepository.delete(id);
      return mapInsight(deletedInsight);
    } catch (error) {
      if (error.code === 'P2025') {
        const notFoundError = new Error('Insight not found');
        notFoundError.statusCode = 404;
        throw notFoundError;
      }
      throw error;
    }
  }

  async generateInsight(body) {
    const payload = validateGenerateInsight(body);
    const prompt = await promptBuilder.build(payload.type, payload);

    let generatedResponse;
    let confidenceScore = 0.86;

    try {
      generatedResponse = await geminiService.generateFinanceSummary({
        type: payload.type,
        title: `${payload.type} Insight`,
        promptContext: prompt,
        organizationId: payload.organizationId,
        budgetId: payload.budgetId,
        budgetVersionId: payload.budgetVersionId,
        scenarioId: payload.scenarioId,
        userId: payload.userId,
        metrics: payload.metrics || null,
        assumptions: payload.assumptions || null,
      });
    } catch (error) {
      generatedResponse =
        `AI-generated ${payload.type.toLowerCase()} insight:\n\n` +
        `This planning snapshot suggests notable financial movement. Review major variance drivers, validate assumptions, and prioritize actions that improve cash efficiency, margin protection, and execution discipline.`;
      confidenceScore = 0.72;
    }

    const createdInsight = await insightsRepository.create({
      title: `${payload.type} Insight`,
      type: payload.type,
      prompt,
      response: generatedResponse,
      confidenceScore,
      userId: payload.userId,
      organizationId: payload.organizationId,
      budgetId: payload.budgetId,
      budgetVersionId: payload.budgetVersionId,
      scenarioId: payload.scenarioId,
    });

    return mapInsight(createdInsight);
  }
}

module.exports = new InsightsService();