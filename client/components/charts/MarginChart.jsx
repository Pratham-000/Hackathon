import Card from '../common/Card.jsx';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const defaultData = [
  { month: 'Jan', margin: 18.4 },
  { month: 'Feb', margin: 19.1 },
  { month: 'Mar', margin: 21.3 },
  { month: 'Apr', margin: 22.8 },
  { month: 'May', margin: 24.2 },
  { month: 'Jun', margin: 26.1 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-app-border bg-app-surface px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-app-text">{label}</p>
      <p className="mt-1 text-xs text-app-muted">
        Margin: {payload[0].value}%
      </p>
    </div>
  );
}

export default function MarginChart({
  data = defaultData,
  benchmark = 22,
  title = 'Margin trend',
  description = 'Track operating margin movement against your target threshold.',
}) {
  return (
    <Card>
      <div className="mb-5">
        <p className="text-sm text-app-muted">{description}</p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight">{title}</h3>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="marginFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.28} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.02} />
              </linearGradient>
            </defs>

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
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={benchmark}
              stroke="var(--muted)"
              strokeDasharray="4 4"
            />
            <Area
              type="monotone"
              dataKey="margin"
              stroke="var(--primary)"
              fill="url(#marginFill)"
              strokeWidth={2.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}