import { useMemo, useState } from 'react';
import { Minus, Plus, SlidersHorizontal } from 'lucide-react';
import Button from '../common/Button.jsx';
import Card from '../common/Card.jsx';

const defaultAssumptions = [
  {
    key: 'headcountGrowth',
    label: 'Headcount growth',
    unit: '%',
    min: -20,
    max: 40,
    step: 1,
    value: 8,
  },
  {
    key: 'salaryIncrease',
    label: 'Salary increase',
    unit: '%',
    min: 0,
    max: 20,
    step: 0.5,
    value: 6,
  },
  {
    key: 'revenueGrowth',
    label: 'Revenue growth',
    unit: '%',
    min: -10,
    max: 50,
    step: 1,
    value: 14,
  },
  {
    key: 'opexChange',
    label: 'Operating cost change',
    unit: '%',
    min: -20,
    max: 25,
    step: 1,
    value: 5,
  },
];

export default function ScenarioBuilder({
  assumptions = defaultAssumptions,
  baseValues = {
    revenue: 15000000,
    payroll: 5800000,
    opex: 3100000,
  },
  onRunScenario,
}) {
  const [values, setValues] = useState(
    assumptions.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {})
  );

  const updateValue = (key, next) => {
    setValues((prev) => ({ ...prev, [key]: Number(next) }));
  };

  const summary = useMemo(() => {
    const projectedRevenue =
      baseValues.revenue * (1 + (Number(values.revenueGrowth || 0) / 100));
    const projectedPayroll =
      baseValues.payroll *
      (1 +
        (Number(values.headcountGrowth || 0) + Number(values.salaryIncrease || 0)) /
          100);
    const projectedOpex =
      baseValues.opex * (1 + Number(values.opexChange || 0) / 100);

    const totalCost = projectedPayroll + projectedOpex;
    const margin = projectedRevenue
      ? ((projectedRevenue - totalCost) / projectedRevenue) * 100
      : 0;

    return {
      projectedRevenue,
      projectedPayroll,
      projectedOpex,
      totalCost,
      margin,
    };
  }, [values, baseValues]);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-app-muted">What-if controls</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight">
            Scenario builder
          </h2>
        </div>
        <Button
          variant="secondary"
          onClick={() => onRunScenario?.({ assumptions: values, summary })}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Run scenario
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {assumptions.map((item) => (
            <div
              key={item.key}
              className="rounded-2xl border border-app-border bg-app-surface-2 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-app-muted">
                    Range {item.min}
                    {item.unit} to {item.max}
                    {item.unit}
                  </p>
                </div>
                <div className="tabular rounded-full bg-app-surface px-3 py-1 text-sm font-medium">
                  {values[item.key]}
                  {item.unit}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-app-border bg-app-surface hover:bg-app-surface-3"
                  onClick={() =>
                    updateValue(
                      item.key,
                      Math.max(item.min, Number(values[item.key]) - Number(item.step))
                    )
                  }
                >
                  <Minus className="h-4 w-4" />
                </button>

                <input
                  type="range"
                  min={item.min}
                  max={item.max}
                  step={item.step}
                  value={values[item.key]}
                  onChange={(e) => updateValue(item.key, e.target.value)}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-app-border accent-app-primary"
                />

                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-app-border bg-app-surface hover:bg-app-surface-3"
                  onClick={() =>
                    updateValue(
                      item.key,
                      Math.min(item.max, Number(values[item.key]) + Number(item.step))
                    )
                  }
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-app-border bg-app-surface-2 p-4">
          <p className="text-sm text-app-muted">Projection result</p>

          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-app-surface p-4">
              <p className="text-sm text-app-muted">Projected revenue</p>
              <p className="tabular mt-2 text-xl font-semibold">
                ₹{Math.round(summary.projectedRevenue).toLocaleString('en-IN')}
              </p>
            </div>

            <div className="rounded-2xl bg-app-surface p-4">
              <p className="text-sm text-app-muted">Projected payroll</p>
              <p className="tabular mt-2 text-xl font-semibold">
                ₹{Math.round(summary.projectedPayroll).toLocaleString('en-IN')}
              </p>
            </div>

            <div className="rounded-2xl bg-app-surface p-4">
              <p className="text-sm text-app-muted">Projected opex</p>
              <p className="tabular mt-2 text-xl font-semibold">
                ₹{Math.round(summary.projectedOpex).toLocaleString('en-IN')}
              </p>
            </div>

            <div className="rounded-2xl bg-app-primary px-4 py-5 text-white">
              <p className="text-sm text-white/80">Projected margin</p>
              <p className="tabular mt-2 text-2xl font-semibold">
                {summary.margin.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}