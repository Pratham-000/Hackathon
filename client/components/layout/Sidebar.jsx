import {
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  CreditCard,
  LayoutDashboard,
  TrendingUp,
  Users,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/budgets', label: 'Budgets', icon: BriefcaseBusiness },
  { to: '/scenarios', label: 'Scenarios', icon: TrendingUp },
  { to: '/insights', label: 'AI Insights', icon: BrainCircuit },
  { to: '/payroll', label: 'Payroll', icon: CreditCard },
  { to: '/employees', label: 'Employees', icon: Users },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <aside className="hidden h-screen overflow-y-auto border-r border-app-border bg-app-surface px-4 py-5 lg:block">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-app-primary text-white">
          <svg viewBox="0 0 32 32" className="h-5 w-5" fill="none">
            <path
              d="M6 22L14 10L18 16L26 6"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M23 6H26V9"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight">FutureSight</p>
          <p className="text-xs text-app-muted">Planning Console</p>
        </div>
      </div>

      <nav className="mt-8 space-y-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                isActive
                  ? 'bg-app-surface-3 text-app-text'
                  : 'text-app-muted hover:bg-app-surface-2 hover:text-app-text'
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 rounded-2xl border border-app-border bg-app-surface-2 p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-app-muted">
          Workspace
        </p>
        <p className="mt-2 text-sm font-semibold">L&T Technology Services</p>
        <p className="mt-1 text-sm text-app-muted">
          FY 2026 planning in progress.
        </p>
      </div>
    </aside>
  );
}