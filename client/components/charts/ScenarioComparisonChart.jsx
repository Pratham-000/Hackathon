import Card from '../common/Card.jsx';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const defaultData = [
  { name: 'Base', value: 26.4, fill: 'var(--primary)' },
  { name: 'Conservative', value: 29.1, fill: 'var(--color-app-success, #6daa45)' },
  { name: 'Aggressive', value: 22.8, fill: 'var(--color-app-warning, #e8af34)' },
  { name: 'Hiring Freeze', value: 31.2, fill: 'var(--color-app-danger, #d163a7)' },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-app-border bg-app-surface px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-app-text">{label}</p>
      <p className="mt-1 text-xs text-app-muted">
        Projected margin: {payload[0].value}%
      </p>
    </div>
  );
}

export default function ScenarioComparisonChart({
  data = defaultData,
  title = 'Scenario comparison',
  description = 'Compare outcome quality across planning options.',
}) {
  return (
    <Card>
      <div className="mb-5">
        <p className="text-sm text-app-muted">{description}</p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight">{title}</h3>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted)', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted)', fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {data.map((item) => (
          <div
            key={item.name}
            className="rounded-2xl border border-app-border bg-app-surface-2 px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <p className="text-sm font-medium">{item.name}</p>
            </div>
            <p className="tabular mt-2 text-lg font-semibold">{item.value}%</p>
          </div>
        ))}
      </div>
    </Card>
  );
}