import { Inbox } from 'lucide-react';
import Button from './Button.jsx';
import Card from './Card.jsx';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No data available',
  description = 'There is nothing to show here yet. Add data or adjust your filters.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <Card className={`border-dashed text-center ${className}`}>
      <div className="mx-auto flex max-w-md flex-col items-center py-6">
        <div className="mb-4 rounded-2xl bg-app-surface-2 p-4 text-app-muted">
          <Icon className="h-6 w-6" />
        </div>

        <h3 className="text-lg font-semibold tracking-tight text-app-text">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-app-muted">
          {description}
        </p>

        {actionLabel ? (
          <Button onClick={onAction} className="mt-5">
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </Card>
  );
}