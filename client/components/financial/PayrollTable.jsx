import { MoreHorizontal } from 'lucide-react';
import Card from '../common/Card.jsx';
import Button from '../common/Button.jsx';

const defaultRows = [
  {
    id: 'EMP-001',
    name: 'Ananya Patel',
    department: 'Engineering',
    salary: 185000,
    bonus: 25000,
    status: 'Processed',
    month: 'Jun 2026',
  },
  {
    id: 'EMP-002',
    name: 'Rohit Mehra',
    department: 'Finance',
    salary: 142000,
    bonus: 18000,
    status: 'Pending',
    month: 'Jun 2026',
  },
  {
    id: 'EMP-003',
    name: 'Priya Nair',
    department: 'Operations',
    salary: 128000,
    bonus: 12000,
    status: 'Processed',
    month: 'Jun 2026',
  },
  {
    id: 'EMP-004',
    name: 'Karan Shah',
    department: 'Sales',
    salary: 156000,
    bonus: 30000,
    status: 'Review',
    month: 'Jun 2026',
  },
];

const statusClasses = {
  Processed: 'bg-app-success/15 text-app-success',
  Pending: 'bg-app-warning/15 text-app-warning',
  Review: 'bg-app-primary/15 text-app-primary',
};

export default function PayrollTable({
  rows = defaultRows,
  title = 'Payroll register',
  description = 'Review payroll records, payouts, and current processing state.',
  onRowAction,
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-app-border px-5 py-4 md:px-6">
        <p className="text-sm text-app-muted">{description}</p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight text-app-text">
          {title}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-app-surface-2">
            <tr className="text-left text-xs font-semibold uppercase tracking-[0.14em] text-app-muted">
              <th className="px-5 py-3 md:px-6">Employee</th>
              <th className="px-5 py-3">Department</th>
              <th className="px-5 py-3">Month</th>
              <th className="px-5 py-3 text-right">Salary</th>
              <th className="px-5 py-3 text-right">Bonus</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right md:px-6">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-app-border">
            {rows.map((row) => (
              <tr key={row.id} className="bg-app-surface">
                <td className="px-5 py-4 md:px-6">
                  <div>
                    <p className="font-medium text-app-text">{row.name}</p>
                    <p className="mt-1 text-sm text-app-muted">{row.id}</p>
                  </div>
                </td>

                <td className="px-5 py-4 text-sm text-app-muted">{row.department}</td>
                <td className="px-5 py-4 text-sm text-app-muted">{row.month}</td>

                <td className="tabular px-5 py-4 text-right text-sm font-medium text-app-text">
                  ₹{row.salary.toLocaleString('en-IN')}
                </td>

                <td className="tabular px-5 py-4 text-right text-sm font-medium text-app-text">
                  ₹{row.bonus.toLocaleString('en-IN')}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      statusClasses[row.status] || 'bg-app-surface-2 text-app-muted'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-right md:px-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRowAction?.(row)}
                    className="h-9 w-9 px-0"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}