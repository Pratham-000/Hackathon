import { useEffect, useMemo, useState } from 'react';
import {
  BadgeIndianRupee,
  BriefcaseBusiness,
  CheckCircle2,
  GitCompareArrows,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Card from '../../../components/common/Card.jsx';
import Button from '../../../components/common/Button.jsx';
import Input from '../../../components/common/Input.jsx';
import scenarioApi from '../../../api/scenarioApi.js';
import budgetApi from '../../../api/budgetApi.js';

const defaultBaseline = {
  revenue: 10800000,
  payroll: 7700000,
  opex: 1550000,
  cash: 5200000,
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

function calculateKpis(input) {
  const revenue = Number(input.revenue || 0);
  const payroll = Number(input.payroll || 0);
  const opex = Number(input.opex || 0);
  const cash = Number(input.cash || 0);

  const totalExpense = payroll + opex;
  const operatingResult = revenue - totalExpense;
  const netBurn = Math.max(totalExpense - revenue, 0);
  const runwayMonths = netBurn > 0 ? cash / netBurn : null;
  const grossMargin = revenue > 0 ? ((revenue - payroll) / revenue) * 100 : 0;

  return {
    revenue,
    payroll,
    opex,
    cash,
    totalExpense,
    operatingResult,
    netBurn,
    runwayMonths,
    grossMargin,
  };
}

function applyScenario(base, assumptions) {
  const adjusted = {
    revenue: base.revenue * (1 + assumptions.revenueChangePct / 100),
    payroll: assumptions.hiringFreeze
      ? base.payroll
      : base.payroll * (1 + assumptions.payrollChangePct / 100),
    opex: base.opex * (1 + assumptions.opexChangePct / 100),
    cash: base.cash,
  };

  return calculateKpis(adjusted);
}

function ScenarioMetricCard({ title, baseValue, scenarioValue, formatter = (v) => v }) {
  const delta = scenarioValue - baseValue;
  const positive = delta >= 0;

  return (
    <Card className="p-4 md:p-5">
      <p className="text-sm text-app-muted">{title}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-app-muted">Scenario</p>
          <p className="tabular mt-1 text-xl font-semibold">{formatter(scenarioValue)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.14em] text-app-muted">Baseline</p>
          <p className="tabular mt-1 text-sm text-app-muted">{formatter(baseValue)}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm">
        {positive ? (
          <TrendingUp className="h-4 w-4 text-app-success" />
        ) : (
          <TrendingDown className="h-4 w-4 text-app-danger" />
        )}
        <span className={positive ? 'text-app-success' : 'text-app-danger'}>
          {delta >= 0 ? '+' : ''}
          {formatter(delta)}
        </span>
        <span className="text-app-muted">change</span>
      </div>
    </Card>
  );
}

export default function ScenarioPlannerPage() {
  const [budgets, setBudgets] = useState([]);
  const [selectedBudgetId, setSelectedBudgetId] = useState('');
  
  const [scenarioName, setScenarioName] = useState('Q3 Hiring Freeze');
  const [revenueChangePct, setRevenueChangePct] = useState(5);
  const [payrollChangePct, setPayrollChangePct] = useState(-3);
  const [opexChangePct, setOpexChangePct] = useState(-1);
  const [hiringFreeze, setHiringFreeze] = useState(true);

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const res = await budgetApi.getBudgets();
        if (res && res.success && res.data && res.data.budgets) {
          setBudgets(res.data.budgets);
          if (res.data.budgets.length > 0) {
            setSelectedBudgetId(res.data.budgets[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load budgets for scenario planner:', err);
      }
    };
    fetchBudgets();
  }, []);

  const baseline = useMemo(() => {
    if (!selectedBudgetId) return defaultBaseline;
    const selected = budgets.find((b) => b.id === selectedBudgetId);
    if (!selected) return defaultBaseline;

    const rev = Number(selected.totalRevenue);
    const exp = Number(selected.totalExpenses);
    return {
      revenue: rev,
      payroll: exp * 0.7,
      opex: exp * 0.3,
      cash: rev * 0.5,
    };
  }, [selectedBudgetId, budgets]);

  const baseKpis = useMemo(() => calculateKpis(baseline), [baseline]);
  const scenarioKpis = useMemo(
    () =>
      applyScenario(baseline, {
        revenueChangePct: Number(revenueChangePct),
        payrollChangePct: Number(payrollChangePct),
        opexChangePct: Number(opexChangePct),
        hiringFreeze,
      }),
    [baseline, revenueChangePct, payrollChangePct, opexChangePct, hiringFreeze]
  );

  const comparisonData = [
    {
      name: 'Revenue',
      baseline: Math.round(baseKpis.revenue / 100000),
      scenario: Math.round(scenarioKpis.revenue / 100000),
    },
    {
      name: 'Payroll',
      baseline: Math.round(baseKpis.payroll / 100000),
      scenario: Math.round(scenarioKpis.payroll / 100000),
    },
    {
      name: 'Opex',
      baseline: Math.round(baseKpis.opex / 100000),
      scenario: Math.round(scenarioKpis.opex / 100000),
    },
    {
      name: 'Profit',
      baseline: Math.round(baseKpis.operatingResult / 100000),
      scenario: Math.round(scenarioKpis.operatingResult / 100000),
    },
  ];

  const narrative = useMemo(() => {
    if (scenarioKpis.operatingResult > baseKpis.operatingResult && scenarioKpis.netBurn <= baseKpis.netBurn) {
      return 'This scenario improves operating performance while also reducing burn pressure, making it a strong efficiency case.';
    }

    if (scenarioKpis.revenue > baseKpis.revenue && scenarioKpis.payroll >= baseKpis.payroll) {
      return 'This scenario leans toward growth, but the team should verify execution capacity before locking the plan.';
    }

    return 'This scenario changes the cost structure, but the impact is mixed and should be reviewed against execution risk and confidence in assumptions.';
  }, [scenarioKpis, baseKpis]);

  const handleSaveScenario = async () => {
    setSaving(true);
    setSaveMessage('');
    setSaveError('');
    try {
      const userStr = localStorage.getItem('authUser');
      if (!userStr) {
        throw new Error('User session not found. Please log in.');
      }
      const user = JSON.parse(userStr);

      const selected = budgets.find((b) => b.id === selectedBudgetId);
      if (!selected) {
        throw new Error('Please select a valid budget to build this scenario on.');
      }

      // To create scenario in DB we need budgetVersionId. Fetching or defaulting.
      const versionId = selected.versions?.[0]?.id || selected.id;

      const payload = {
        name: scenarioName.trim(),
        description: `Revenue change: ${revenueChangePct}%, Payroll change: ${payrollChangePct}%, Opex change: ${opexChangePct}%`,
        type: 'CUSTOM',
        budgetId: selected.id,
        budgetVersionId: versionId,
        organizationId: selected.organizationId,
        createdById: user.id || 'user-id',
        revenueImpact: scenarioKpis.revenue - baseKpis.revenue,
        expenseImpact: scenarioKpis.totalExpense - baseKpis.totalExpense,
        profitImpact: scenarioKpis.operatingResult - baseKpis.operatingResult,
        payrollImpact: scenarioKpis.payroll - baseKpis.payroll,
        scenarioResults: [
          { metricName: 'Operating Result', metricValue: scenarioKpis.operatingResult, changePercent: revenueChangePct },
          { metricName: 'Net Burn', metricValue: scenarioKpis.netBurn, changePercent: opexChangePct },
        ],
      };

      await scenarioApi.createScenario(payload);
      setSaveMessage('Scenario saved successfully!');
    } catch (err) {
      console.error(err);
      setSaveError(err.message || 'Failed to save scenario');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-app-muted">
            What-if modeling
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Scenario planner</h1>
          <p className="mt-2 max-w-2xl text-sm text-app-muted md:text-base">
            Test revenue, payroll, and opex assumptions against a live baseline to understand margin,
            burn, and runway effects before committing a budget version.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => {
            setRevenueChangePct(5);
            setPayrollChangePct(-3);
            setOpexChangePct(-1);
            setHiringFreeze(true);
          }}>
            Reset assumptions
          </Button>
          <Button onClick={handleSaveScenario} disabled={saving}>
            {saving ? 'Saving...' : 'Save scenario'}
          </Button>
        </div>
      </section>

      {saveMessage ? (
        <div className="rounded-xl border border-app-success/30 bg-app-success/10 px-4 py-3 text-sm text-app-success">
          {saveMessage}
        </div>
      ) : null}

      {saveError ? (
        <div className="rounded-xl border border-app-danger/30 bg-app-danger/10 px-4 py-3 text-sm text-app-danger">
          {saveError}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1.05fr_1.25fr]">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-app-muted">Scenario setup</p>
              <h2 className="mt-1 text-lg font-semibold">Adjust your assumptions</h2>
            </div>
            <div className="rounded-xl bg-app-surface-2 p-2.5 text-app-muted">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-app-muted">
                Select Base Budget
              </label>
              <select
                value={selectedBudgetId}
                onChange={(e) => setSelectedBudgetId(e.target.value)}
                className="h-11 w-full rounded-xl border border-app-border bg-app-surface-2 px-4 text-sm text-app-text outline-none focus:border-app-primary focus:ring-2 focus:ring-app-primary/20"
              >
                {budgets.length === 0 ? (
                  <option value="">Default Baseline Budget</option>
                ) : (
                  budgets.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} (FY {b.fiscalYear})
                    </option>
                  ))
                )}
              </select>
            </div>

            <Input
              label="Scenario name"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              placeholder="Enter scenario name"
            />

            <div className="grid gap-4 md:grid-cols-3">
              <Input
                label="Revenue change %"
                type="number"
                value={revenueChangePct}
                onChange={(e) => setRevenueChangePct(e.target.value)}
              />
              <Input
                label="Payroll change %"
                type="number"
                value={payrollChangePct}
                onChange={(e) => setPayrollChangePct(e.target.value)}
                disabled={hiringFreeze}
              />
              <Input
                label="Opex change %"
                type="number"
                value={opexChangePct}
                onChange={(e) => setOpexChangePct(e.target.value)}
              />
            </div>

            <label className="flex items-center justify-between rounded-2xl border border-app-border bg-app-surface-2 p-4">
              <div>
                <p className="text-sm font-medium">Hiring freeze</p>
                <p className="mt-1 text-sm text-app-muted">
                  Lock payroll growth to baseline while testing the rest of the plan.
                </p>
              </div>
              <input
                type="checkbox"
                checked={hiringFreeze}
                onChange={(e) => setHiringFreeze(e.target.checked)}
                className="h-5 w-5 accent-[var(--primary)]"
              />
            </label>

            <div className="rounded-2xl border border-app-border bg-app-surface-2 p-4">
              <p className="text-sm font-medium">Baseline inputs</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-app-muted">Revenue</p>
                  <p className="tabular mt-1 font-medium">{formatCurrency(baseline.revenue)}</p>
                </div>
                <div>
                  <p className="text-sm text-app-muted">Payroll</p>
                  <p className="tabular mt-1 font-medium">{formatCurrency(baseline.payroll)}</p>
                </div>
                <div>
                  <p className="text-sm text-app-muted">Opex</p>
                  <p className="tabular mt-1 font-medium">{formatCurrency(baseline.opex)}</p>
                </div>
                <div>
                  <p className="text-sm text-app-muted">Cash</p>
                  <p className="tabular mt-1 font-medium">{formatCurrency(baseline.cash)}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-app-muted">Scenario brief</p>
              <h2 className="mt-1 text-lg font-semibold">{scenarioName || 'Untitled scenario'}</h2>
            </div>
            <div className="rounded-xl bg-app-surface-2 p-2.5 text-app-muted">
              <BriefcaseBusiness className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-app-border bg-app-surface-2 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-app-success" />
              <p className="text-sm leading-6 text-app-muted">{narrative}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <ScenarioMetricCard
              title="Operating result"
              baseValue={baseKpis.operatingResult}
              scenarioValue={scenarioKpis.operatingResult}
              formatter={formatCurrency}
            />
            <ScenarioMetricCard
              title="Net burn"
              baseValue={baseKpis.netBurn}
              scenarioValue={scenarioKpis.netBurn}
              formatter={formatCurrency}
            />
            <ScenarioMetricCard
              title="Gross margin"
              baseValue={baseKpis.grossMargin}
              scenarioValue={scenarioKpis.grossMargin}
              formatter={(v) => `${Number(v).toFixed(1)}%`}
            />
            <ScenarioMetricCard
              title="Runway months"
              baseValue={baseKpis.runwayMonths || 0}
              scenarioValue={scenarioKpis.runwayMonths || 0}
              formatter={(v) => `${Number(v).toFixed(1)}m`}
            />
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-app-muted">Baseline vs scenario</p>
              <h2 className="mt-1 text-lg font-semibold">Financial comparison</h2>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-app-surface-2 px-3 py-2 text-sm text-app-muted">
              <GitCompareArrows className="h-4 w-4" />
              Amounts in lakhs (₹L)
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} barCategoryGap={20}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: 'var(--muted)', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'var(--muted)', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="baseline" name="Baseline" fill="var(--muted)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="scenario" name="Scenario" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <p className="text-sm text-app-muted">Decision summary</p>
          <h2 className="mt-1 text-lg font-semibold">Key takeaways</h2>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-app-border bg-app-surface-2 p-4">
              <p className="text-sm text-app-muted">Scenario revenue</p>
              <p className="tabular mt-1 text-xl font-semibold">
                {formatCurrency(scenarioKpis.revenue)}
              </p>
            </div>

            <div className="rounded-2xl border border-app-border bg-app-surface-2 p-4">
              <p className="text-sm text-app-muted">Scenario total expense</p>
              <p className="tabular mt-1 text-xl font-semibold">
                {formatCurrency(scenarioKpis.totalExpense)}
              </p>
            </div>

            <div className="rounded-2xl border border-app-border bg-app-surface-2 p-4">
              <p className="text-sm text-app-muted">Cash position impact</p>
              <p className="mt-1 text-sm leading-6 text-app-muted">
                {scenarioKpis.netBurn === 0
                  ? 'Revenue covers current expense levels, so runway pressure is minimal in this scenario.'
                  : `At current assumptions, burn remains ${formatCurrency(
                      scenarioKpis.netBurn
                    )} and runway is about ${Number(scenarioKpis.runwayMonths || 0).toFixed(1)} months.`}
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}