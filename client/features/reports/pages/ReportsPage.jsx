import { useEffect, useState } from 'react';
import {
  FileText,
  TrendingUp,
  AlertCircle,
  RefreshCcw,
  ChevronRight,
  X,
  Brain,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import Card from '../../../components/common/Card.jsx';
import Button from '../../../components/common/Button.jsx';
import axiosClient from '../../../api/axiosClient.js';

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Selected report detail state
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [reportDetail, setReportDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosClient.get('/reports');
      if (data && data.success && data.data) {
        setReports(data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load generated report archives.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleOpenReport = async (reportId) => {
    setSelectedReportId(reportId);
    setDetailLoading(true);
    setDetailError('');
    setReportDetail(null);
    try {
      const { data } = await axiosClient.get(`/reports/${reportId}`);
      if (data && data.success && data.data) {
        setReportDetail(data.data);
      }
    } catch (err) {
      console.error(err);
      setDetailError('Failed to generate AI report review.');
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-app-muted">
            Executive intelligence
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Financial Reports</h1>
          <p className="mt-2 max-w-2xl text-sm text-app-muted md:text-base">
            Review detailed audits of your baseline budgets, custom scenarios, and AI-generated variance assessments.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={fetchReports} disabled={loading}>
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </section>

      {error ? (
        <div className="rounded-xl border border-app-danger/30 bg-app-danger/10 px-4 py-3 text-sm text-app-danger">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="py-12 text-center text-sm text-app-muted">Loading report list...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {reports.length > 0 ? (
            reports.map((report) => (
              <Card key={report.id} className="flex flex-col justify-between p-5 md:p-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${
                        report.type === 'BUDGET'
                          ? 'bg-app-primary/10 text-app-primary'
                          : 'bg-app-success/10 text-app-success'
                      }`}
                    >
                      {report.type}
                    </span>
                    <span className="text-xs text-app-muted">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">{report.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-app-muted">{report.description}</p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-app-border pt-4">
                  <span className="text-xs text-app-muted flex items-center gap-1.5">
                    <FileText className="h-4 w-4" />
                    AI-enabled Analysis
                  </span>
                  <Button variant="secondary" size="sm" onClick={() => handleOpenReport(report.id)}>
                    View Report
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <Card className="col-span-2 p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-app-surface-2 text-app-muted">
                <FileText className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-xl font-semibold">No report targets found</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-app-muted">
                Create a budget baseline or scenario planner version first to automatically populate dynamic report briefs.
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Report Details Modal */}
      {selectedReportId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
          <div className="h-full w-full max-w-2xl border-l border-app-border bg-app-surface p-6 shadow-2xl overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-app-border pb-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-app-muted">Report Viewer</p>
                  <h2 className="mt-1 text-xl font-semibold">
                    {reportDetail ? reportDetail.title : 'Generating Report...'}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedReportId(null)}
                  className="rounded-lg p-1.5 hover:bg-app-surface-2 text-app-muted hover:text-app-text"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {detailLoading ? (
                <div className="mt-12 text-center">
                  <div className="flex justify-center">
                    <Brain className="h-10 w-10 text-app-primary animate-pulse" />
                  </div>
                  <p className="mt-4 text-sm text-app-muted">Synthesizing AI Audit Brief...</p>
                </div>
              ) : detailError ? (
                <div className="mt-6 rounded-xl border border-app-danger/30 bg-app-danger/10 px-4 py-3 text-sm text-app-danger">
                  {detailError}
                </div>
              ) : reportDetail ? (
                <div className="mt-6 space-y-6">
                  {/* Financial Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    {reportDetail.type === 'BUDGET' ? (
                      <>
                        <div className="rounded-2xl bg-app-surface-2 p-4">
                          <p className="text-xs text-app-muted">Revenue</p>
                          <p className="mt-1 font-semibold">
                            {new Intl.NumberFormat('en-IN', {
                              style: 'currency',
                              currency: 'INR',
                              maximumFractionDigits: 0,
                            }).format(reportDetail.data.totalRevenue)}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-app-surface-2 p-4">
                          <p className="text-xs text-app-muted">Expenses</p>
                          <p className="mt-1 font-semibold">
                            {new Intl.NumberFormat('en-IN', {
                              style: 'currency',
                              currency: 'INR',
                              maximumFractionDigits: 0,
                            }).format(reportDetail.data.totalExpenses)}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-app-surface-2 p-4">
                          <p className="text-xs text-app-muted">Target Margin</p>
                          <p className="mt-1 font-semibold">
                            {new Intl.NumberFormat('en-IN', {
                              style: 'currency',
                              currency: 'INR',
                              maximumFractionDigits: 0,
                            }).format(reportDetail.data.totalProfit)}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="rounded-2xl bg-app-surface-2 p-4">
                          <p className="text-xs text-app-muted">Revenue Impact</p>
                          <p className="mt-1 font-semibold text-app-success">
                            +{new Intl.NumberFormat('en-IN', {
                              style: 'currency',
                              currency: 'INR',
                              maximumFractionDigits: 0,
                            }).format(reportDetail.data.revenueImpact || 0)}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-app-surface-2 p-4">
                          <p className="text-xs text-app-muted">Expense Impact</p>
                          <p className="mt-1 font-semibold text-app-danger">
                            -{new Intl.NumberFormat('en-IN', {
                              style: 'currency',
                              currency: 'INR',
                              maximumFractionDigits: 0,
                            }).format(reportDetail.data.expenseImpact || 0)}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-app-surface-2 p-4">
                          <p className="text-xs text-app-muted">Net Margin Diff</p>
                          <p className="mt-1 font-semibold">
                            {new Intl.NumberFormat('en-IN', {
                              style: 'currency',
                              currency: 'INR',
                              maximumFractionDigits: 0,
                            }).format(reportDetail.data.profitImpact || 0)}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* AI Analysis Narrative */}
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-app-muted">
                      <Brain className="h-4 w-4 text-app-primary" />
                      Executive AI Narrative
                    </h4>
                    <div className="mt-3 rounded-2xl border border-app-border bg-app-surface-2 p-4 md:p-5 text-sm leading-7 text-app-text whitespace-pre-line">
                      {reportDetail.analysis}
                    </div>
                  </div>

                  {/* Review Checklist */}
                  <div className="rounded-2xl border border-app-border p-4">
                    <h4 className="text-sm font-semibold">Sign-off Status</h4>
                    <div className="mt-3 flex items-center gap-2 text-sm text-app-muted">
                      <ShieldCheck className="h-4 w-4 text-app-success" />
                      Audited by model-based heuristic analysis. Ready for executive validation.
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="border-t border-app-border pt-4 mt-6 flex justify-end">
              <Button onClick={() => setSelectedReportId(null)}>Close Viewer</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
