import Card from '../common/Card.jsx';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const defaultData = [
  { name: 'Payroll', value: 58, color: 'var(--primary)' },
  { name: 'Operations', value: 18, color: 'var(--color-app-warning, #e8af34)' },
  { name: 'Software', value: 10, color: 'var(--color-app-success, #6daa45)' },
  { name: 'Marketing', value: 8, color: 'var(--color-app-danger, #d163a7)' },
  { name: 'Other', value: 6, color: 'var(--muted)' },
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const item = payload[0]?.payload;

  return (
    <div className="rounded-xl border border-app-border bg-app-surface px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-app-text">{item.name}</p>
      <p className="mt-1 text-xs text-app-muted">{item.value}% of total cost</p>
    </div>
  );
}

export default function CostBreakdownChart({
  data = defaultData,
  title = 'Cost breakdown',
  description = 'See how the budget is distributed across major cost heads.',
}) {
  return (
    <Card>
      <div className="mb-5">
        <p className="text-sm text-app-muted">{description}</p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight">{title}</h3>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={72}
                outerRadius={108}
                paddingAngle={3}
                stroke="transparent"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {data.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-2xl border border-app-border bg-app-surface-2 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-app-text">{item.name}</span>
              </div>
              <span className="tabular text-sm text-app-muted">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}