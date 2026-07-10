import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeIndianRupee,
  BriefcaseBusiness,
  Percent,
  Users,
} from 'lucide-react';
import Card from '../common/Card.jsx';

const iconMap = {
  revenue: BadgeIndianRupee,
  payroll: Users,
  margin: Percent,
  scenario: BriefcaseBusiness,
};

function KPIItem({ label, value, delta, tone = 'positive', icon = 'revenue' }) {
  const Icon = iconMap[icon] || BadgeIndianRupee;
  const positive = tone === 'positive';

  return (
    <Card className="p-4 md:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-app-muted">{label}</p>
          <p className="tabular mt-2 text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        <div className="rounded-xl bg-app-surface-2 p-2.5 text-app-muted">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm">
        {positive ? (
          <ArrowUpRight className="h-4 w-4 text-app-success" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-app-warning" />
        )}
        <span className={positive ? 'text-app-success' : 'text-app-warning'}>
          {delta}
        </span>
        <span className="text-app-muted">vs baseline</span>
      </div>
    </Card>
  );
}

export default function KPISection({
  items = [
    { label: 'Planned revenue', value: '₹1.52Cr', delta: '+10.4%', tone: 'positive', icon: 'revenue' },
    { label: 'Payroll budget', value: '₹58.4L', delta: '+3.8%', tone: 'negative', icon: 'payroll' },
    { label: 'Operating margin', value: '28.6%', delta: '+2.1%', tone: 'positive', icon: 'margin' },
    { label: 'Active scenarios', value: '8', delta: '+2', tone: 'positive', icon: 'scenario' },
  ],
  title = 'Budget health',
  description = 'Track the top signals before publishing or comparing versions.',
}) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm text-app-muted">{description}</p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight">{title}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <KPIItem key={item.label} {...item} />
        ))}
      </div>
    </section>
  );
}