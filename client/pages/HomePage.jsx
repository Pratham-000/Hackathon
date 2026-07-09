import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-app-bg px-6 py-10 text-app-text">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[28px] border border-app-border bg-app-surface p-8 md:p-12">
          <p className="text-sm uppercase tracking-[0.18em] text-app-muted">
            AI financial planning
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
            Plan budgets, compare scenarios, and monitor payroll with clarity.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-app-muted md:text-lg">
            A focused finance workspace for budget control, forecasting, workforce planning, and AI-assisted insight generation.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/login">
              <Button size="lg">Log in</Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary" size="lg">Create account</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}