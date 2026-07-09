import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-app-bg p-6">
      <div className="w-full max-w-md rounded-3xl border border-app-border bg-app-surface p-8 text-center">
        <p className="text-sm text-app-muted">404</p>
        <h1 className="mt-2 text-2xl font-semibold">Page not found</h1>
        <p className="mt-3 text-sm text-app-muted">
          The page you requested does not exist or has been moved.
        </p>
        <Link to="/dashboard" className="mt-6 inline-block">
          <Button>Go to dashboard</Button>
        </Link>
      </div>
    </div>
  );
}