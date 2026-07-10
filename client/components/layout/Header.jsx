import { Bell, MoonStar, Search, SunMedium } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input.jsx';
import budgetApi from '../../api/budgetApi';
import employeeApi from '../../api/employeeApi';
import axiosClient from '../../api/axiosClient';

export default function Header() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState({ fullName: 'Admin User', role: 'ORG_ADMIN' });

  // Global Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState({ budgets: [], employees: [], scenarios: [] });
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const initialDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDark(initialDark);
    document.documentElement.classList.toggle('dark', initialDark);

    try {
      const stored = localStorage.getItem('authUser');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Perform search across budgets, employees, and scenarios
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults({ budgets: [], employees: [], scenarios: [] });
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const q = searchQuery.toLowerCase();
        
        // 1. Search budgets
        const bRes = await budgetApi.getBudgets({ search: searchQuery });
        const budgets = (bRes?.data?.budgets || [])
          .filter(b => b.name.toLowerCase().includes(q))
          .slice(0, 3);

        // 2. Search employees
        const eRes = await employeeApi.getEmployees({ search: searchQuery });
        const employees = (eRes?.data?.employees || [])
          .filter(e => e.fullName.toLowerCase().includes(q))
          .slice(0, 3);

        // 3. Search scenarios
        const { data: sRes } = await axiosClient.get('/scenarios');
        const scenarios = (sRes?.data?.scenarios || sRes?.data || [])
          .filter(s => s.name.toLowerCase().includes(q))
          .slice(0, 3);

        setResults({ budgets, employees, scenarios });
        setShowDropdown(true);
      } catch (err) {
        console.error('Global search error:', err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    window.location.href = '/login';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleItemClick = (path) => {
    navigate(path);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const hasResults = results.budgets.length > 0 || results.employees.length > 0 || results.scenarios.length > 0;

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
        {/* Global Search Bar */}
        <div className="relative hidden w-72 md:block" ref={dropdownRef}>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted" />
            <Input
              placeholder="Search budgets, scenarios, employees..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (hasResults) setShowDropdown(true);
              }}
            />
          </div>

          {/* Floating Dropdown Results */}
          {showDropdown && (
            <div className="absolute top-full right-0 left-0 mt-2 max-h-[360px] overflow-y-auto rounded-2xl border border-app-border bg-app-surface p-2 shadow-2xl z-30">
              {hasResults ? (
                <div className="space-y-3 p-2">
                  {results.budgets.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-app-muted mb-1 px-2">Budgets</p>
                      {results.budgets.map(b => (
                        <button
                          key={b.id}
                          onClick={() => handleItemClick('/budgets')}
                          className="w-full text-left rounded-xl px-2 py-1.5 text-sm hover:bg-app-surface-2 transition flex justify-between"
                        >
                          <span className="font-medium text-app-text">{b.name}</span>
                          <span className="text-xs text-app-muted">FY{b.fiscalYear}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {results.scenarios.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-app-muted mb-1 px-2">Scenarios</p>
                      {results.scenarios.map(s => (
                        <button
                          key={s.id}
                          onClick={() => handleItemClick('/scenarios')}
                          className="w-full text-left rounded-xl px-2 py-1.5 text-sm hover:bg-app-surface-2 transition flex justify-between"
                        >
                          <span className="font-medium text-app-text">{s.name}</span>
                          <span className="text-xs text-app-muted capitalize">{s.type.toLowerCase()}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {results.employees.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-app-muted mb-1 px-2">Employees</p>
                      {results.employees.map(e => (
                        <button
                          key={e.id}
                          onClick={() => handleItemClick('/employees')}
                          className="w-full text-left rounded-xl px-2 py-1.5 text-sm hover:bg-app-surface-2 transition flex justify-between"
                        >
                          <span className="font-medium text-app-text">{e.fullName}</span>
                          <span className="text-xs text-app-muted">{e.employeeCode || 'EMP'}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-app-muted">
                  No matching results found
                </div>
              )}
            </div>
          )}
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
            {getInitials(user.fullName)}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium">{user.fullName}</p>
            <p className="text-xs text-app-muted">{user.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="ml-2 rounded-lg bg-app-danger/10 px-2 py-1 text-xs font-semibold text-app-danger hover:bg-app-danger/25 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}