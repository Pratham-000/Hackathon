import { Bell, MoonStar, Search, SunMedium } from 'lucide-react';
import { useEffect, useState } from 'react';
import Input from '../common/Input.jsx';

export default function Header() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const initialDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDark(initialDark);
    document.documentElement.classList.toggle('dark', initialDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
  };

  return (
    <header className="glass sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-app-border px-4 md:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <div className="hidden md:block">
          <p className="text-xs uppercase tracking-[0.16em] text-app-muted">
            Financial planning
          </p>
          <h1 className="text-xl font-semibold tracking-tight">Control Center</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden w-72 md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted" />
            <Input placeholder="Search budgets, payroll, scenarios..." className="pl-10" />
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-app-border bg-app-surface hover:bg-app-surface-2"
          aria-label="Toggle theme"
        >
          {dark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
        </button>

        <button
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-app-border bg-app-surface hover:bg-app-surface-2"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-app-border bg-app-surface px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-app-primary text-sm font-semibold text-white">
            AP
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-app-muted">ORG_ADMIN</p>
          </div>
        </div>
      </div>
    </header>
  );
}