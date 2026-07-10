import { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Users,
  Wallet,
  ShieldCheck,
  ChevronRight,
  X,
  Filter,
  RefreshCcw,
} from 'lucide-react';
import Card from '../../../components/common/Card.jsx';
import Button from '../../../components/common/Button.jsx';
import Input from '../../../components/common/Input.jsx';
import employeeApi from '../../../api/employeeApi.js';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, totalSalary: 0, avgSalary: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');

  // Modal / Create employee state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formSalary, setFormSalary] = useState('800000');
  const [formBonus, setFormBonus] = useState('50000');
  const [formDeptId, setFormDeptId] = useState('');
  const [formRoleId, setFormRoleId] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await employeeApi.getEmployees({ limit: 100 });
      if (res && res.success && res.data) {
        setEmployees(res.data.employees || []);
      }

      const statsRes = await employeeApi.getEmployeeStats();
      if (statsRes && statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load employee records from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Dynamically map unique departments and roles from loaded employees
  const uniqueDepartments = useMemo(() => {
    const map = new Map();
    employees.forEach((e) => {
      if (e.department) {
        map.set(e.department.id || e.departmentId, e.department.name);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [employees]);

  const uniqueRoles = useMemo(() => {
    const map = new Map();
    employees.forEach((e) => {
      if (e.role) {
        map.set(e.role.id || e.roleId, e.role.title);
      }
    });
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [employees]);

  // Set default form values once categories are mapped
  useEffect(() => {
    if (uniqueDepartments.length > 0 && !formDeptId) {
      setFormDeptId(uniqueDepartments[0].id);
    }
    if (uniqueRoles.length > 0 && !formRoleId) {
      setFormRoleId(uniqueRoles[0].id);
    }
  }, [uniqueDepartments, uniqueRoles]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      const matchesSearch =
        e.fullName.toLowerCase().includes(search.toLowerCase()) ||
        (e.email && e.email.toLowerCase().includes(search.toLowerCase())) ||
        (e.employeeCode && e.employeeCode.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus =
        statusFilter === 'ALL'
          ? true
          : statusFilter === 'ACTIVE'
          ? e.isActive
          : !e.isActive;

      const matchesDept = deptFilter === 'ALL' ? true : e.departmentId === deptFilter;

      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [employees, search, statusFilter, deptFilter]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError('');

    try {
      const userStr = localStorage.getItem('authUser');
      if (!userStr) throw new Error('User session not found.');
      const user = JSON.parse(userStr);

      const payload = {
        fullName: formName.trim(),
        email: formEmail.trim() || null,
        employeeCode: formCode.trim() || undefined,
        salary: Number(formSalary),
        bonus: Number(formBonus),
        departmentId: formDeptId,
        roleId: formRoleId,
        organizationId: user.organizationId || employees[0]?.organizationId || 'org-id',
      };

      await employeeApi.createEmployee(payload);
      setShowCreateModal(false);
      setFormName('');
      setFormEmail('');
      setFormCode('');
      setFormSalary('800000');
      setFormBonus('50000');
      loadData();
    } catch (err) {
      console.error(err);
      setCreateError(err.message || 'Failed to register employee');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-app-muted">
            Workforce planning
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Employees</h1>
          <p className="mt-2 max-w-2xl text-sm text-app-muted md:text-base">
            Manage your corporate directory, review compensation bounds, and track functional headcount distribution.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={loadData} disabled={loading}>
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4" />
            Add employee
          </Button>
        </div>
      </section>

      {error ? (
        <div className="rounded-xl border border-app-danger/30 bg-app-danger/10 px-4 py-3 text-sm text-app-danger">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <BudgetSummaryCard
          title="Total headcount"
          value={loading ? '...' : String(stats.total)}
          meta={`${stats.active} currently active`}
          icon={Users}
        />
        <BudgetSummaryCard
          title="Active directory"
          value={loading ? '...' : String(stats.active)}
          meta="Actively planning resources"
          icon={ShieldCheck}
        />
        <BudgetSummaryCard
          title="Total salary run rate"
          value={loading ? '...' : formatCurrency(stats.totalSalary)}
          meta="Annualized base run rate"
          icon={Wallet}
        />
        <BudgetSummaryCard
          title="Average salary"
          value={loading ? '...' : formatCurrency(stats.avgSalary)}
          meta="Per headcount compensation"
          icon={Users}
        />
      </section>

      <Card>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm text-app-muted">Directory Filters</p>
            <h2 className="mt-1 text-lg font-semibold">Refine directory search</h2>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-app-surface-2 px-3 py-2 text-sm text-app-muted">
            <Filter className="h-4 w-4" />
            Filtered listing
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-[1.5fr_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-app-muted" />
            <Input
              placeholder="Search by name, email, or code"
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 rounded-xl border border-app-border bg-app-surface-2 px-4 text-sm text-app-text outline-none focus:border-app-primary focus:ring-2 focus:ring-app-primary/20"
          >
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="h-11 rounded-xl border border-app-border bg-app-surface-2 px-4 text-sm text-app-text outline-none focus:border-app-primary focus:ring-2 focus:ring-app-primary/20"
          >
            <option value="ALL">All departments</option>
            {uniqueDepartments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-app-border px-5 py-4 md:px-6">
          <div>
            <p className="text-sm text-app-muted">Employee register</p>
            <h2 className="mt-1 text-lg font-semibold">Active roster</h2>
          </div>
          <p className="text-sm text-app-muted">
            {filteredEmployees.length} matching record{filteredEmployees.length !== 1 ? 's' : ''}
          </p>
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm text-app-muted">Loading employees from server...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-app-surface-2 text-sm text-app-muted">
                <tr>
                  <th className="px-6 py-4 font-medium">Employee</th>
                  <th className="px-6 py-4 font-medium">Department</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Salary</th>
                  <th className="px-6 py-4 font-medium">Bonus</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((e) => (
                  <tr
                    key={e.id}
                    className="border-t border-app-border bg-app-surface transition hover:bg-app-surface-2"
                  >
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-medium">{e.fullName}</p>
                        <p className="mt-1 text-xs text-app-muted">
                          {e.employeeCode || 'N/A'} · {e.email || 'No email'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm">{e.department?.name || 'Unassigned'}</td>
                    <td className="px-6 py-5 text-sm">{e.role?.title || 'Unassigned'}</td>
                    <td className="tabular px-6 py-5 text-sm font-medium">{formatCurrency(e.salary)}</td>
                    <td className="tabular px-6 py-5 text-sm text-app-muted">{formatCurrency(e.bonus)}</td>
                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          e.isActive ? 'bg-app-success/10 text-app-success' : 'bg-app-surface-3 text-app-muted'
                        }`}
                      >
                        {e.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Employee Modal */}
      {showCreateModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-[28px] border border-app-border bg-app-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-app-border pb-4">
              <h2 className="text-xl font-semibold">Add New Employee</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-1.5 hover:bg-app-surface-2 text-app-muted hover:text-app-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {createError ? (
              <div className="mt-4 rounded-xl border border-app-danger/30 bg-app-danger/10 px-4 py-3 text-sm text-app-danger">
                {createError}
              </div>
            ) : null}

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4">
              <Input
                label="Full Name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Jane Doe"
                required
              />

              <Input
                label="Email"
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="e.g. jane@company.com"
              />

              <Input
                label="Employee Code"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                placeholder="e.g. EMP006"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Department
                  </label>
                  <select
                    value={formDeptId}
                    onChange={(e) => setFormDeptId(e.target.value)}
                    className="h-11 w-full rounded-xl border border-app-border bg-app-surface-2 px-4 text-sm text-app-text outline-none focus:border-app-primary focus:ring-2 focus:ring-app-primary/20"
                    required
                  >
                    {uniqueDepartments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Role
                  </label>
                  <select
                    value={formRoleId}
                    onChange={(e) => setFormRoleId(e.target.value)}
                    className="h-11 w-full rounded-xl border border-app-border bg-app-surface-2 px-4 text-sm text-app-text outline-none focus:border-app-primary focus:ring-2 focus:ring-app-primary/20"
                    required
                  >
                    {uniqueRoles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Annual Salary (INR)"
                  type="number"
                  value={formSalary}
                  onChange={(e) => setFormSalary(e.target.value)}
                  required
                />

                <Input
                  label="Annual Bonus (INR)"
                  type="number"
                  value={formBonus}
                  onChange={(e) => setFormBonus(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-app-border pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createLoading}>
                  {createLoading ? 'Adding...' : 'Add Employee'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function BudgetSummaryCard({ title, value, meta, icon: Icon }) {
  return (
    <Card className="p-4 md:p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-app-muted">{title}</p>
          <p className="tabular mt-2 text-2xl font-semibold tracking-tight">{value}</p>
          <p className="mt-2 text-sm text-app-muted">{meta}</p>
        </div>
        <div className="rounded-xl bg-app-surface-2 p-2.5 text-app-muted">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </Card>
  );
}
