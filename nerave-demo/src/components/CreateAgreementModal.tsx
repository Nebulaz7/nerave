import { useState } from 'react';
import { useNerave } from '../hooks/useNerave';
import { useAuth } from '../context/AuthContext';
import SDKCodePanel from './SDKCodePanel';
import { X, Plus, Trash2, ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import axios from 'axios';

interface MilestoneInput {
  title: string;
  amount: string;
}

interface CreateAgreementModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateAgreementModal({ onClose, onCreated }: CreateAgreementModalProps) {
  const { nerave } = useNerave();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Get or create contractor
  const [contractorEmail, setContractorEmail] = useState('');
  const [contractorId, setContractorId] = useState('');
  const [contractorLookedUp, setContractorLookedUp] = useState(false);
  const [totalAmount, setTotalAmount] = useState('');

  // Step 2: Milestones
  const [milestones, setMilestones] = useState<MilestoneInput[]>([
    { title: '', amount: '' },
  ]);

  // Step 3: Result
  const [createdAgreement, setCreatedAgreement] = useState<{ id: string; contractAddress?: string } | null>(null);

  function addMilestone() {
    setMilestones([...milestones, { title: '', amount: '' }]);
  }

  function removeMilestone(index: number) {
    if (milestones.length <= 1) return;
    setMilestones(milestones.filter((_, i) => i !== index));
  }

  function updateMilestone(index: number, field: keyof MilestoneInput, value: string) {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  }

  const milestoneTotal = milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);

  async function lookupContractor() {
    if (!contractorEmail.trim()) {
      setError('Enter the contractor email');
      return;
    }
    setError('');
    setLoading(true);

    try {
      // Try to login as the contractor to see if they exist,
      // or use a direct API call. For the demo, we'll use
      // a simple approach: try to register the contractor if not existing
      const API_URL = import.meta.env.VITE_NERAVE_API_URL || 'https://nerave.onrender.com';

      // First try to register (will fail if already exists)
      try {
        const regResp = await axios.post(`${API_URL}/auth/register`, {
          email: contractorEmail,
          password: 'Demo12345!',
          businessName: contractorEmail.split('@')[0] + ' Services',
          role: 'CONTRACTOR',
        });
        setContractorId(regResp.data.userId);
        setContractorLookedUp(true);
      } catch {
        // Already exists — try logging in to get userId
        try {
          const loginResp = await axios.post(`${API_URL}/auth/login`, {
            email: contractorEmail,
            password: 'Demo12345!',
          });
          setContractorId(loginResp.data.userId);
          setContractorLookedUp(true);
        } catch {
          setError('Could not find or create contractor. Use demo-contractor@nerave.test');
        }
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!nerave || !contractorId) return;
    setError('');
    setLoading(true);

    // Validate milestones
    const validMilestones = milestones.filter(m => m.title.trim() && Number(m.amount) > 0);
    if (validMilestones.length === 0) {
      setError('Add at least one milestone with title and amount');
      setLoading(false);
      return;
    }

    const total = Number(totalAmount);
    if (total <= 0) {
      setError('Total amount must be positive');
      setLoading(false);
      return;
    }

    try {
      const result = await nerave.agreements.create({
        contractorId,
        totalAmount: total,
        milestones: validMilestones.map(m => ({
          title: m.title.trim(),
          amount: Number(m.amount),
        })),
      });

      setCreatedAgreement({
        id: result.id,
        contractAddress: result.contractAddress || undefined,
      });
      setStep(3);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create agreement';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>Create Agreement</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator">
          <div className={`step-dot ${step >= 1 ? (step > 1 ? 'completed' : 'active') : ''}`}>1</div>
          <div className={`step-line ${step > 1 ? 'active' : ''}`} />
          <div className={`step-dot ${step >= 2 ? (step > 2 ? 'completed' : 'active') : ''}`}>2</div>
          <div className={`step-line ${step > 2 ? 'active' : ''}`} />
          <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>

        {/* Step 1: Details */}
        {step === 1 && (
          <div className="modal-body">
            <div className="input-group">
              <label>Contractor Email</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  className="input-field"
                  style={{ flex: 1 }}
                  placeholder="contractor@company.com"
                  value={contractorEmail}
                  onChange={(e) => { setContractorEmail(e.target.value); setContractorLookedUp(false); }}
                />
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={lookupContractor}
                  disabled={loading || contractorLookedUp}
                >
                  {loading ? <Loader2 size={14} className="spinning" /> : contractorLookedUp ? <CheckCircle2 size={14} /> : 'Find'}
                </button>
              </div>
              {contractorLookedUp && (
                <div style={{ fontSize: '0.75rem', color: 'var(--color-teal)' }}>
                  ✓ Contractor found: {contractorId.slice(0, 8)}...
                </div>
              )}
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                💡 Tip: Use <code style={{ color: 'var(--color-teal)' }}>demo-contractor@nerave.test</code> for quick demo
              </div>
            </div>

            <div className="input-group">
              <label>Total Amount (₦)</label>
              <input
                className="input-field"
                type="number"
                placeholder="500000"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
              />
            </div>

            {error && (
              <div style={{
                padding: '8px 12px', borderRadius: 'var(--radius-md)',
                background: 'var(--color-rose-dim)', color: 'var(--color-rose)',
                fontSize: '0.8rem', border: '1px solid rgba(244,63,94,0.2)',
              }}>
                {error}
              </div>
            )}

            <SDKCodePanel
              title="Step 1: Initialize"
              code={`const nerave = new Nerave({
  apiKey: '${user?.apiKey || 'pk_test_...'}',
});

// Creating agreement with contractor
// Contract will be deployed to Sepolia testnet`}
              defaultOpen
            />

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={() => setStep(2)}
                disabled={!contractorLookedUp || !totalAmount}
              >
                Next: Add Milestones <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Milestones */}
        {step === 2 && (
          <div className="modal-body">
            <div className="milestone-inputs">
              {milestones.map((m, i) => (
                <div key={i} className="milestone-input-row">
                  <div className="input-group">
                    {i === 0 && <label>Milestone Title</label>}
                    <input
                      className="input-field"
                      placeholder={`e.g. ${['Design Phase', 'Development', 'Testing', 'Deployment'][i] || 'Milestone'}`}
                      value={m.title}
                      onChange={(e) => updateMilestone(i, 'title', e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    {i === 0 && <label>Amount (₦)</label>}
                    <input
                      className="input-field"
                      type="number"
                      placeholder="100000"
                      value={m.amount}
                      onChange={(e) => updateMilestone(i, 'amount', e.target.value)}
                    />
                  </div>
                  <button
                    className="btn btn-danger btn-sm remove-btn"
                    onClick={() => removeMilestone(i)}
                    disabled={milestones.length <= 1}
                    style={{ marginTop: i === 0 ? '22px' : '0' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>

            <button className="btn btn-ghost btn-sm" onClick={addMilestone}>
              <Plus size={14} />
              Add Milestone
            </button>

            <div style={{
              padding: '10px 14px',
              background: milestoneTotal > Number(totalAmount) ? 'var(--color-rose-dim)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${milestoneTotal > Number(totalAmount) ? 'rgba(244,63,94,0.3)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Milestone Total</span>
              <span style={{ color: milestoneTotal > Number(totalAmount) ? 'var(--color-rose)' : 'var(--color-teal)', fontWeight: 600 }}>
                ₦{milestoneTotal.toLocaleString()} / ₦{Number(totalAmount).toLocaleString()}
              </span>
            </div>

            {error && (
              <div style={{
                padding: '8px 12px', borderRadius: 'var(--radius-md)',
                background: 'var(--color-rose-dim)', color: 'var(--color-rose)',
                fontSize: '0.8rem', border: '1px solid rgba(244,63,94,0.2)',
              }}>
                {error}
              </div>
            )}

            <SDKCodePanel
              title="Step 2: Create Agreement"
              code={`const agreement = await nerave.agreements.create({
  contractorId: '${contractorId.slice(0, 8)}...',
  totalAmount: ${totalAmount || 0},
  milestones: [
${milestones.filter(m => m.title).map(m => `    { title: '${m.title}', amount: ${m.amount || 0} },`).join('\n')}
  ],
});
// → Deploys PayLockAgreement.sol to Sepolia
// → Returns { id, contractAddress, status }`}
              defaultOpen
            />

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                <ArrowLeft size={14} /> Back
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreate}
                disabled={loading || milestoneTotal > Number(totalAmount) || milestoneTotal === 0}
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="spinning" />
                    Deploying Contract...
                  </>
                ) : (
                  <>
                    Deploy & Create <CheckCircle2 size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && createdAgreement && (
          <div className="modal-body" style={{ textAlign: 'center' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%', margin: '0 auto 20px',
              background: 'var(--color-teal-dim)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <CheckCircle2 size={40} style={{ color: 'var(--color-teal)' }} />
            </div>

            <h3 style={{ marginBottom: '8px' }}>Agreement Created!</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              A PayLockAgreement smart contract has been deployed on the Sepolia testnet.
            </p>

            <div style={{
              padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)', textAlign: 'left', fontSize: '0.8rem',
            }}>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Agreement ID:</span>{' '}
                <code style={{ color: 'var(--color-teal)' }}>{createdAgreement.id}</code>
              </div>
              {createdAgreement.contractAddress && (
                <div>
                  <span style={{ color: 'var(--color-text-muted)' }}>Contract:</span>{' '}
                  <a
                    href={`${import.meta.env.VITE_ETHERSCAN_BASE_URL || 'https://sepolia.etherscan.io'}/address/${createdAgreement.contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="etherscan-link"
                  >
                    {createdAgreement.contractAddress}
                  </a>
                </div>
              )}
            </div>

            <SDKCodePanel
              title="What Happened Behind the Scenes"
              code={`// 1. nerave-sdk called POST /agreements
// 2. Backend deployed PayLockAgreement.sol via Viem
// 3. Constructor args: (clientAddress, contractorAddress, totalAmount)
// 4. Milestones added via addMilestones() on-chain
// 5. Contract now lives on Sepolia at:
//    ${createdAgreement.contractAddress || 'deploying...'}
// 6. Verify on Etherscan ↗`}
              defaultOpen
            />

            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn btn-primary btn-lg" onClick={onCreated}>
                View in Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .spinning { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
