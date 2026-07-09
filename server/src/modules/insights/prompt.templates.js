const promptTemplates = {
  BUDGET: ({ organizationName, budgetName, fiscalYear, revenue, expenses, profit }) => `
You are a financial planning assistant.
Analyze this budget and return a concise executive insight.

Organization: ${organizationName}
Budget: ${budgetName}
Fiscal Year: ${fiscalYear}
Revenue: ${revenue}
Expenses: ${expenses}
Profit: ${profit}

Return:
1. Overall budget health
2. Main risk
3. Main opportunity
4. One recommendation
`.trim(),

  SCENARIO: ({
    organizationName,
    scenarioName,
    scenarioType,
    revenueImpact,
    expenseImpact,
    profitImpact,
    payrollImpact,
  }) => `
You are a financial scenario planning assistant.
Analyze this scenario and return a concise executive insight.

Organization: ${organizationName}
Scenario: ${scenarioName}
Scenario Type: ${scenarioType}
Revenue Impact: ${revenueImpact}
Expense Impact: ${expenseImpact}
Profit Impact: ${profitImpact}
Payroll Impact: ${payrollImpact}

Return:
1. Scenario summary
2. Main financial tradeoff
3. Key risk
4. Recommended action
`.trim(),

  PAYROLL: ({ organizationName, baseSalaryTotal, bonusTotal, deductionsTotal, netPayrollTotal }) => `
You are a payroll analytics assistant.
Analyze this payroll snapshot and return a concise executive insight.

Organization: ${organizationName}
Base Salary Total: ${baseSalaryTotal}
Bonus Total: ${bonusTotal}
Deductions Total: ${deductionsTotal}
Net Payroll Total: ${netPayrollTotal}

Return:
1. Payroll summary
2. Cost driver
3. Risk
4. Recommendation
`.trim(),

  FORECAST: ({
    organizationName,
    title,
    period,
    projectedRevenue,
    projectedExpenses,
    projectedProfit,
    projectedHeadcount,
    projectedPayroll,
  }) => `
You are a forecasting assistant.
Analyze this forecast and return a concise executive insight.

Organization: ${organizationName}
Forecast Title: ${title}
Period: ${period}
Projected Revenue: ${projectedRevenue}
Projected Expenses: ${projectedExpenses}
Projected Profit: ${projectedProfit}
Projected Headcount: ${projectedHeadcount}
Projected Payroll: ${projectedPayroll}

Return:
1. Forecast summary
2. Growth outlook
3. Risk
4. Recommendation
`.trim(),

  WORKFORCE: ({ organizationName, totalEmployees, activeEmployees, totalPayroll }) => `
You are a workforce planning assistant.
Analyze this workforce snapshot and return a concise executive insight.

Organization: ${organizationName}
Total Employees: ${totalEmployees}
Active Employees: ${activeEmployees}
Total Payroll: ${totalPayroll}

Return:
1. Workforce summary
2. Capacity insight
3. Risk
4. Recommendation
`.trim(),

  KPI: ({ organizationName, budgetCount, versionCount, scenarioCount, forecastCount, payrollCount }) => `
You are a KPI analytics assistant.
Analyze these planning KPIs and return a concise executive insight.

Organization: ${organizationName}
Budgets: ${budgetCount}
Versions: ${versionCount}
Scenarios: ${scenarioCount}
Forecasts: ${forecastCount}
Payroll Records: ${payrollCount}

Return:
1. KPI summary
2. Planning maturity observation
3. Risk
4. Recommendation
`.trim(),
};

module.exports = { promptTemplates };