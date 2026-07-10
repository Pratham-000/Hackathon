import { useEffect, useState, useMemo } from 'react';
import {
  CreditCard,
  Plus,
  RefreshCcw,
  ShieldCheck,
  TrendingUp,
  Wallet,
  X,
  FileText,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import Card from '../../../components/common/Card.jsx';
import Button from '../../../components/common/Button.jsx';
import Input from '../../../components/common/Input.jsx';
import payrollApi from '../../../api/payrollApi.js';
import employeeApi from '../../../api/employeeApi.js';
import budgetApi from '../../../api/budgetApi.js';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Stats calculation
  const [stats, setStats] = useState({ totalProcessed: 0, activeMonthCost: 0, avgDeductions: 0 });

  // Modal / Run payroll state
  const [showRunModal, setShowRunModal] = useState(false);
  const [runMonth, setRunMonth] = useState('7'); // July
  const [runYear, setRunYear] = useState('2026');
  const [runLoading, setRunLoading] = useState(false);
  const [runError, setRunError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await payrollApi.getPayrolls({ limit: 100 });
      if (res && res.success && res.data) {
        setPayrolls(res.data.payrolls || []);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to retrieve payroll runs from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute summary stats dynamically
  const calculatedStats = useMemo(() => {
    const total = payrolls.length;
    const totalProcessedVal = payrolls
      .filter((p) => p.status === 'PROCESSED' || p.status === 'APPROVED')
      .reduce((sum, p) => sum + Number(p.netPayrollTotal || 0), 0);

    const activeMonthCostVal = payrolls[0] ? Number(payrolls[0].netPayrollTotal || 0) : 0;
    const avgDeductionsVal = total > 0
      ? payrolls.reduce((sum, p) => sum + Number(p.deductionsTotal || 0), 0) / total
      : 0;

    return {
      totalRuns: total,
      totalProcessed: totalProcessedVal,
      activeMonthCost: activeMonthCostVal,
      avgDeductions: avgDeductionsVal,
    };
  }, [payrolls]);

  const handleRunPayroll = async (e) => {
    e.preventDefault();
    setRunLoading(true);
    setRunError('');

    try {
      // 1. Fetch all active employees to sum up base salaries and bonuses
      const empRes = await employeeApi.getEmployees({ limit: 1000, isActive: 'true' });
      const employees = empRes?.data?.employees || [];

      if (employees.length === 0) {
        throw new Error('No active employees found to process payroll.');
      }

      // Calculate totals
      const baseSalaryTotal = employees.reduce((sum, emp) => sum + Number(emp.salary || 0), 0) / 12; // Monthly run
      const bonusTotal = employees.reduce((sum, emp) => sum + Number(emp.bonus || 0), 0) / 12;
      const deductionsTotal = baseSalaryTotal * 0.12; // Standard 12% PF / Deductions
      const netPayrollTotal = baseSalaryTotal + bonusTotal - deductionsTotal;

      const userStr = localStorage.getItem('authUser');
      if (!userStr) throw new Error('User session not found.');
      const user = JSON.parse(userStr);

      // Find first budget/version to assign payroll reference
      const budgetsRes = await budgetApi.getBudgets();
      const firstBudget = budgetsRes?.data?.budgets?.[0];
      const budgetId = firstBudget?.id || undefined;
      const budgetVersionId = firstBudget?.versions?.[0]?.id || undefined;

      const payload = {
        month: Number(runMonth),
        year: Number(runYear),
        baseSalaryTotal,
        bonusTotal,
        deductionsTotal,
        netPayrollTotal,
        status: 'PROCESSED',
        organizationId: user.organizationId || firstBudget?.organizationId || 'org-id',
        budgetId,
        budgetVersionId,
      };

      await payrollApi.createPayroll(payload);
      setShowRunModal(false);
      loadData();
    } catch (err) {
      console.error(err);
      setRunError(err.message || 'Failed to execute payroll computation run');
    } finally {
      setRunLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await payrollApi.updatePayroll(id, { status: 'APPROVED' });
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to approve payroll run.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to rollback/delete this payroll run?')) return;
    try {
      await payrollApi.deletePayroll(id);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete payroll run.');
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-app-muted">
            Financial operations
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Payroll</h1>
          <p className="mt-2 max-w-2xl text-sm text-app-muted md:text-base">
            Track monthly workforce payouts, execute compensation runs, and approve department allocations.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={loadData} disabled={loading}>
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowRunModal(true)}>
            <Plus className="h-4 w-4" />
            Run Payroll
          </Button>
        </div>
      </section>

      {error ? (
        <div className="rounded-xl border border-app-danger/30 bg-app-danger/10 px-4 py-3 text-sm text-app-danger">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <BudgetSummaryCard
          title="Total Runs Executed"
          value={loading ? '...' : String(calculatedStats.totalRuns)}
          meta="Completed monthly cycles"
          icon={Calendar}
        />
        <BudgetSummaryCard
          title="Processed Payouts"
          value={loading ? '...' : formatCurrency(calculatedStats.totalProcessed)}
          meta="Cumulative net disbursements"
          icon={ShieldCheck}
        />
        <BudgetSummaryCard
          title="Last Month Cost"
          value={loading ? '...' : formatCurrency(calculatedStats.activeMonthCost)}
          meta="Latest cycle net run rate"
          icon={Wallet}
        />
        <BudgetSummaryCard
          title="Average Deductions"
          value={loading ? '...' : formatCurrency(calculatedStats.avgDeductions)}
          meta="Standard tax/provident funds"
          icon={CreditCard}
        />
      </section>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-app-border px-5 py-4 md:px-6">
          <p className="text-sm text-app-muted">Payroll run history</p>
          <h2 className="mt-1 text-lg font-semibold">Active Ledger</h2>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-app-muted">Loading payroll entries...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-app-surface-2 text-sm text-app-muted">
                <tr>
                  <th className="px-6 py-4 font-medium">Period</th>
                  <th className="px-6 py-4 font-medium text-right">Base Salary</th>
                  <th className="px-6 py-4 font-medium text-right">Bonuses</th>
                  <th className="px-6 py-4 font-medium text-right">Deductions</th>
                  <th className="px-6 py-4 font-medium text-right">Net Payout</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payrolls.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-app-border bg-app-surface transition hover:bg-app-surface-2"
                  >
                    <td className="px-6 py-5 text-sm font-medium">
                      {monthNames[p.month - 1]} {p.year}
                    </td>
                    <td className="tabular px-6 py-5 text-sm text-right">{formatCurrency(p.baseSalaryTotal)}</td>
                    <td className="tabular px-6 py-5 text-sm text-right text-app-muted">{formatCurrency(p.bonusTotal || 0)}</td>
                    <td className="tabular px-6 py-5 text-sm text-right text-app-muted">-{formatCurrency(p.deductionsTotal || 0)}</td>
                    <td className="tabular px-6 py-5 text-sm font-semibold text-right text-app-primary">
                      {formatCurrency(p.netPayrollTotal)}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          p.status === 'APPROVED'
                            ? 'bg-app-success/10 text-app-success'
                            : p.status === 'PROCESSED'
                            ? 'bg-app-primary/10 text-app-primary'
                            : 'bg-app-surface-3 text-app-muted'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right space-x-2">
                      {p.status !== 'APPROVED' ? (
                        <button
                          onClick={() => handleApprove(p.id)}
                          className="text-xs font-semibold text-app-success hover:underline"
                        >
                          Approve
                        </button>
                      ) : null}
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-xs font-semibold text-app-danger hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Run Payroll Modal */}
      {showRunModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[28px] border border-app-border bg-app-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-app-border pb-4">
              <h2 className="text-xl font-semibold">Run Monthly Payroll</h2>
              <button
                onClick={() => setShowRunModal(false)}
                className="rounded-lg p-1.5 hover:bg-app-surface-2 text-app-muted hover:text-app-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {runError ? (
              <div className="mt-4 rounded-xl border border-app-danger/30 bg-app-danger/10 px-4 py-3 text-sm text-app-danger">
                {runError}
              </div>
            ) : null}

            <form onSubmit={handleRunPayroll} className="mt-4 space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-app-muted">
                  Select Month
                </label>
                <select
                  value={runMonth}
                  onChange={(e) => setRunMonth(e.target.value)}
                  className="h-11 w-full rounded-xl border border-app-border bg-app-surface-2 px-4 text-sm text-app-text outline-none focus:border-app-primary"
                >
                  {monthNames.map((name, idx) => (
                    <option key={name} value={idx + 1}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-app-muted">
                  Select Year
                </label>
                <select
                  value={runYear}
                  onChange={(e) => setRunYear(e.target.value)}
                  className="h-11 w-full rounded-xl border border-app-border bg-app-surface-2 px-4 text-sm text-app-text outline-none focus:border-app-primary"
                >
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                </select>
              </div>

              <div className="rounded-2xl border border-app-border bg-app-surface-2 p-4 text-xs text-app-muted leading-5">
                <p className="font-semibold text-app-text mb-1">Heuristics calculation:</p>
                - Pulls all currently active staff members in directory.<br />
                - Aggregates base salary and bonus rates.<br />
                - Auto-calculates 12% PF / Deductions.
              </div>

              <div className="flex justify-end gap-3 border-t border-app-border pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowRunModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={runLoading}>
                  {runLoading ? 'Running...' : 'Execute Run'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function BudgetSummaryCard({ title, value, meta, icon: Icon }) {
  return (
    <Card className="p-4 md:p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-app-muted">{title}</p>
          <p className="tabular mt-2 text-2xl font-semibold tracking-tight">{value}</p>
          <p className="mt-2 text-sm text-app-muted">{meta}</p>
        </div>
        <div className="rounded-xl bg-app-surface-2 p-2.5 text-app-muted">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </Card>
  );
}
