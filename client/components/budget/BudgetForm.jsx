import { useMemo, useState } from 'react';
import { CalendarDays, IndianRupee, Save, Wand2 } from 'lucide-react';
import Button from '../common/Button.jsx';
import Card from '../common/Card.jsx';
import Input from '../common/Input.jsx';

const initialState = {
  name: '',
  department: '',
  fiscalYear: new Date().getFullYear().toString(),
  owner: '',
  revenueTarget: '',
  operatingCost: '',
  payrollBudget: '',
  capexBudget: '',
  notes: '',
  status: 'draft',
};

export default function BudgetForm({
  initialValues = {},
  onSubmit,
  onAutoFill,
  loading = false,
  title = 'Create budget',
  subtitle = 'Build an annual or quarterly budget plan with clear cost targets.',
}) {
  const [form, setForm] = useState({
    ...initialState,
    ...initialValues,
  });

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const totalBudget = useMemo(() => {
    const operating = Number(form.operatingCost || 0);
    const payroll = Number(form.payrollBudget || 0);
    const capex = Number(form.capexBudget || 0);
    return operating + payroll + capex;
  }, [form.operatingCost, form.payrollBudget, form.capexBudget]);

  const projectedMargin = useMemo(() => {
    const revenue = Number(form.revenueTarget || 0);
    if (!revenue) return 0;
    return (((revenue - totalBudget) / revenue) * 100).toFixed(1);
  }, [form.revenueTarget, totalBudget]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({
      ...form,
      totalBudget,
      projectedMargin: Number(projectedMargin),
    });
  };

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-app-border bg-app-surface-2 px-5 py-4 md:px-6">
        <p className="text-sm text-app-muted">{subtitle}</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight">{title}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Input
            label="Budget name"
            placeholder="FY 2027 Engineering Budget"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
          />
          <Input
            label="Department"
            placeholder="Engineering"
            value={form.department}
            onChange={(e) => updateField('department', e.target.value)}
          />
          <Input
            label="Budget owner"
            placeholder="Ananya Patel"
            value={form.owner}
            onChange={(e) => updateField('owner', e.target.value)}
          />
          <Input
            label="Fiscal year"
            placeholder="2027"
            value={form.fiscalYear}
            onChange={(e) => updateField('fiscalYear', e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Input
            type="number"
            label="Revenue target"
            placeholder="15000000"
            value={form.revenueTarget}
            onChange={(e) => updateField('revenueTarget', e.target.value)}
          />
          <Input
            type="number"
            label="Operating cost"
            placeholder="3200000"
            value={form.operatingCost}
            onChange={(e) => updateField('operatingCost', e.target.value)}
          />
          <Input
            type="number"
            label="Payroll budget"
            placeholder="5400000"
            value={form.payrollBudget}
            onChange={(e) => updateField('payrollBudget', e.target.value)}
          />
          <Input
            type="number"
            label="Capex budget"
            placeholder="900000"
            value={form.capexBudget}
            onChange={(e) => updateField('capexBudget', e.target.value)}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-app-text">Notes</span>
            <textarea
              rows={6}
              value={form.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Add assumptions, department goals, planned hiring, vendor changes, or constraints."
              className="w-full rounded-2xl border border-app-border bg-app-surface-2 px-4 py-3 text-sm outline-none transition placeholder:text-app-muted focus:border-app-primary focus:ring-2 focus:ring-app-primary/20"
            />
          </label>

          <div className="rounded-2xl border border-app-border bg-app-surface-2 p-4">
            <p className="text-sm text-app-muted">Budget snapshot</p>

            <div className="mt-4 space-y-4">
              <div className="rounded-2xl bg-app-surface p-4">
                <div className="flex items-center gap-2 text-app-muted">
                  <IndianRupee className="h-4 w-4" />
                  <span className="text-sm">Total budget</span>
                </div>
                <p className="tabular mt-2 text-2xl font-semibold">
                  ₹{totalBudget.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="rounded-2xl bg-app-surface p-4">
                <div className="flex items-center gap-2 text-app-muted">
                  <CalendarDays className="h-4 w-4" />
                  <span className="text-sm">Projected margin</span>
                </div>
                <p className="tabular mt-2 text-2xl font-semibold">
                  {projectedMargin}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-app-border pt-5">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onAutoFill?.(form)}
          >
            <Wand2 className="h-4 w-4" />
            Auto-fill assumptions
          </Button>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setForm({ ...initialState, ...initialValues })}
            >
              Reset
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Save budget'}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}