const { round2 } = require('../utils/calculations');

function calculateKpis(input) {
  const revenue = Number(input.revenue || 0);
  const payroll = Number(input.payroll || 0);
  const opex = Number(input.opex || 0);
  const cash = Number(input.cash || 0);

  const totalExpense = payroll + opex;
  const netBurn = Math.max(totalExpense - revenue, 0);
  const runwayMonths = netBurn > 0 ? cash / netBurn : null;
  const operatingResult = revenue - totalExpense;
  const grossMargin = revenue > 0 ? ((revenue - payroll) / revenue) * 100 : 0;
  const payrollRatio = totalExpense > 0 ? (payroll / totalExpense) * 100 : 0;

  return {
    revenue: round2(revenue),
    payroll: round2(payroll),
    opex: round2(opex),
    cash: round2(cash),
    totalExpense: round2(totalExpense),
    operatingResult: round2(operatingResult),
    netBurn: round2(netBurn),
    runwayMonths: runwayMonths === null ? null : round2(runwayMonths),
    grossMargin: round2(grossMargin),
    payrollRatio: round2(payrollRatio),
  };
}

module.exports = { calculateKpis };