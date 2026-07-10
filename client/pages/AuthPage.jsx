import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import authApi from '../api/authApi.js';

const initialForm = {
  fullName: '',
  email: '',
  password: '',
};

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState(location.pathname.includes('/register') ? 'register' : 'login');
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    setMode(location.pathname.includes('/register') ? 'register' : 'login');
    setForm(initialForm);
    setError('');
  }, [location.pathname]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        email: form.email.trim(),
        password: form.password,
      };

      if (mode === 'register') {
        await authApi.register({
          fullName: form.fullName.trim(),
          ...payload,
        });
        const loginResult = await authApi.login(payload);
        localStorage.setItem('authToken', loginResult.data.token);
        localStorage.setItem('authUser', JSON.stringify(loginResult.data.user));
      } else {
        const loginResult = await authApi.login(payload);
        localStorage.setItem('authToken', loginResult.data.token);
        localStorage.setItem('authUser', JSON.stringify(loginResult.data.user));
      }

      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-app-bg px-6 py-10 text-app-text">
      <div className="w-full max-w-md rounded-[28px] border border-app-border bg-app-surface p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-app-muted">AI Finance Workspace</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="mt-3 text-sm text-app-muted">
            {mode === 'login'
              ? 'Sign in to continue planning budgets and scenarios.'
              : 'Register to start building smarter forecasts.'}
          </p>
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-app-danger/30 bg-app-danger/10 px-4 py-3 text-sm text-app-danger">
            {error}
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === 'register' ? (
            <Input
              label="Full name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Alex Morgan"
              required
            />
          ) : null}

          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@company.com"
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          <Button className="mt-2 w-full" size="lg" type="submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-app-muted">
          {mode === 'login' ? (
            <>
              No account yet?{' '}
              <Link to="/register" className="font-medium text-app-primary">
                Create one
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-app-primary">
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
