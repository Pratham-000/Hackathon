const { calculateKpis } = require('./calculation.engine');
const { round2 } = require('../utils/calculations');

function applyScenario(base, assumptions = {}) {
  const revenueChangePct = Number(assumptions.revenueChangePct || 0);
  const payrollChangePct = Number(assumptions.payrollChangePct || 0);
  const opexChangePct = Number(assumptions.opexChangePct || 0);

  const adjusted = {
    revenue: (Number(base.revenue || 0) * (1 + revenueChangePct / 100)),
    payroll: assumptions.hiringFreeze
      ? Number(base.payroll || 0)
      : (Number(base.payroll || 0) * (1 + payrollChangePct / 100)),
    opex: (Number(base.opex || 0) * (1 + opexChangePct / 100)),
    cash: Number(base.cash || 0),
  };

  const baseKpis = calculateKpis(base);
  const scenarioKpis = calculateKpis(adjusted);

  return {
    assumptions,
    adjusted: {
      revenue: round2(adjusted.revenue),
      payroll: round2(adjusted.payroll),
      opex: round2(adjusted.opex),
      cash: round2(adjusted.cash),
    },
    baseKpis,
    kpis: scenarioKpis,
    deltas: {
      revenue: round2(scenarioKpis.revenue - baseKpis.revenue),
      payroll: round2(scenarioKpis.payroll - baseKpis.payroll),
      totalExpense: round2(scenarioKpis.totalExpense - baseKpis.totalExpense),
      operatingResult: round2(scenarioKpis.operatingResult - baseKpis.operatingResult),
      netBurn: round2(scenarioKpis.netBurn - baseKpis.netBurn),
      runwayMonths:
        scenarioKpis.runwayMonths === null || baseKpis.runwayMonths === null
          ? null
          : round2(scenarioKpis.runwayMonths - baseKpis.runwayMonths),
    },
  };
}

module.exports = { applyScenario };