import { Clock3, Eye, GitCompareArrows, MoreHorizontal } from 'lucide-react';
import Button from '../common/Button.jsx';
import Card from '../common/Card.jsx';

const defaultVersions = [
  {
    id: 'v7',
    name: 'FY27 Base Plan',
    status: 'Published',
    owner: 'Ananya Patel',
    updatedAt: '2 hours ago',
    variance: '+4.2%',
  },
  {
    id: 'v6',
    name: 'Hiring Controlled Scenario',
    status: 'Draft',
    owner: 'Rohit Mehra',
    updatedAt: 'Yesterday',
    variance: '+2.1%',
  },
  {
    id: 'v5',
    name: 'Aggressive Growth Case',
    status: 'Review',
    owner: 'Finance Team',
    updatedAt: '2 days ago',
    variance: '+8.7%',
  },
];

const statusClasses = {
  Published: 'bg-app-success/15 text-app-success',
  Draft: 'bg-app-warning/15 text-app-warning',
  Review: 'bg-app-primary/15 text-app-primary',
};

export default function VersionList({
  versions = defaultVersions,
  onView,
  onCompare,
  onMore,
}) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-app-muted">Version control</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight">
            Budget versions
          </h2>
        </div>
        <Button variant="secondary" size="sm">
          New version
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-app-border">
        <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.7fr_0.8fr] gap-3 bg-app-surface-2 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-app-muted">
          <span>Name</span>
          <span>Status</span>
          <span>Owner</span>
          <span>Updated</span>
          <span className="text-right">Actions</span>
        </div>

        <div className="divide-y divide-app-border bg-app-surface">
          {versions.map((version) => (
            <div
              key={version.id}
              className="grid grid-cols-1 gap-4 px-4 py-4 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.7fr_0.8fr] md:items-center"
            >
              <div>
                <p className="font-medium">{version.name}</p>
                <p className="mt-1 text-sm text-app-muted">
                  Forecast variance {version.variance}
                </p>
              </div>

              <div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                    statusClasses[version.status] || 'bg-app-surface-2 text-app-text'
                  }`}
                >
                  {version.status}
                </span>
              </div>

              <p className="text-sm text-app-muted">{version.owner}</p>

              <div className="flex items-center gap-2 text-sm text-app-muted">
                <Clock3 className="h-4 w-4" />
                <span>{version.updatedAt}</span>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => onView?.(version)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-app-border bg-app-surface-2 hover:bg-app-surface-3"
                >
                  <Eye className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onCompare?.(version)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-app-border bg-app-surface-2 hover:bg-app-surface-3"
                >
                  <GitCompareArrows className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onMore?.(version)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-app-border bg-app-surface-2 hover:bg-app-surface-3"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}