import { ChevronRight, Download, Filter, Wallet } from 'lucide-react';
import Button from '../common/Button.jsx';
import Card from '../common/Card.jsx';

const defaultRows = [
  {
    id: 'PAY-2026-07-001',
    employeeName: 'Aarav Mehta',
    department: 'Engineering',
    month: 'Jul 2026',
    baseSalary: 220000,
    bonus: 15000,
    deductions: 12000,
    netPayroll: 223000,
    status: 'Processed',
  },
  {
    id: 'PAY-2026-07-002',
    employeeName: 'Priya Nair',
    department: 'Finance',
    month: 'Jul 2026',
    baseSalary: 185000,
    bonus: 10000,
    deductions: 9000,
    netPayroll: 186000,
    status: 'Processed',
  },
  {
    id: 'PAY-2026-07-003',
    employeeName: 'Rohan Kapoor',
    department: 'Sales',
    month: 'Jul 2026',
    baseSalary: 165000,
    bonus: 28000,
    deductions: 11000,
    netPayroll: 182000,
    status: 'Pending',
  },
  {
    id: 'PAY-2026-07-004',
    employeeName: 'Megha Iyer',
    department: 'HR',
    month: 'Jul 2026',
    baseSalary: 142000,
    bonus: 8000,
    deductions: 7000,
    netPayroll: 143000,
    status: 'Processed',
  },
];

const statusStyles = {
  Processed: 'bg-app-success/10 text-app-success',
  Pending: 'bg-app-warning/10 text-app-warning',
  Failed: 'bg-app-danger/10 text-app-danger',
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function PayrollTable({
  rows = defaultRows,
  title = 'Payroll register',
  subtitle = 'Monthly compensation review',
  showActions = true,
  compact = false,
}) {
  if (!rows?.length) {
    return (
      <Card className="p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-app-surface-2 text-app-muted">
          <Wallet className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No payroll records found</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-app-muted">
          Payroll entries will appear here after records are generated or synced from your backend.
        </p>
      </Card>
    );
  }

  return (
    <Card className={compact ? 'p-0' : 'overflow-hidden p-0'}>
      <div className="flex flex-col gap-4 border-b border-app-border px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <p className="text-sm text-app-muted">{subtitle}</p>
          <h2 className="mt-1 text-lg font-semibold">{title}</h2>
        </div>

        {showActions ? (
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" size="sm">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="secondary" size="sm">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        ) : null}
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full text-left">
          <thead className="bg-app-surface-2 text-sm text-app-muted">
            <tr>
              <th className="px-6 py-4 font-medium">Employee</th>
              <th className="px-6 py-4 font-medium">Department</th>
              <th className="px-6 py-4 font-medium">Month</th>
              <th className="px-6 py-4 text-right font-medium">Base salary</th>
              <th className="px-6 py-4 text-right font-medium">Bonus</th>
              <th className="px-6 py-4 text-right font-medium">Deductions</th>
              <th className="px-6 py-4 text-right font-medium">Net payroll</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-app-border bg-app-surface transition hover:bg-app-surface-2"
              >
                <td className="px-6 py-5">
                  <div>
                    <p className="font-medium">{row.employeeName}</p>
                    <p className="mt-1 text-sm text-app-muted">{row.id}</p>
                  </div>
                </td>

                <td className="px-6 py-5 text-sm">{row.department}</td>
                <td className="px-6 py-5 text-sm text-app-muted">{row.month}</td>

                <td className="tabular px-6 py-5 text-right text-sm">
                  {formatCurrency(row.baseSalary)}
                </td>
                <td className="tabular px-6 py-5 text-right text-sm">
                  {formatCurrency(row.bonus)}
                </td>
                <td className="tabular px-6 py-5 text-right text-sm">
                  {formatCurrency(row.deductions)}
                </td>
                <td className="tabular px-6 py-5 text-right text-sm font-semibold">
                  {formatCurrency(row.netPayroll)}
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      statusStyles[row.status] || 'bg-app-surface-3 text-app-muted'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <button className="inline-flex items-center gap-2 text-sm font-medium text-app-primary">
                    View
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 p-4 lg:hidden">
        {rows.map((row) => (
          <div
            key={row.id}
            className="rounded-2xl border border-app-border bg-app-surface-2 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{row.employeeName}</p>
                <p className="mt-1 text-sm text-app-muted">
                  {row.department} · {row.month}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  statusStyles[row.status] || 'bg-app-surface-3 text-app-muted'
                }`}
              >
                {row.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-app-muted">Base salary</p>
                <p className="tabular mt-1 font-medium">{formatCurrency(row.baseSalary)}</p>
              </div>

              <div>
                <p className="text-app-muted">Bonus</p>
                <p className="tabular mt-1 font-medium">{formatCurrency(row.bonus)}</p>
              </div>

              <div>
                <p className="text-app-muted">Deductions</p>
                <p className="tabular mt-1 font-medium">{formatCurrency(row.deductions)}</p>
              </div>

              <div>
                <p className="text-app-muted">Net payroll</p>
                <p className="tabular mt-1 font-semibold">{formatCurrency(row.netPayroll)}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-app-muted">{row.id}</p>
              <button className="inline-flex items-center gap-2 text-sm font-medium text-app-primary">
                View
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}