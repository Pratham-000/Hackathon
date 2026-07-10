import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DashboardPage from '../features/dashboard/pages/DashboardPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import AuthPage from '../pages/AuthPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import UnauthorizedPage from '../pages/UnauthorizedPage.jsx';
import AIInsightsPage from '../features/insights/pages/AIInsightsPage.jsx';
import BudgetsPage from '../features/budgets/pages/BudgetsPage.jsx';
import ScenarioPlannerPage from '../features/scenarios/pages/ScenarioPlannerPage.jsx';
import PayrollPage from '../features/payroll/pages/PayrollPage.jsx';
import EmployeesPage from '../features/employees/pages/EmployeesPage.jsx';
import ReportsPage from '../features/reports/pages/ReportsPage.jsx';

const isAuthenticated = () => Boolean(localStorage.getItem('authToken'));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <HomePage />} />
      <Route path="/login" element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
      <Route path="/register" element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <AuthPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="/scenarios" element={<ScenarioPlannerPage />} />
          <Route path="/insights" element={<AIInsightsPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/payroll" element={<PayrollPage />} />
        </Route>
      </Route>

      <Route path="/app" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}