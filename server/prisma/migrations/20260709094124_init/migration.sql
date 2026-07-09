-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ORG_ADMIN', 'FINANCE_MANAGER', 'HR_MANAGER', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "BudgetStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "VersionStatus" AS ENUM ('DRAFT', 'FINAL', 'LOCKED');

-- CreateEnum
CREATE TYPE "AssumptionType" AS ENUM ('REVENUE_GROWTH', 'COST_GROWTH', 'HEADCOUNT_CHANGE', 'SALARY_INCREMENT', 'ATTRITION_RATE', 'BONUS_PERCENT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ScenarioType" AS ENUM ('BASELINE', 'BEST_CASE', 'WORST_CASE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ForecastPeriod" AS ENUM ('MONTHLY', 'QUARTERLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "InsightType" AS ENUM ('BUDGET', 'SCENARIO', 'PAYROLL', 'FORECAST', 'WORKFORCE', 'KPI');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'EMPLOYEE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "organizationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "industry" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "fiscalYearStart" INTEGER NOT NULL DEFAULT 4,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "level" TEXT,
    "baseSalaryMin" DECIMAL(12,2),
    "baseSalaryMax" DECIMAL(12,2),
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "employeeCode" TEXT,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "salary" DECIMAL(12,2) NOT NULL,
    "bonus" DECIMAL(12,2),
    "experienceYears" INTEGER DEFAULT 0,
    "performanceScore" DECIMAL(5,2),
    "workloadScore" DECIMAL(5,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "hiredAt" TIMESTAMP(3),
    "organizationId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_skills" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "proficiency" INTEGER NOT NULL DEFAULT 1,
    "yearsUsed" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budgets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "totalRevenue" DECIMAL(14,2) NOT NULL,
    "totalExpenses" DECIMAL(14,2) NOT NULL,
    "totalProfit" DECIMAL(14,2) NOT NULL,
    "status" "BudgetStatus" NOT NULL DEFAULT 'DRAFT',
    "fiscalYear" INTEGER NOT NULL,
    "organizationId" TEXT NOT NULL,
    "departmentId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget_versions" (
    "id" TEXT NOT NULL,
    "budgetId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "status" "VersionStatus" NOT NULL DEFAULT 'DRAFT',
    "revenue" DECIMAL(14,2) NOT NULL,
    "expenses" DECIMAL(14,2) NOT NULL,
    "profit" DECIMAL(14,2) NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "budget_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assumptions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AssumptionType" NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "unit" TEXT,
    "description" TEXT,
    "budgetVersionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assumptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scenarios" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "ScenarioType" NOT NULL DEFAULT 'CUSTOM',
    "budgetId" TEXT NOT NULL,
    "budgetVersionId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "revenueImpact" DECIMAL(14,2),
    "expenseImpact" DECIMAL(14,2),
    "profitImpact" DECIMAL(14,2),
    "payrollImpact" DECIMAL(14,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scenario_results" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "metricName" TEXT NOT NULL,
    "metricValue" DECIMAL(14,2) NOT NULL,
    "metricUnit" TEXT,
    "changePercent" DECIMAL(8,2),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scenario_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forecasts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "period" "ForecastPeriod" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "projectedRevenue" DECIMAL(14,2) NOT NULL,
    "projectedExpenses" DECIMAL(14,2) NOT NULL,
    "projectedProfit" DECIMAL(14,2) NOT NULL,
    "projectedHeadcount" INTEGER,
    "projectedPayroll" DECIMAL(14,2),
    "organizationId" TEXT NOT NULL,
    "departmentId" TEXT,
    "budgetId" TEXT,
    "budgetVersionId" TEXT,
    "scenarioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forecasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payrolls" (
    "id" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "baseSalaryTotal" DECIMAL(14,2) NOT NULL,
    "bonusTotal" DECIMAL(14,2) NOT NULL,
    "deductionsTotal" DECIMAL(14,2) NOT NULL,
    "netPayrollTotal" DECIMAL(14,2) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "departmentId" TEXT,
    "employeeId" TEXT,
    "budgetId" TEXT,
    "budgetVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payrolls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_insights" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "InsightType" NOT NULL,
    "prompt" TEXT,
    "response" TEXT NOT NULL,
    "confidenceScore" DECIMAL(5,2),
    "userId" TEXT,
    "organizationId" TEXT NOT NULL,
    "budgetId" TEXT,
    "budgetVersionId" TEXT,
    "scenarioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AssumptionToScenario" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AssumptionToScenario_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_organizationId_idx" ON "users"("organizationId");

-- CreateIndex
CREATE INDEX "departments_organizationId_idx" ON "departments"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "departments_organizationId_name_key" ON "departments"("organizationId", "name");

-- CreateIndex
CREATE INDEX "roles_organizationId_idx" ON "roles"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "roles_organizationId_title_key" ON "roles"("organizationId", "title");

-- CreateIndex
CREATE INDEX "skills_organizationId_idx" ON "skills"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "skills_organizationId_name_key" ON "skills"("organizationId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE INDEX "employees_organizationId_idx" ON "employees"("organizationId");

-- CreateIndex
CREATE INDEX "employees_departmentId_idx" ON "employees"("departmentId");

-- CreateIndex
CREATE INDEX "employees_roleId_idx" ON "employees"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "employees_organizationId_employeeCode_key" ON "employees"("organizationId", "employeeCode");

-- CreateIndex
CREATE INDEX "employee_skills_employeeId_idx" ON "employee_skills"("employeeId");

-- CreateIndex
CREATE INDEX "employee_skills_skillId_idx" ON "employee_skills"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "employee_skills_employeeId_skillId_key" ON "employee_skills"("employeeId", "skillId");

-- CreateIndex
CREATE INDEX "budgets_organizationId_idx" ON "budgets"("organizationId");

-- CreateIndex
CREATE INDEX "budgets_departmentId_idx" ON "budgets"("departmentId");

-- CreateIndex
CREATE INDEX "budgets_createdById_idx" ON "budgets"("createdById");

-- CreateIndex
CREATE INDEX "budget_versions_budgetId_idx" ON "budget_versions"("budgetId");

-- CreateIndex
CREATE INDEX "budget_versions_createdById_idx" ON "budget_versions"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "budget_versions_budgetId_versionNumber_key" ON "budget_versions"("budgetId", "versionNumber");

-- CreateIndex
CREATE INDEX "assumptions_budgetVersionId_idx" ON "assumptions"("budgetVersionId");

-- CreateIndex
CREATE INDEX "scenarios_budgetId_idx" ON "scenarios"("budgetId");

-- CreateIndex
CREATE INDEX "scenarios_budgetVersionId_idx" ON "scenarios"("budgetVersionId");

-- CreateIndex
CREATE INDEX "scenarios_organizationId_idx" ON "scenarios"("organizationId");

-- CreateIndex
CREATE INDEX "scenarios_createdById_idx" ON "scenarios"("createdById");

-- CreateIndex
CREATE INDEX "scenario_results_scenarioId_idx" ON "scenario_results"("scenarioId");

-- CreateIndex
CREATE INDEX "forecasts_organizationId_idx" ON "forecasts"("organizationId");

-- CreateIndex
CREATE INDEX "forecasts_departmentId_idx" ON "forecasts"("departmentId");

-- CreateIndex
CREATE INDEX "forecasts_budgetId_idx" ON "forecasts"("budgetId");

-- CreateIndex
CREATE INDEX "forecasts_budgetVersionId_idx" ON "forecasts"("budgetVersionId");

-- CreateIndex
CREATE INDEX "forecasts_scenarioId_idx" ON "forecasts"("scenarioId");

-- CreateIndex
CREATE INDEX "payrolls_organizationId_idx" ON "payrolls"("organizationId");

-- CreateIndex
CREATE INDEX "payrolls_departmentId_idx" ON "payrolls"("departmentId");

-- CreateIndex
CREATE INDEX "payrolls_employeeId_idx" ON "payrolls"("employeeId");

-- CreateIndex
CREATE INDEX "payrolls_budgetId_idx" ON "payrolls"("budgetId");

-- CreateIndex
CREATE INDEX "payrolls_budgetVersionId_idx" ON "payrolls"("budgetVersionId");

-- CreateIndex
CREATE INDEX "ai_insights_userId_idx" ON "ai_insights"("userId");

-- CreateIndex
CREATE INDEX "ai_insights_organizationId_idx" ON "ai_insights"("organizationId");

-- CreateIndex
CREATE INDEX "ai_insights_budgetId_idx" ON "ai_insights"("budgetId");

-- CreateIndex
CREATE INDEX "ai_insights_budgetVersionId_idx" ON "ai_insights"("budgetVersionId");

-- CreateIndex
CREATE INDEX "ai_insights_scenarioId_idx" ON "ai_insights"("scenarioId");

-- CreateIndex
CREATE INDEX "_AssumptionToScenario_B_index" ON "_AssumptionToScenario"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_skills" ADD CONSTRAINT "employee_skills_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_skills" ADD CONSTRAINT "employee_skills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_versions" ADD CONSTRAINT "budget_versions_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "budgets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_versions" ADD CONSTRAINT "budget_versions_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assumptions" ADD CONSTRAINT "assumptions_budgetVersionId_fkey" FOREIGN KEY ("budgetVersionId") REFERENCES "budget_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "budgets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_budgetVersionId_fkey" FOREIGN KEY ("budgetVersionId") REFERENCES "budget_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenario_results" ADD CONSTRAINT "scenario_results_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "scenarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forecasts" ADD CONSTRAINT "forecasts_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forecasts" ADD CONSTRAINT "forecasts_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forecasts" ADD CONSTRAINT "forecasts_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "budgets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forecasts" ADD CONSTRAINT "forecasts_budgetVersionId_fkey" FOREIGN KEY ("budgetVersionId") REFERENCES "budget_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forecasts" ADD CONSTRAINT "forecasts_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "scenarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payrolls" ADD CONSTRAINT "payrolls_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payrolls" ADD CONSTRAINT "payrolls_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payrolls" ADD CONSTRAINT "payrolls_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payrolls" ADD CONSTRAINT "payrolls_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "budgets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payrolls" ADD CONSTRAINT "payrolls_budgetVersionId_fkey" FOREIGN KEY ("budgetVersionId") REFERENCES "budget_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_insights" ADD CONSTRAINT "ai_insights_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_insights" ADD CONSTRAINT "ai_insights_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_insights" ADD CONSTRAINT "ai_insights_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "budgets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_insights" ADD CONSTRAINT "ai_insights_budgetVersionId_fkey" FOREIGN KEY ("budgetVersionId") REFERENCES "budget_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_insights" ADD CONSTRAINT "ai_insights_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "scenarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssumptionToScenario" ADD CONSTRAINT "_AssumptionToScenario_A_fkey" FOREIGN KEY ("A") REFERENCES "assumptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssumptionToScenario" ADD CONSTRAINT "_AssumptionToScenario_B_fkey" FOREIGN KEY ("B") REFERENCES "scenarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
