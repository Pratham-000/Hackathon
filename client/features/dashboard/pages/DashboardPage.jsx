import Card from '../../../components/common/Card.jsx';
import Button from '../../../components/common/Button.jsx';
import {
  ArrowUpRight,
  BadgeIndianRupee,
  BriefcaseBusiness,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const trendData = [
  { name: 'Jan', revenue: 82, expense: 63 },
  { name: 'Feb', revenue: 88, expense: 66 },
  { name: 'Mar', revenue: 91, expense: 70 },
  { name: 'Apr', revenue: 95, expense: 73 },
  { name: 'May', revenue: 99, expense: 74 },
  { name: 'Jun', revenue: 108, expense: 79 },
];

const payrollData = [
  { team: 'Engineering', cost: 28 },
  { team: 'Sales', cost: 19 },
  { team: 'Operations', cost: 14 },
  { team: 'HR', cost: 7 },
  { team: 'Finance', cost: 9 },
];

const kpis = [
  {
    title: 'Revenue',
    value: '₹1.08Cr',
    delta: '+8.4%',
    positive: true,
    icon: BadgeIndianRupee,
  },
  {
    title: 'Payroll Cost',
    value: '₹77.0L',
    delta: '+3.1%',
    positive: false,
    icon: Users,
  },
  {
    title: 'Operating Margin',
    value: '26.9%',
    delta: '+2.2%',
    positive: true,
    icon: TrendingUp,
  },
  {
    title: 'Open Scenarios',
    value: '12',
    delta: '-2',
    positive: true,
    icon: BriefcaseBusiness,
  },
];

function KpiCard({ item }) {
  const Icon = item.icon;

  return (
    <Card className="p-4 md:p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-app-muted">{item.title}</p>
          <p className="tabular mt-2 text-2xl font-semibold tracking-tight">{item.value}</p>
        </div>
        <div className="rounded-xl bg-app-surface-2 p-2.5 text-app-muted">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm">
        {item.positive ? (
          <TrendingUp className="h-4 w-4 text-app-success" />
        ) : (
          <TrendingDown className="h-4 w-4 text-app-warning" />
        )}
        <span className={item.positive ? 'text-app-success' : 'text-app-warning'}>
          {item.delta}
        </span>
        <span className="text-app-muted">vs last month</span>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <KpiCard key={item.title} item={item} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-app-muted">Performance</p>
              <h2 className="mt-1 text-lg font-semibold">Revenue vs expense</h2>
            </div>
            <Button variant="secondary" size="sm">
              Export
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--primary)"
                  fill="url(#rev)"
                  strokeWidth={2.4}
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="var(--muted)"
                  fill="transparent"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-6">
            <p className="text-sm text-app-muted">Allocation</p>
            <h2 className="mt-1 text-lg font-semibold">Payroll by function</h2>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payrollData} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="team" tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} width={84} />
                <Tooltip />
                <Bar dataKey="cost" fill="var(--primary)" radius={[8, 8, 8, 8]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-app-muted">Scenario watchlist</p>
              <h2 className="mt-1 text-lg font-semibold">Decisions needing review</h2>
            </div>
            <Button variant="ghost" size="sm">Open planner</Button>
          </div>

          <div className="mt-5 space-y-3">
            {[
              ['Hiring freeze in Q3', 'Extends runway by 2.4 months', 'Low risk'],
              ['5% sales upside case', 'Adds ₹14.2L operating result', 'Medium confidence'],
              ['Bonus reduction test', 'Improves cash efficiency', 'High sensitivity'],
            ].map(([title, desc, tag]) => (
              <div
                key={title}
                className="flex items-start justify-between rounded-2xl border border-app-border bg-app-surface-2 p-4"
              >
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="mt-1 text-sm text-app-muted">{desc}</p>
                </div>
                <span className="rounded-full bg-app-surface-3 px-3 py-1 text-xs text-app-muted">
                  {tag}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-sm text-app-muted">AI brief</p>
          <h2 className="mt-1 text-lg font-semibold">Today’s signal</h2>
          <p className="mt-4 text-sm leading-6 text-app-muted">
            Payroll growth is rising slower than revenue, which improves margin quality. The main watch item is
            opex creep across non-core teams, especially if hiring resumes before Q3 revenue confirms.
          </p>
          <Button className="mt-5 w-full">Generate deeper insight</Button>
        </Card>
      </section>
    </div>
  );
}