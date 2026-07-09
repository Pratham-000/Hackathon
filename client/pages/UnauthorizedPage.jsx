import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-app-bg p-6">
      <div className="w-full max-w-md rounded-3xl border border-app-border bg-app-surface p-8 text-center">
        <p className="text-sm text-app-muted">Access denied</p>
        <h1 className="mt-2 text-2xl font-semibold">You do not have permission</h1>
        <p className="mt-3 text-sm text-app-muted">
          This section is restricted based on your current role.
        </p>
        <Link to="/dashboard" className="mt-6 inline-block">
          <Button>Return to dashboard</Button>
        </Link>
      </div>
    </div>
  );
}