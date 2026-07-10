import Card from '../common/Card.jsx';
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

const defaultData = [
  { month: 'Jan', actual: 82, forecast: 80 },
  { month: 'Feb', actual: 88, forecast: 84 },
  { month: 'Mar', actual: 91, forecast: 90 },
  { month: 'Apr', actual: 96, forecast: 93 },
  { month: 'May', actual: 102, forecast: 98 },
  { month: 'Jun', actual: 108, forecast: 103 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-app-border bg-app-surface px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-app-text">{label}</p>
      {payload.map((item) => (
        <p key={item.dataKey} className="mt-1 text-xs text-app-muted">
          {item.name}: ₹{item.value}L
        </p>
      ))}
    </div>
  );
}

export default function RevenueChart({
  data = defaultData,
  title = 'Revenue performance',
  description = 'Compare actual collections against forecasted revenue.',
}) {
  return (
    <Card>
      <div className="mb-5">
        <p className="text-sm text-app-muted">{description}</p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight">{title}</h3>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={10}>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted)', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted)', fontSize: 12 }}
              tickFormatter={(value) => `₹${value}L`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar
              dataKey="actual"
              name="Actual"
              fill="var(--primary)"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="forecast"
              name="Forecast"
              fill="var(--surface-3, #d8d5ce)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}