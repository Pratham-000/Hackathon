import {
  BrainCircuit,
  BriefcaseBusiness,
  CreditCard,
  LayoutDashboard,
  TrendingUp,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/budgets', label: 'Budgets', icon: BriefcaseBusiness },
  { to: '/scenarios', label: 'Scenarios', icon: TrendingUp },
  { to: '/payroll', label: 'Payroll', icon: CreditCard },
  { to: '/insights', label: 'Insights', icon: BrainCircuit },
];

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-app-border bg-app-surface/95 backdrop-blur lg:hidden">
      <div className="grid h-[72px] grid-cols-5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition',
                isActive ? 'text-app-primary' : 'text-app-muted'
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}