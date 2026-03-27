import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNerave } from '../hooks/useNerave';
import type { Agreement } from 'nerave-sdk';
import CreateAgreementModal from '../components/CreateAgreementModal';
import AgreementCard from '../components/AgreementCard';
import FlowDiagram from '../components/FlowDiagram';
import PoweredByBadge from '../components/PoweredByBadge';
import SDKCodePanel from '../components/SDKCodePanel';
import Toast from '../components/Toast';
import {
  LayoutDashboard, Plus, RefreshCw, LogOut, Key,
  FileText, Milestone, DollarSign, Copy, Check,
} from 'lucide-react';

export default function BusinessDashboard() {
  const { user, logout } = useAuth();
  const { nerave } = useNerave();
  const navigate = useNavigate();

  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
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
    if (user.role !== 'CLIENT') { navigate('/client'); return; }
    fetchAgreements();
  }, [user, navigate, fetchAgreements]);

  function handleRefresh() {
    setRefreshing(true);
    fetchAgreements();
  }

  function handleAgreementCreated() {
    setShowModal(false);
    setToast({ message: 'Agreement created! Smart contract deployed on Sepolia.', type: 'success' });
    fetchAgreements();
  }

  async function handleConfirmMilestone(agreementId: string, milestoneId: string) {
    if (!nerave) return;
    try {
      await nerave.milestones.confirm({ agreementId, milestoneId });
      setToast({ message: 'Milestone confirmed as Business Owner!', type: 'success' });
      fetchAgreements();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to confirm';
      setToast({ message: msg, type: 'error' });
    }
  }

  async function handleInitiatePayment(agreementId: string) {
    if (!nerave) return;
    try {
      const result = await nerave.payments.initiate(agreementId);
      if (result.paymentUrl) {
        setToast({ message: 'Redirecting to Interswitch payment...', type: 'success' });
        setTimeout(() => window.open(result.paymentUrl, '_blank'), 1000);
      } else {
        setToast({ message: `Payment ref: ${result.transactionReference}`, type: 'success' });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Payment initiation failed';
      setToast({ message: msg, type: 'error' });
    }
  }

  async function handleMockPay(agreementId: string) {
    if (!nerave) return;
    try {
      const result = await nerave.payments.initiate(agreementId);
      // Use mock-pay endpoint
      const API_URL = import.meta.env.VITE_NERAVE_API_URL || 'https://nerave.onrender.com';
      const resp = await fetch(`${API_URL}/payments/mock-pay/${result.transactionReference}`);
      if (resp.ok) {
        setToast({ message: 'Mock payment completed! Agreement is now FUNDED.', type: 'success' });
        setTimeout(() => fetchAgreements(), 1500);
      } else {
        setToast({ message: 'Mock payment failed', type: 'error' });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Mock payment failed';
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
  const activeMilestones = agreements.reduce((acc, a) => acc + (a.milestones?.length || 0), 0);
  const totalValue = agreements.reduce((acc, a) => acc + Number(a.totalAmount || 0), 0);
  const fundedCount = agreements.filter(a => a.status === 'FUNDED' || a.status === 'IN_PROGRESS' || a.status === 'COMPLETED').length;

  // Determine flow step
  const flowStep = agreements.length === 0 ? 0
    : fundedCount === 0 ? 2
    : agreements.some(a => a.status === 'COMPLETED') ? 4
    : 3;

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
          <div className="user-role">Business Owner</div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-link active">
            <LayoutDashboard size={16} />
            Dashboard
          </div>
          <div className="sidebar-link" style={{ opacity: 0.5 }}>
            <FileText size={16} />
            Agreements
          </div>
          <div className="sidebar-link" style={{ opacity: 0.5 }}>
            <DollarSign size={16} />
            Payments
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
            <h1>Business Dashboard</h1>
            <div className="page-subtitle">
              Manage your agreements and milestone payments
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw size={14} className={refreshing ? 'spinning' : ''} />
              Refresh
            </button>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={14} />
              New Agreement
            </button>
          </div>
        </div>

        {/* Flow Diagram */}
        <FlowDiagram currentStep={flowStep} />

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{totalAgreements}</div>
            <div className="stat-label">Total Agreements</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{activeMilestones}</div>
            <div className="stat-label">Active Milestones</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">₦{totalValue.toLocaleString()}</div>
            <div className="stat-label">Total Value</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{fundedCount}</div>
            <div className="stat-label">Funded</div>
          </div>
        </div>

        {/* SDK Code Panel */}
        <SDKCodePanel
          title="How this page uses nerave-sdk"
          code={`import { Nerave } from 'nerave-sdk';

// Initialize with your API key
const nerave = new Nerave({
  apiKey: '${user.apiKey}',
  baseUrl: '${import.meta.env.VITE_NERAVE_API_URL}',
});

// List all agreements
const agreements = await nerave.agreements.list();

// Create a new agreement (deploys smart contract!)
const agreement = await nerave.agreements.create({
  contractorId: 'contractor-user-id',
  totalAmount: 500000,
  milestones: [
    { title: 'Design Phase', amount: 150000 },
    { title: 'Development', amount: 250000 },
    { title: 'Deployment', amount: 100000 },
  ],
});

// Fund via Interswitch
const payment = await nerave.payments.initiate(agreement.id);
// → Opens Interswitch checkout page

// Confirm a milestone (as CLIENT)
await nerave.milestones.confirm({
  agreementId: agreement.id,
  milestoneId: 'milestone-uuid',
});`}
        />

        {/* Agreements List */}
        <div style={{ marginTop: '32px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>
            <FileText size={18} style={{ display: 'inline', verticalAlign: '-3px', marginRight: '8px' }} />
            Your Agreements
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div className="spinner spinner-lg" style={{ margin: '0 auto' }} />
              <p style={{ marginTop: '16px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                Loading agreements via nerave-sdk...
              </p>
            </div>
          ) : agreements.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FileText size={48} />
              </div>
              <h3>No agreements yet</h3>
              <p>Create your first agreement to deploy a PayLock smart contract on Sepolia and start managing milestones.</p>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                <Plus size={14} />
                Create First Agreement
              </button>
            </div>
          ) : (
            <div className="agreements-grid">
              {agreements.map((agreement) => (
                <AgreementCard
                  key={agreement.id}
                  agreement={agreement}
                  userRole="CLIENT"
                  onConfirmMilestone={handleConfirmMilestone}
                  onInitiatePayment={handleInitiatePayment}
                  onMockPay={handleMockPay}
                />
              ))}
            </div>
          )}
        </div>

        {/* Powered By */}
        <PoweredByBadge />
      </main>

      {/* Modal */}
      {showModal && (
        <CreateAgreementModal
          onClose={() => setShowModal(false)}
          onCreated={handleAgreementCreated}
        />
      )}

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
