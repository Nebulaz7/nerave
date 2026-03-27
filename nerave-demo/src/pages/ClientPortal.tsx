import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNerave } from '../hooks/useNerave';
import type { Agreement } from 'nerave-sdk';
import AgreementCard from '../components/AgreementCard';
import FlowDiagram from '../components/FlowDiagram';
import PoweredByBadge from '../components/PoweredByBadge';
import SDKCodePanel from '../components/SDKCodePanel';
import Toast from '../components/Toast';
import {
  LayoutDashboard, LogOut, Key, FileText, RefreshCw,
  Milestone, Copy, Check, Wrench, BanknoteIcon,
} from 'lucide-react';

export default function ClientPortal() {
  const { user, logout } = useAuth();
  const { nerave } = useNerave();
  const navigate = useNavigate();

  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [keyCopied, setKeyCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAgreements = useCallback(async () => {
    if (!nerave) return;
    try {
      const data = await nerave.agreements.list();
      setAgreements(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      console.error('Failed to fetch agreements:', err);
      setAgreements([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [nerave]);

  useEffect(() => {
    if (!user) { navigate('/'); return; }
    if (user.role !== 'CONTRACTOR') { navigate('/business'); return; }
    fetchAgreements();
  }, [user, navigate, fetchAgreements]);

  function handleRefresh() {
    setRefreshing(true);
    fetchAgreements();
  }

  async function handleConfirmMilestone(agreementId: string, milestoneId: string) {
    if (!nerave) return;
    try {
      const result = await nerave.milestones.confirm({ agreementId, milestoneId });
      if (result.fullyApproved) {
        setToast({
          message: '🎉 Milestone fully approved! Funds are being disbursed via Interswitch.',
          type: 'success',
        });
      } else {
        setToast({
          message: 'Milestone confirmed! Waiting for the business owner to also confirm.',
          type: 'success',
        });
      }
      fetchAgreements();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to confirm';
      setToast({ message: msg, type: 'error' });
    }
  }

  function copyKey() {
    if (user?.apiKey) {
      navigator.clipboard.writeText(user.apiKey);
      setKeyCopied(true);
      setTimeout(() => setKeyCopied(false), 2000);
    }
  }

  // Compute stats
  const totalAgreements = agreements.length;
  const pendingMilestones = agreements.reduce(
    (acc, a) => acc + (a.milestones?.filter(m => !m.disbursed).length || 0), 0
  );
  const completedMilestones = agreements.reduce(
    (acc, a) => acc + (a.milestones?.filter(m => m.disbursed).length || 0), 0
  );
  const totalEarnings = agreements.reduce(
    (acc, a) => acc + (a.milestones?.filter(m => m.disbursed).reduce((s, m) => s + Number(m.amount), 0) || 0), 0
  );

  // Flow step
  const flowStep = agreements.length === 0 ? -1
    : completedMilestones > 0 ? 4
    : pendingMilestones > 0 ? 3
    : 2;

  if (!user) return null;

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          Nerave<span className="brand-dot">.</span>
        </div>

        <div className="sidebar-user">
          <div className="user-name">{user.businessName || user.email}</div>
          <div className="user-role">
            <Wrench size={10} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 4 }} />
            Contractor
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-link active">
            <LayoutDashboard size={16} />
            My Projects
          </div>
          <div className="sidebar-link" style={{ opacity: 0.5 }}>
            <Milestone size={16} />
            Milestones
          </div>
          <div className="sidebar-link" style={{ opacity: 0.5 }}>
            <BanknoteIcon size={16} />
            Earnings
          </div>
        </nav>

        <div className="sidebar-footer">
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Key size={11} /> API Key
            </div>
            <div className="api-key-display">
              <span className="key-text">{user.apiKey}</span>
              <button className="copy-btn" onClick={copyKey} style={{ flexShrink: 0 }}>
                {keyCopied ? <Check size={11} /> : <Copy size={11} />}
              </button>
            </div>
          </div>

          {/* Test bank info */}
          <div style={{
            padding: '10px 12px',
            background: 'rgba(245, 158, 11, 0.05)',
            border: '1px solid rgba(245, 158, 11, 0.15)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '12px',
            fontSize: '0.7rem',
          }}>
            <div style={{ color: 'var(--color-amber)', fontWeight: 600, marginBottom: '4px', fontFamily: 'var(--font-display)' }}>
              🏦 Test Bank Account
            </div>
            <div style={{ color: 'var(--color-text-muted)' }}>
              <div>Account: <span style={{ color: 'var(--color-text-secondary)' }}>0014261063</span></div>
              <div>Bank: <span style={{ color: 'var(--color-text-secondary)' }}>GTB (058)</span></div>
              <div style={{ marginTop: '4px', fontStyle: 'italic' }}>Interswitch Sandbox</div>
            </div>
          </div>

          <button
            className="sidebar-link"
            onClick={() => { logout(); navigate('/'); }}
            style={{ color: 'var(--color-rose)' }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Contractor Portal</h1>
            <div className="page-subtitle">
              View your projects and confirm completed milestones
            </div>
          </div>
          <button className="btn btn-secondary" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw size={14} className={refreshing ? 'spinning' : ''} />
            Refresh
          </button>
        </div>

        {/* Flow Diagram */}
        <FlowDiagram currentStep={flowStep} />

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{totalAgreements}</div>
            <div className="stat-label">Active Projects</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{pendingMilestones}</div>
            <div className="stat-label">Pending Milestones</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{completedMilestones}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">₦{totalEarnings.toLocaleString()}</div>
            <div className="stat-label">Total Earnings</div>
          </div>
        </div>

        {/* SDK Code Panel */}
        <SDKCodePanel
          title="Contractor SDK Integration"
          code={`import { Nerave } from 'nerave-sdk';

// Contractor initializes with their own API key
const nerave = new Nerave({
  apiKey: '${user.apiKey}',
  baseUrl: '${import.meta.env.VITE_NERAVE_API_URL}',
});

// List agreements where you are the contractor
const myProjects = await nerave.agreements.list();

// Confirm a milestone is complete
const result = await nerave.milestones.confirm({
  agreementId: 'agreement-uuid',
  milestoneId: 'milestone-uuid',
});

// When both CLIENT and CONTRACTOR confirm:
// → Smart contract emits MilestoneApproved event
// → Backend auto-disburses via Interswitch
// → Funds land in contractor's bank account
console.log(result.fullyApproved); // true = disbursement triggered!`}
        />

        {/* Agreements List */}
        <div style={{ marginTop: '32px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>
            <FileText size={18} style={{ display: 'inline', verticalAlign: '-3px', marginRight: '8px' }} />
            Project Agreements
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div className="spinner spinner-lg" style={{ margin: '0 auto' }} />
              <p style={{ marginTop: '16px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                Fetching your projects via nerave-sdk...
              </p>
            </div>
          ) : agreements.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Wrench size={48} />
              </div>
              <h3>No projects assigned yet</h3>
              <p>
                When a business owner creates an agreement with you as the contractor,
                it will appear here. Ask the Business Owner to create one!
              </p>
            </div>
          ) : (
            <div className="agreements-grid">
              {agreements.map((agreement) => (
                <AgreementCard
                  key={agreement.id}
                  agreement={agreement}
                  userRole="CONTRACTOR"
                  onConfirmMilestone={handleConfirmMilestone}
                />
              ))}
            </div>
          )}
        </div>

        {/* Powered By */}
        <PoweredByBadge />
      </main>

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <style>{`
        .spinning { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
