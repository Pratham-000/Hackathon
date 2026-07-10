import { ArrowUpRight, TrendingUp } from 'lucide-react';
import Button from '../common/Button.jsx';
import Card from '../common/Card.jsx';

export default function ForecastCard({
  title = 'Q3 Forecast',
  subtitle = 'Rolling revenue and cost projection',
  revenue = '₹1.82Cr',
  expense = '₹1.29Cr',
  margin = '29.1%',
  confidence = 'High confidence',
  onView,
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-app-muted">{subtitle}</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-app-text">
            {title}
          </h3>
        </div>

        <div className="rounded-2xl bg-app-surface-2 p-3 text-app-primary">
          <TrendingUp className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-app-surface-2 p-4">
          <p className="text-sm text-app-muted">Projected revenue</p>
          <p className="tabular mt-2 text-xl font-semibold text-app-text">{revenue}</p>
        </div>

        <div className="rounded-2xl bg-app-surface-2 p-4">
          <p className="text-sm text-app-muted">Projected expense</p>
          <p className="tabular mt-2 text-xl font-semibold text-app-text">{expense}</p>
        </div>

        <div className="rounded-2xl bg-app-primary px-4 py-4 text-white">
          <p className="text-sm text-white/80">Projected margin</p>
          <p className="tabular mt-2 text-xl font-semibold">{margin}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-sm text-app-muted">{confidence}</p>
        <Button
          variant="ghost"
          size="sm"
          rightIcon={<ArrowUpRight className="h-4 w-4" />}
          onClick={onView}
        >
          View forecast
        </Button>
      </div>
    </Card>
  );
}