import { PencilLine, TrendingUp } from 'lucide-react';
import Button from '../common/Button.jsx';
import Card from '../common/Card.jsx';

export default function AssumptionCard({
  title = 'Headcount growth',
  category = 'Workforce',
  description = 'Planned increase in total headcount across delivery and support teams.',
  value = '8%',
  impact = 'Moderate impact on payroll',
  onEdit,
}) {
  return (
    <Card hoverable>
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="inline-flex rounded-full bg-app-surface-2 px-3 py-1 text-xs font-medium text-app-muted">
            {category}
          </span>
          <h3 className="mt-3 text-lg font-semibold tracking-tight text-app-text">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-app-muted">{description}</p>
        </div>

        <div className="rounded-2xl bg-app-surface-2 p-3 text-app-muted">
          <TrendingUp className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-app-muted">Current value</p>
          <p className="tabular mt-1 text-2xl font-semibold text-app-text">{value}</p>
          <p className="mt-1 text-sm text-app-muted">{impact}</p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          leftIcon={<PencilLine className="h-4 w-4" />}
          onClick={onEdit}
        >
          Edit
        </Button>
      </div>
    </Card>
  );
}