import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import Card from '../common/Card.jsx';

export default function KPICard({
  title = 'Operating Margin',
  value = '26.8%',
  change = '+2.4%',
  trend = 'up',
  note = 'Compared to prior month',
  icon = null,
}) {
  const positive = trend === 'up';
  const Icon = icon;

  return (
    <Card className="p-4 md:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-app-muted">{title}</p>
          <p className="tabular mt-2 text-2xl font-semibold tracking-tight text-app-text">
            {value}
          </p>
        </div>

        {Icon ? (
          <div className="rounded-xl bg-app-surface-2 p-2.5 text-app-muted">
            <Icon className="h-4 w-4" />
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm">
        {positive ? (
          <ArrowUpRight className="h-4 w-4 text-app-success" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-app-warning" />
        )}

        <span className={positive ? 'text-app-success' : 'text-app-warning'}>
          {change}
        </span>
        <span className="text-app-muted">{note}</span>
      </div>
    </Card>
  );
}