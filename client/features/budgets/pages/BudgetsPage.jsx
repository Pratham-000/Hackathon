import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  CalendarRange,
  ChevronRight,
  CircleDollarSign,
  Filter,
  Plus,
  Search,
  Wallet,
} from 'lucide-react';
import Card from '../../../components/common/Card.jsx';
import Button from '../../../components/common/Button.jsx';
import Input from '../../../components/common/Input.jsx';

const mockBudgets = [
  {
    id: 'BUD-2026-001',
    name: 'FY26 Corporate Plan',
    department: 'Organization Wide',
    fiscalYear: 2026,
    totalRevenue: 12500000,
    totalExpenses: 9100000,
    totalProfit: 3400000,
    status: 'ACTIVE',
    owner: 'Ananya Rao',
    updatedAt: '2026-07-07',
  },
  {
    id: 'BUD-2026-002',
    name: 'Engineering Expansion',
    department: 'Engineering',
    fiscalYear: 2026,
    totalRevenue: 3200000,
    totalExpenses: 2750000,
    totalProfit: 450000,
    status: 'DRAFT',
    owner: 'Rohit Sharma',
    updatedAt: '2026-07-05',
  },
  {
    id: 'BUD-2026-003',
    name: 'Sales Growth Plan',
    department: 'Sales',
    fiscalYear: 2026,
    totalRevenue: 4100000,
    totalExpenses: 2680000,
    totalProfit: 1420000,
    status: 'ACTIVE',
    owner: 'Meera Nair',
    updatedAt: '2026-07-04',
  },
  {
    id: 'BUD-2025-009',
    name: 'HR Capability Buildout',
    department: 'HR',
    fiscalYear: 2025,
    totalRevenue: 850000,
    totalExpenses: 790000,
    totalProfit: 60000,
    status: 'ARCHIVED',
    owner: 'Priya Verma',
    updatedAt: '2026-06-28',
  },
  {
    id: 'BUD-2026-004',
    name: 'Operations Efficiency Drive',
    department: 'Operations',
    fiscalYear: 2026,
    totalRevenue: 2800000,
    totalExpenses: 2300000,
    totalProfit: 500000,
    status: 'ACTIVE',
    owner: 'Karan Malhotra',
    updatedAt: '2026-07-02',
  },
];

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
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [fiscalYear, setFiscalYear] = useState('ALL');

  const filteredBudgets = useMemo(() => {
    return mockBudgets.filter((budget) => {
      const matchesSearch =
        budget.name.toLowerCase().includes(search.toLowerCase()) ||
        budget.department.toLowerCase().includes(search.toLowerCase()) ||
        budget.id.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === 'ALL' ? true : budget.status === status;
      const matchesYear =
        fiscalYear === 'ALL' ? true : String(budget.fiscalYear) === fiscalYear;

      return matchesSearch && matchesStatus && matchesYear;
    });
  }, [search, status, fiscalYear]);

  const totals = useMemo(() => {
    return filteredBudgets.reduce(
      (acc, item) => {
        acc.revenue += item.totalRevenue;
        acc.expenses += item.totalExpenses;
        acc.profit += item.totalProfit;
        return acc;
      },
      { revenue: 0, expenses: 0, profit: 0 }
    );
  }, [filteredBudgets]);

  const activeCount = filteredBudgets.filter((item) => item.status === 'ACTIVE').length;

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
          <Button variant="secondary">
            <ArrowUpRight className="h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4" />
            Create budget
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <BudgetSummaryCard
          title="Tracked budgets"
          value={String(filteredBudgets.length)}
          meta={`${activeCount} currently active`}
          icon={Wallet}
        />
        <BudgetSummaryCard
          title="Planned revenue"
          value={formatCompact(totals.revenue)}
          meta="Across current filtered set"
          icon={CircleDollarSign}
        />
        <BudgetSummaryCard
          title="Planned expenses"
          value={formatCompact(totals.expenses)}
          meta="Operating and payroll included"
          icon={CalendarRange}
        />
        <BudgetSummaryCard
          title="Planned profit"
          value={formatCompact(totals.profit)}
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
                      <p className="mt-1 text-sm text-app-muted">
                        {budget.id} · FY {budget.fiscalYear}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm">{budget.department}</td>
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
                  <td className="px-6 py-5 text-sm">{budget.owner}</td>
                  <td className="px-6 py-5 text-sm text-app-muted">{budget.updatedAt}</td>
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
                    {budget.id} · {budget.department}
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
                  <p className="mt-1 font-medium">{budget.owner}</p>
                </div>
              </div>

              <button className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-app-primary">
                Open budget
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {filteredBudgets.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-lg font-semibold">No budgets found</p>
            <p className="mt-2 text-sm text-app-muted">
              Adjust your filters or create a new budget to start planning.
            </p>
          </div>
        ) : null}
      </Card>
    </div>
  );
}