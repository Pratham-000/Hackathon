import { useMemo, useState } from 'react';
import {
  BrainCircuit,
  CalendarRange,
  ChevronRight,
  Filter,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  WandSparkles,
} from 'lucide-react';
import Card from '../../../components/common/Card.jsx';
import Button from '../../../components/common/Button.jsx';
import Input from '../../../components/common/Input.jsx';

const mockInsights = [
  {
    id: 'INS-001',
    title: 'Payroll growth is slower than revenue growth',
    type: 'PAYROLL',
    confidenceScore: 0.91,
    createdAt: '2026-07-09',
    severity: 'positive',
    summary:
      'Current payroll growth is trailing revenue growth, which is improving margin quality. This suggests the existing hiring pace is still efficient under the current sales plan.',
    recommendation:
      'Maintain current hiring gates and review non-core backfills only after Q3 revenue confirmation.',
  },
  {
    id: 'INS-002',
    title: 'Opex drift is reducing planned operating leverage',
    type: 'BUDGET',
    confidenceScore: 0.84,
    createdAt: '2026-07-08',
    severity: 'warning',
    summary:
      'Operating expenses outside payroll are rising faster than the original plan in support functions. This weakens the margin gains created by better revenue performance.',
    recommendation:
      'Freeze discretionary software and vendor expansion until the next budget revision closes.',
  },
  {
    id: 'INS-003',
    title: 'Hiring freeze scenario extends runway materially',
    type: 'SCENARIO',
    confidenceScore: 0.88,
    createdAt: '2026-07-07',
    severity: 'positive',
    summary:
      'The hiring freeze scenario materially improves runway without creating immediate revenue downside in the current planning model.',
    recommendation:
      'Use this as the baseline downside-protection scenario for executive review.',
  },
  {
    id: 'INS-004',
    title: 'Forecast confidence is lower for Q4 topline assumptions',
    type: 'FORECAST',
    confidenceScore: 0.68,
    createdAt: '2026-07-06',
    severity: 'risk',
    summary:
      'Projected Q4 revenue acceleration depends on assumptions that are not yet validated by current pipeline conversion rates.',
    recommendation:
      'Build a moderated case and a downside case before approving headcount expansion.',
  },
];

const severityStyles = {
  positive: {
    badge: 'bg-app-success/10 text-app-success',
    icon: ShieldCheck,
  },
  warning: {
    badge: 'bg-app-warning/10 text-app-warning',
    icon: TriangleAlert,
  },
  risk: {
    badge: 'bg-app-danger/10 text-app-danger',
    icon: TriangleAlert,
  },
};

function confidenceLabel(score) {
  if (score >= 0.85) return 'High confidence';
  if (score >= 0.7) return 'Medium confidence';
  return 'Lower confidence';
}

function InsightCard({ insight }) {
  const severity = severityStyles[insight.severity];
  const Icon = severity.icon;

  return (
    <Card className="p-5 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-app-surface-3 px-3 py-1 text-xs font-medium text-app-muted">
              {insight.type}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${severity.badge}`}>
              {insight.severity}
            </span>
          </div>

          <h3 className="mt-3 text-lg font-semibold tracking-tight">{insight.title}</h3>
          <p className="mt-3 text-sm leading-6 text-app-muted">{insight.summary}</p>
        </div>

        <div className="rounded-xl bg-app-surface-2 p-2.5 text-app-muted">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-app-border bg-app-surface-2 p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-app-muted">Recommended action</p>
        <p className="mt-2 text-sm leading-6">{insight.recommendation}</p>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 text-sm text-app-muted">
          <span className="tabular">
            Confidence: {(insight.confidenceScore * 100).toFixed(0)}%
          </span>
          <span>{confidenceLabel(insight.confidenceScore)}</span>
          <span>{insight.createdAt}</span>
        </div>

        <button className="inline-flex items-center gap-2 text-sm font-medium text-app-primary">
          Open detail
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}

export default function AIInsightsPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('ALL');
  const [confidence, setConfidence] = useState('ALL');

  const filteredInsights = useMemo(() => {
    return mockInsights.filter((item) => {
      const matchesQuery =
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.summary.toLowerCase().includes(query.toLowerCase()) ||
        item.type.toLowerCase().includes(query.toLowerCase());

      const matchesType = type === 'ALL' ? true : item.type === type;

      const matchesConfidence =
        confidence === 'ALL'
          ? true
          : confidence === 'HIGH'
          ? item.confidenceScore >= 0.85
          : confidence === 'MEDIUM'
          ? item.confidenceScore >= 0.7 && item.confidenceScore < 0.85
          : item.confidenceScore < 0.7;

      return matchesQuery && matchesType && matchesConfidence;
    });
  }, [query, type, confidence]);

  const stats = useMemo(() => {
    const total = filteredInsights.length;
    const high = filteredInsights.filter((x) => x.confidenceScore >= 0.85).length;
    const risk = filteredInsights.filter((x) => x.severity === 'risk').length;
    const avg =
      total > 0
        ? filteredInsights.reduce((sum, x) => sum + x.confidenceScore, 0) / total
        : 0;

    return { total, high, risk, avg };
  }, [filteredInsights]);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-app-muted">
            Decision support
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">AI insights</h1>
          <p className="mt-2 max-w-2xl text-sm text-app-muted md:text-base">
            Review model-generated financial observations, filter by topic and confidence,
            and turn planning signals into concrete next actions.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary">
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
          <Button>
            <WandSparkles className="h-4 w-4" />
            Generate insight
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-4 md:p-5">
          <p className="text-sm text-app-muted">Visible insights</p>
          <p className="tabular mt-2 text-2xl font-semibold">{stats.total}</p>
          <p className="mt-2 text-sm text-app-muted">Filtered result count</p>
        </Card>

        <Card className="p-4 md:p-5">
          <p className="text-sm text-app-muted">High confidence</p>
          <p className="tabular mt-2 text-2xl font-semibold">{stats.high}</p>
          <p className="mt-2 text-sm text-app-muted">Ready for decision review</p>
        </Card>

        <Card className="p-4 md:p-5">
          <p className="text-sm text-app-muted">Risk signals</p>
          <p className="tabular mt-2 text-2xl font-semibold">{stats.risk}</p>
          <p className="mt-2 text-sm text-app-muted">Need follow-up validation</p>
        </Card>

        <Card className="p-4 md:p-5">
          <p className="text-sm text-app-muted">Average confidence</p>
          <p className="tabular mt-2 text-2xl font-semibold">
            {(stats.avg * 100).toFixed(0)}%
          </p>
          <p className="mt-2 text-sm text-app-muted">Across filtered insights</p>
        </Card>
      </section>

      <Card>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm text-app-muted">Filters</p>
            <h2 className="mt-1 text-lg font-semibold">Explore the signal set</h2>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-app-surface-2 px-3 py-2 text-sm text-app-muted">
            <Filter className="h-4 w-4" />
            Model-assisted review
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-[1.5fr_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted" />
            <Input
              placeholder="Search by title, summary, or type"
              className="pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="h-11 rounded-xl border border-app-border bg-app-surface-2 px-4 text-sm text-app-text outline-none focus:border-app-primary focus:ring-2 focus:ring-app-primary/20"
          >
            <option value="ALL">All insight types</option>
            <option value="BUDGET">Budget</option>
            <option value="SCENARIO">Scenario</option>
            <option value="PAYROLL">Payroll</option>
            <option value="FORECAST">Forecast</option>
          </select>

          <select
            value={confidence}
            onChange={(e) => setConfidence(e.target.value)}
            className="h-11 rounded-xl border border-app-border bg-app-surface-2 px-4 text-sm text-app-text outline-none focus:border-app-primary focus:ring-2 focus:ring-app-primary/20"
          >
            <option value="ALL">All confidence</option>
            <option value="HIGH">High confidence</option>
            <option value="MEDIUM">Medium confidence</option>
            <option value="LOW">Lower confidence</option>
          </select>
        </div>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="space-y-4">
          {filteredInsights.length > 0 ? (
            filteredInsights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))
          ) : (
            <Card className="p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-app-surface-2 text-app-muted">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-semibold">No insights match your filters</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-app-muted">
                Try a different search term or broaden your filters to bring more model-generated
                planning insights into view.
              </p>
              <div className="mt-6">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setQuery('');
                    setType('ALL');
                    setConfidence('ALL');
                  }}
                >
                  Clear filters
                </Button>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <p className="text-sm text-app-muted">Today’s AI brief</p>
            <h2 className="mt-1 text-lg font-semibold">Executive snapshot</h2>
            <p className="mt-4 text-sm leading-6 text-app-muted">
              Current insights suggest margin quality is improving, but opex discipline remains
              the main execution risk. Scenario outputs support a cautious operating plan until Q4
              revenue confidence improves.
            </p>
            <div className="mt-5">
              <Button className="w-full">
                <Sparkles className="h-4 w-4" />
                Regenerate summary
              </Button>
            </div>
          </Card>

          <Card>
            <p className="text-sm text-app-muted">Review checklist</p>
            <h2 className="mt-1 text-lg font-semibold">Before acting on insights</h2>

            <div className="mt-5 space-y-3">
              {[
                'Validate whether assumptions are tied to the latest budget version.',
                'Check confidence before escalating cost or hiring recommendations.',
                'Compare AI guidance against scenario outputs and finance owner review.',
                'Use lower-confidence insights as prompts for investigation, not final decisions.',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-app-border bg-app-surface-2 p-4"
                >
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-app-primary" />
                  <p className="text-sm text-app-muted">{item}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <p className="text-sm text-app-muted">Coverage window</p>
            <h2 className="mt-1 text-lg font-semibold">Active analysis range</h2>
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-app-border bg-app-surface-2 p-4">
              <CalendarRange className="h-5 w-5 text-app-muted" />
              <div>
                <p className="text-sm font-medium">Last 30 days</p>
                <p className="text-sm text-app-muted">
                  Budget, scenario, payroll, and forecast insight generation
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}