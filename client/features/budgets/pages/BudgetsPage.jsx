import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  CalendarRange,
  ChevronRight,
  CircleDollarSign,
  Filter,
  Plus,
  Search,
  Wallet,
  X,
} from 'lucide-react';
import Card from '../../../components/common/Card.jsx';
import Button from '../../../components/common/Button.jsx';
import Input from '../../../components/common/Input.jsx';
import budgetApi from '../../../api/budgetApi.js';

const statusStyles = {
  ACTIVE: 'bg-app-success/10 text-app-success',
  DRAFT: 'bg-app-warning/10 text-app-warning',
  ARCHIVED: 'bg-app-surface-3 text-app-muted',
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const formatCompact = (value) =>
  new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(value);

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

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [fiscalYear, setFiscalYear] = useState('ALL');

  // Modal / Create Form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formYear, setFormYear] = useState('2026');
  const [formRevenue, setFormRevenue] = useState('10000000');
  const [formExpenses, setFormExpenses] = useState('7500000');
  const [formStatus, setFormStatus] = useState('DRAFT');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  const fetchBudgets = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await budgetApi.getBudgets();
      if (res && res.success && res.data) {
        setBudgets(res.data.budgets || []);
      }
    } catch (err) {
      console.error('Failed to fetch budgets:', err);
      setError('Could not fetch budgets from server. Displaying fallback view.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const filteredBudgets = useMemo(() => {
    return budgets.filter((budget) => {
      const name = budget.name || '';
      const dept = budget.department || 'Organization Wide';
      const id = budget.id || '';

      const matchesSearch =
        name.toLowerCase().includes(search.toLowerCase()) ||
        dept.toLowerCase().includes(search.toLowerCase()) ||
        id.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === 'ALL' ? true : budget.status === status;
      const matchesYear =
        fiscalYear === 'ALL' ? true : String(budget.fiscalYear) === fiscalYear;

      return matchesSearch && matchesStatus && matchesYear;
    });
  }, [budgets, search, status, fiscalYear]);

  const totals = useMemo(() => {
    return filteredBudgets.reduce(
      (acc, item) => {
        acc.revenue += Number(item.totalRevenue || 0);
        acc.expenses += Number(item.totalExpenses || 0);
        acc.profit += Number(item.totalProfit || 0);
        return acc;
      },
      { revenue: 0, expenses: 0, profit: 0 }
    );
  }, [filteredBudgets]);

  const activeCount = filteredBudgets.filter((item) => item.status === 'ACTIVE').length;

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError('');

    try {
      const userStr = localStorage.getItem('authUser');
      if (!userStr) {
        throw new Error('User session not found. Please log in again.');
      }
      const user = JSON.parse(userStr);

      const payload = {
        name: formName.trim(),
        description: formDesc.trim(),
        fiscalYear: Number(formYear),
        totalRevenue: Number(formRevenue),
        totalExpenses: Number(formExpenses),
        totalProfit: Number(formRevenue) - Number(formExpenses),
        status: formStatus,
        organizationId: user.organizationId || budgets[0]?.organizationId || 'org-id',
        createdById: user.id || 'user-id',
      };

      await budgetApi.createBudget(payload);
      setShowCreateModal(false);
      // Reset form
      setFormName('');
      setFormDesc('');
      setFormYear('2026');
      setFormRevenue('10000000');
      setFormExpenses('7500000');
      setFormStatus('DRAFT');
      // Refresh list
      fetchBudgets();
    } catch (err) {
      console.error(err);
      setCreateError(err.message || 'Failed to create budget');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-app-muted">
            Budget planning
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Budgets</h1>
          <p className="mt-2 max-w-2xl text-sm text-app-muted md:text-base">
            Review annual and departmental budgets, compare revenue against expense plans,
            and keep active versions visible for decision-making.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={fetchBudgets} disabled={loading}>
            Refresh
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4" />
            Create budget
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
          title="Tracked budgets"
          value={loading ? '...' : String(filteredBudgets.length)}
          meta={`${activeCount} currently active`}
          icon={Wallet}
        />
        <BudgetSummaryCard
          title="Planned revenue"
          value={loading ? '...' : formatCompact(totals.revenue)}
          meta="Across current filtered set"
          icon={CircleDollarSign}
        />
        <BudgetSummaryCard
          title="Planned expenses"
          value={loading ? '...' : formatCompact(totals.expenses)}
          meta="Operating and payroll included"
          icon={CalendarRange}
        />
        <BudgetSummaryCard
          title="Planned profit"
          value={loading ? '...' : formatCompact(totals.profit)}
          meta={
            totals.revenue > 0
              ? `${((totals.profit / totals.revenue) * 100).toFixed(1)}% blended margin`
              : 'No revenue selected'
          }
          icon={ArrowUpRight}
        />
      </section>

      <Card>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm text-app-muted">Filters</p>
            <h2 className="mt-1 text-lg font-semibold">Find the right budget quickly</h2>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-app-surface-2 px-3 py-2 text-sm text-app-muted">
            <Filter className="h-4 w-4" />
            Smart review view
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-[1.5fr_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted" />
            <Input
              placeholder="Search by budget name, id, or department"
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-11 rounded-xl border border-app-border bg-app-surface-2 px-4 text-sm text-app-text outline-none focus:border-app-primary focus:ring-2 focus:ring-app-primary/20"
          >
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <select
            value={fiscalYear}
            onChange={(e) => setFiscalYear(e.target.value)}
            className="h-11 rounded-xl border border-app-border bg-app-surface-2 px-4 text-sm text-app-text outline-none focus:border-app-primary focus:ring-2 focus:ring-app-primary/20"
          >
            <option value="ALL">All fiscal years</option>
            <option value="2026">FY 2026</option>
            <option value="2025">FY 2025</option>
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-app-border px-5 py-4 md:px-6">
          <div>
            <p className="text-sm text-app-muted">Budget register</p>
            <h2 className="mt-1 text-lg font-semibold">Planning records</h2>
          </div>
          <p className="text-sm text-app-muted">
            {filteredBudgets.length} result{filteredBudgets.length !== 1 ? 's' : ''}
          </p>
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm text-app-muted">Loading budgets from server...</div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <thead className="bg-app-surface-2 text-sm text-app-muted">
                  <tr>
                    <th className="px-6 py-4 font-medium">Budget</th>
                    <th className="px-6 py-4 font-medium">Department</th>
                    <th className="px-6 py-4 font-medium">Revenue</th>
                    <th className="px-6 py-4 font-medium">Expenses</th>
                    <th className="px-6 py-4 font-medium">Profit</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Owner</th>
                    <th className="px-6 py-4 font-medium">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBudgets.map((budget) => (
                    <tr
                      key={budget.id}
                      className="border-t border-app-border bg-app-surface transition hover:bg-app-surface-2"
                    >
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-medium">{budget.name}</p>
                          <p className="mt-1 text-xs text-app-muted">
                            {budget.id} · FY {budget.fiscalYear}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm">{budget.department?.name || 'Organization Wide'}</td>
                      <td className="tabular px-6 py-5 text-sm">{formatCurrency(budget.totalRevenue)}</td>
                      <td className="tabular px-6 py-5 text-sm">{formatCurrency(budget.totalExpenses)}</td>
                      <td className="tabular px-6 py-5 text-sm font-medium">{formatCurrency(budget.totalProfit)}</td>
                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[budget.status]}`}
                        >
                          {budget.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm">{budget.createdBy?.fullName || 'Admin User'}</td>
                      <td className="px-6 py-5 text-sm text-app-muted">
                        {new Date(budget.updatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 p-4 lg:hidden">
              {filteredBudgets.map((budget) => (
                <div
                  key={budget.id}
                  className="rounded-2xl border border-app-border bg-app-surface-2 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{budget.name}</p>
                      <p className="mt-1 text-sm text-app-muted">
                        {budget.id} · {budget.department?.name || 'Organization Wide'}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[budget.status]}`}
                    >
                      {budget.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-app-muted">Revenue</p>
                      <p className="tabular mt-1 font-medium">{formatCurrency(budget.totalRevenue)}</p>
                    </div>
                    <div>
                      <p className="text-app-muted">Expenses</p>
                      <p className="tabular mt-1 font-medium">{formatCurrency(budget.totalExpenses)}</p>
                    </div>
                    <div>
                      <p className="text-app-muted">Profit</p>
                      <p className="tabular mt-1 font-medium">{formatCurrency(budget.totalProfit)}</p>
                    </div>
                    <div>
                      <p className="text-app-muted">Owner</p>
                      <p className="mt-1 font-medium">{budget.createdBy?.fullName || 'Admin User'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {filteredBudgets.length === 0 && !loading ? (
          <div className="px-6 py-12 text-center">
            <p className="text-lg font-semibold">No budgets found</p>
            <p className="mt-2 text-sm text-app-muted">
              Adjust your filters or create a new budget to start planning.
            </p>
          </div>
        ) : null}
      </Card>

      {/* Create Budget Modal */}
      {showCreateModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-[28px] border border-app-border bg-app-surface p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-app-border pb-4">
              <h2 className="text-xl font-semibold">Create New Budget</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-1.5 hover:bg-app-surface-2 text-app-muted hover:text-app-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {createError ? (
              <div className="mt-4 rounded-xl border border-app-danger/30 bg-app-danger/10 px-4 py-3 text-sm text-app-danger">
                {createError}
              </div>
            ) : null}

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4">
              <Input
                label="Budget Name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. FY 2026 Expansion Plan"
                required
              />

              <Input
                label="Description"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Brief description of this plan"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Fiscal Year
                  </label>
                  <select
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    className="h-11 w-full rounded-xl border border-app-border bg-app-surface-2 px-4 text-sm text-app-text outline-none focus:border-app-primary focus:ring-2 focus:ring-app-primary/20"
                  >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Initial Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="h-11 w-full rounded-xl border border-app-border bg-app-surface-2 px-4 text-sm text-app-text outline-none focus:border-app-primary focus:ring-2 focus:ring-app-primary/20"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="ACTIVE">Active</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Planned Revenue (INR)"
                  type="number"
                  value={formRevenue}
                  onChange={(e) => setFormRevenue(e.target.value)}
                  required
                />

                <Input
                  label="Planned Expenses (INR)"
                  type="number"
                  value={formExpenses}
                  onChange={(e) => setFormExpenses(e.target.value)}
                  required
                />
              </div>

              <div className="rounded-xl bg-app-surface-2 p-3 text-sm text-app-muted">
                Blended planned margin: <span className="font-semibold text-app-text">
                  {formatCurrency(Number(formRevenue || 0) - Number(formExpenses || 0))}
                </span>
              </div>

              <div className="flex justify-end gap-3 border-t border-app-border pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createLoading}>
                  {createLoading ? 'Creating...' : 'Create Budget'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}