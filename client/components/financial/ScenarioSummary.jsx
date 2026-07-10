import { CheckCircle2, GitCompareArrows, TriangleAlert } from 'lucide-react';
import Button from '../common/Button.jsx';
import Card from '../common/Card.jsx';

export default function ScenarioSummary({
  title = 'Hiring Freeze Scenario',
  summary = 'This scenario improves short-term margin and extends runway, but may slow delivery capacity in Q4.',
  metrics = [
    { label: 'Projected revenue', value: '₹1.48Cr' },
    { label: 'Projected cost', value: '₹1.02Cr' },
    { label: 'Projected margin', value: '31.2%' },
    { label: 'Cash runway', value: '+2.4 months' },
  ],
  strengths = ['Improves cash efficiency', 'Reduces payroll growth', 'Protects margin target'],
  risks = ['May delay hiring plan', 'Sales enablement may slow', 'Higher pressure on current team'],
  onCompare,
}) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-app-muted">Scenario review</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-app-text">
            {title}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-app-muted">
            {summary}
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          leftIcon={<GitCompareArrows className="h-4 w-4" />}
          onClick={onCompare}
        >
          Compare scenario
        </Button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-app-border bg-app-surface-2 p-4"
          >
            <p className="text-sm text-app-muted">{metric.label}</p>
            <p className="tabular mt-2 text-xl font-semibold text-app-text">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-app-border bg-app-surface-2 p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-app-success" />
            <h4 className="font-semibold text-app-text">Strengths</h4>
          </div>

          <ul className="mt-4 space-y-3">
            {strengths.map((item) => (
              <li key={item} className="text-sm text-app-muted">
                • {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-app-border bg-app-surface-2 p-4">
          <div className="flex items-center gap-2">
            <TriangleAlert className="h-5 w-5 text-app-warning" />
            <h4 className="font-semibold text-app-text">Risks</h4>
          </div>

          <ul className="mt-4 space-y-3">
            {risks.map((item) => (
              <li key={item} className="text-sm text-app-muted">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}