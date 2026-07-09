const { PrismaClient, UserRole, BudgetStatus, VersionStatus, AssumptionType, ScenarioType, ForecastPeriod, InsightType } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.aIInsight.deleteMany();
  await prisma.payroll.deleteMany();
  await prisma.forecast.deleteMany();
  await prisma.scenarioResult.deleteMany();
  await prisma.scenario.deleteMany();
  await prisma.assumption.deleteMany();
  await prisma.budgetVersion.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.employeeSkill.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.role.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const organization = await prisma.organization.create({
    data: {
      name: 'BudgetIQ Technologies',
      industry: 'SaaS',
      currency: 'INR',
      fiscalYearStart: 4,
    },
  });

  const [adminUser, financeUser, hrUser] = await Promise.all([
    prisma.user.create({
      data: {
        fullName: 'Pratham Arora',
        email: 'admin@budgetiq.com',
        passwordHash: 'hashed-password',
        role: UserRole.ORG_ADMIN,
        organizationId: organization.id,
      },
    }),
    prisma.user.create({
      data: {
        fullName: 'Riya Finance',
        email: 'finance@budgetiq.com',
        passwordHash: 'hashed-password',
        role: UserRole.FINANCE_MANAGER,
        organizationId: organization.id,
      },
    }),
    prisma.user.create({
      data: {
        fullName: 'Arjun HR',
        email: 'hr@budgetiq.com',
        passwordHash: 'hashed-password',
        role: UserRole.HR_MANAGER,
        organizationId: organization.id,
      },
    }),
  ]);

  const [engineering, sales, marketing] = await Promise.all([
    prisma.department.create({
      data: {
        name: 'Engineering',
        code: 'ENG',
        organizationId: organization.id,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Sales',
        code: 'SAL',
        organizationId: organization.id,
      },
    }),
    prisma.department.create({
      data: {
        name: 'Marketing',
        code: 'MKT',
        organizationId: organization.id,
      },
    }),
  ]);

  const [backendRole, frontendRole, salesManagerRole, marketingLeadRole, hrRole] = await Promise.all([
    prisma.role.create({
      data: {
        title: 'Backend Developer',
        level: 'L2',
        baseSalaryMin: 600000,
        baseSalaryMax: 1200000,
        organizationId: organization.id,
      },
    }),
    prisma.role.create({
      data: {
        title: 'Frontend Developer',
        level: 'L2',
        baseSalaryMin: 500000,
        baseSalaryMax: 1000000,
        organizationId: organization.id,
      },
    }),
    prisma.role.create({
      data: {
        title: 'Sales Manager',
        level: 'L3',
        baseSalaryMin: 800000,
        baseSalaryMax: 1500000,
        organizationId: organization.id,
      },
    }),
    prisma.role.create({
      data: {
        title: 'Marketing Lead',
        level: 'L3',
        baseSalaryMin: 700000,
        baseSalaryMax: 1400000,
        organizationId: organization.id,
      },
    }),
    prisma.role.create({
      data: {
        title: 'HR Manager',
        level: 'L3',
        baseSalaryMin: 700000,
        baseSalaryMax: 1300000,
        organizationId: organization.id,
      },
    }),
  ]);

  const [reactSkill, nodeSkill, salesSkill, seoSkill, hiringSkill, sqlSkill] = await Promise.all([
    prisma.skill.create({
      data: { name: 'React.js', category: 'Frontend', organizationId: organization.id },
    }),
    prisma.skill.create({
      data: { name: 'Node.js', category: 'Backend', organizationId: organization.id },
    }),
    prisma.skill.create({
      data: { name: 'B2B Sales', category: 'Sales', organizationId: organization.id },
    }),
    prisma.skill.create({
      data: { name: 'SEO', category: 'Marketing', organizationId: organization.id },
    }),
    prisma.skill.create({
      data: { name: 'Hiring', category: 'HR', organizationId: organization.id },
    }),
    prisma.skill.create({
      data: { name: 'SQL', category: 'Database', organizationId: organization.id },
    }),
  ]);

  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        employeeCode: 'EMP001',
        fullName: 'Aman Verma',
        email: 'aman@budgetiq.com',
        salary: 900000,
        bonus: 50000,
        experienceYears: 4,
        performanceScore: 4.4,
        workloadScore: 4.1,
        isActive: true,
        hiredAt: new Date('2023-01-15'),
        organizationId: organization.id,
        departmentId: engineering.id,
        roleId: backendRole.id,
      },
    }),
    prisma.employee.create({
      data: {
        employeeCode: 'EMP002',
        fullName: 'Neha Sharma',
        email: 'neha@budgetiq.com',
        salary: 850000,
        bonus: 40000,
        experienceYears: 3,
        performanceScore: 4.2,
        workloadScore: 3.9,
        isActive: true,
        hiredAt: new Date('2023-03-10'),
        organizationId: organization.id,
        departmentId: engineering.id,
        roleId: frontendRole.id,
      },
    }),
    prisma.employee.create({
      data: {
        employeeCode: 'EMP003',
        fullName: 'Rahul Mehta',
        email: 'rahul@budgetiq.com',
        salary: 1200000,
        bonus: 100000,
        experienceYears: 6,
        performanceScore: 4.7,
        workloadScore: 4.5,
        isActive: true,
        hiredAt: new Date('2022-07-01'),
        organizationId: organization.id,
        departmentId: sales.id,
        roleId: salesManagerRole.id,
      },
    }),
    prisma.employee.create({
      data: {
        employeeCode: 'EMP004',
        fullName: 'Sneha Iyer',
        email: 'sneha@budgetiq.com',
        salary: 1100000,
        bonus: 90000,
        experienceYears: 5,
        performanceScore: 4.3,
        workloadScore: 4.0,
        isActive: true,
        hiredAt: new Date('2022-09-12'),
        organizationId: organization.id,
        departmentId: marketing.id,
        roleId: marketingLeadRole.id,
      },
    }),
    prisma.employee.create({
      data: {
        employeeCode: 'EMP005',
        fullName: 'Karan Patel',
        email: 'karan@budgetiq.com',
        salary: 950000,
        bonus: 60000,
        experienceYears: 5,
        performanceScore: 4.0,
        workloadScore: 3.8,
        isActive: true,
        hiredAt: new Date('2021-11-20'),
        organizationId: organization.id,
        departmentId: marketing.id,
        roleId: hrRole.id,
      },
    }),
  ]);

  await prisma.employeeSkill.createMany({
    data: [
      { employeeId: employees[0].id, skillId: nodeSkill.id, proficiency: 5, yearsUsed: 4 },
      { employeeId: employees[0].id, skillId: sqlSkill.id, proficiency: 4, yearsUsed: 3 },
      { employeeId: employees[1].id, skillId: reactSkill.id, proficiency: 5, yearsUsed: 3 },
      { employeeId: employees[2].id, skillId: salesSkill.id, proficiency: 5, yearsUsed: 6 },
      { employeeId: employees[3].id, skillId: seoSkill.id, proficiency: 4, yearsUsed: 4 },
      { employeeId: employees[4].id, skillId: hiringSkill.id, proficiency: 5, yearsUsed: 5 },
    ],
  });

  const budget = await prisma.budget.create({
    data: {
      name: 'FY2026 Master Budget',
      description: 'Primary annual planning budget',
      totalRevenue: 50000000,
      totalExpenses: 32000000,
      totalProfit: 18000000,
      status: BudgetStatus.ACTIVE,
      fiscalYear: 2026,
      organizationId: organization.id,
      createdById: adminUser.id,
    },
  });

  const version1 = await prisma.budgetVersion.create({
    data: {
      budgetId: budget.id,
      versionNumber: 1,
      name: 'Initial Budget',
      notes: 'Baseline approved budget',
      status: VersionStatus.FINAL,
      revenue: 50000000,
      expenses: 32000000,
      profit: 18000000,
      createdById: financeUser.id,
    },
  });

  const version2 = await prisma.budgetVersion.create({
    data: {
      budgetId: budget.id,
      versionNumber: 2,
      name: 'Revised Budget Q2',
      notes: 'Adjusted for hiring and sales expansion',
      status: VersionStatus.DRAFT,
      revenue: 54000000,
      expenses: 35000000,
      profit: 19000000,
      createdById: financeUser.id,
    },
  });

  const assumptions = await Promise.all([
    prisma.assumption.create({
      data: {
        name: 'Revenue Growth',
        type: AssumptionType.REVENUE_GROWTH,
        value: 12.5,
        unit: '%',
        description: 'Expected revenue increase for revised plan',
        budgetVersionId: version2.id,
      },
    }),
    prisma.assumption.create({
      data: {
        name: 'Salary Increment',
        type: AssumptionType.SALARY_INCREMENT,
        value: 8.0,
        unit: '%',
        description: 'Average annual employee increment',
        budgetVersionId: version2.id,
      },
    }),
    prisma.assumption.create({
      data: {
        name: 'Headcount Expansion',
        type: AssumptionType.HEADCOUNT_CHANGE,
        value: 3,
        unit: 'count',
        description: 'New hires planned in engineering and sales',
        budgetVersionId: version2.id,
      },
    }),
  ]);

  const baselineScenario = await prisma.scenario.create({
    data: {
      name: 'Baseline Scenario',
      description: 'Current approved scenario',
      type: ScenarioType.BASELINE,
      budgetId: budget.id,
      budgetVersionId: version1.id,
      organizationId: organization.id,
      createdById: financeUser.id,
      revenueImpact: 0,
      expenseImpact: 0,
      profitImpact: 0,
      payrollImpact: 0,
      assumptions: {
        connect: [],
      },
    },
  });

  const growthScenario = await prisma.scenario.create({
    data: {
      name: 'Growth Scenario',
      description: 'Aggressive hiring with revenue growth',
      type: ScenarioType.BEST_CASE,
      budgetId: budget.id,
      budgetVersionId: version2.id,
      organizationId: organization.id,
      createdById: financeUser.id,
      revenueImpact: 4000000,
      expenseImpact: 3000000,
      profitImpact: 1000000,
      payrollImpact: 1200000,
      assumptions: {
        connect: assumptions.map((a) => ({ id: a.id })),
      },
    },
  });

  const riskScenario = await prisma.scenario.create({
    data: {
      name: 'Risk Scenario',
      description: 'Higher costs with slower sales conversion',
      type: ScenarioType.WORST_CASE,
      budgetId: budget.id,
      budgetVersionId: version2.id,
      organizationId: organization.id,
      createdById: financeUser.id,
      revenueImpact: -2500000,
      expenseImpact: 1800000,
      profitImpact: -4300000,
      payrollImpact: 900000,
    },
  });

  await prisma.scenarioResult.createMany({
    data: [
      {
        scenarioId: growthScenario.id,
        metricName: 'Projected Revenue',
        metricValue: 54000000,
        metricUnit: 'INR',
        changePercent: 8.0,
        notes: 'Revenue improves due to stronger sales pipeline',
      },
      {
        scenarioId: growthScenario.id,
        metricName: 'Projected Profit',
        metricValue: 19000000,
        metricUnit: 'INR',
        changePercent: 5.5,
        notes: 'Profit remains healthy despite payroll growth',
      },
      {
        scenarioId: riskScenario.id,
        metricName: 'Projected Revenue',
        metricValue: 47500000,
        metricUnit: 'INR',
        changePercent: -5.0,
        notes: 'Revenue declines due to weaker conversion',
      },
      {
        scenarioId: riskScenario.id,
        metricName: 'Projected Profit',
        metricValue: 13700000,
        metricUnit: 'INR',
        changePercent: -23.8,
        notes: 'Profit compressed by rising payroll and slower growth',
      },
    ],
  });

  await prisma.forecast.createMany({
    data: [
      {
        title: 'Q3 Forecast',
        period: ForecastPeriod.QUARTERLY,
        startDate: new Date('2026-07-01'),
        endDate: new Date('2026-09-30'),
        projectedRevenue: 13500000,
        projectedExpenses: 8600000,
        projectedProfit: 4900000,
        projectedHeadcount: 8,
        projectedPayroll: 3100000,
        organizationId: organization.id,
        budgetId: budget.id,
        budgetVersionId: version2.id,
        scenarioId: growthScenario.id,
      },
      {
        title: 'Q4 Forecast',
        period: ForecastPeriod.QUARTERLY,
        startDate: new Date('2026-10-01'),
        endDate: new Date('2026-12-31'),
        projectedRevenue: 14500000,
        projectedExpenses: 9100000,
        projectedProfit: 5400000,
        projectedHeadcount: 8,
        projectedPayroll: 3200000,
        organizationId: organization.id,
        budgetId: budget.id,
        budgetVersionId: version2.id,
        scenarioId: growthScenario.id,
      },
    ],
  });

  await prisma.payroll.createMany({
    data: [
      {
        month: 7,
        year: 2026,
        baseSalaryTotal: 410000,
        bonusTotal: 45000,
        deductionsTotal: 15000,
        netPayrollTotal: 440000,
        organizationId: organization.id,
        budgetId: budget.id,
        budgetVersionId: version2.id,
      },
      {
        month: 8,
        year: 2026,
        baseSalaryTotal: 425000,
        bonusTotal: 50000,
        deductionsTotal: 18000,
        netPayrollTotal: 457000,
        organizationId: organization.id,
        budgetId: budget.id,
        budgetVersionId: version2.id,
      },
    ],
  });

  await prisma.aIInsight.createMany({
    data: [
      {
        title: 'Hiring Expansion Insight',
        type: InsightType.WORKFORCE,
        prompt: 'Analyze headcount expansion impact',
        response: 'Hiring 3 employees increases payroll but keeps profit positive if revenue growth stays above 10%.',
        confidenceScore: 88.5,
        userId: financeUser.id,
        organizationId: organization.id,
        budgetId: budget.id,
        budgetVersionId: version2.id,
        scenarioId: growthScenario.id,
      },
      {
        title: 'Salary Optimization Insight',
        type: InsightType.PAYROLL,
        prompt: 'Suggest payroll optimization',
        response: 'Prioritize salary increases for high-performing engineering roles and defer broad adjustments in non-critical departments.',
        confidenceScore: 84.2,
        userId: hrUser.id,
        organizationId: organization.id,
        budgetId: budget.id,
        budgetVersionId: version2.id,
        scenarioId: riskScenario.id,
      },
    ],
  });

  console.log('✅ Database seeded successfully');
  console.log({
    organization: organization.name,
    users: 3,
    departments: 3,
    employees: employees.length,
    budget: budget.name,
    scenarios: 3,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });