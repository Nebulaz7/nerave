import { useState } from 'react';
import type { Agreement } from 'nerave-sdk';
import EtherscanLink from './EtherscanLink';
import SDKCodePanel from './SDKCodePanel';
import {
  ChevronDown, ChevronUp, CreditCard, Zap,
  CheckCircle2, Clock, Ban, CircleDollarSign,
} from 'lucide-react';

interface AgreementCardProps {
  agreement: Agreement;
  userRole: 'CLIENT' | 'CONTRACTOR';
  onConfirmMilestone: (agreementId: string, milestoneId: string) => void;
  onInitiatePayment?: (agreementId: string) => void;
  onMockPay?: (agreementId: string) => void;
}

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  PENDING_PAYMENT: { label: 'Pending Payment', className: 'badge-amber', icon: <Clock size={10} /> },
  FUNDED: { label: 'Funded', className: 'badge-teal', icon: <CircleDollarSign size={10} /> },
  IN_PROGRESS: { label: 'In Progress', className: 'badge-purple', icon: <Zap size={10} /> },
  COMPLETED: { label: 'Completed', className: 'badge-emerald', icon: <CheckCircle2 size={10} /> },
  CANCELLED: { label: 'Cancelled', className: 'badge-rose', icon: <Ban size={10} /> },
};

export default function AgreementCard({
  agreement,
  userRole,
  onConfirmMilestone,
  onInitiatePayment,
  onMockPay,
}: AgreementCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const status = STATUS_CONFIG[agreement.status] || STATUS_CONFIG.PENDING_PAYMENT;
  const milestones = agreement.milestones || [];
  const confirmedCount = milestones.filter(m => m.disbursed).length;
  const progress = milestones.length > 0 ? (confirmedCount / milestones.length) * 100 : 0;

  async function handleConfirm(milestoneId: string) {
    setConfirmingId(milestoneId);
    try {
      await onConfirmMilestone(agreement.id, milestoneId);
    } finally {
      setConfirmingId(null);
    }
  }

  return (
    <div className="agreement-card glass-card">
      {/* Header */}
      <div className="agreement-card-header">
        <div>
          <div className="agreement-card-title">
            Agreement #{agreement.id.slice(0, 8)}
          </div>
          <div className="agreement-card-meta">
            <span className="meta-item">
              <CircleDollarSign size={12} />
              ₦{Number(agreement.totalAmount).toLocaleString()}
            </span>
            <span className="meta-item">
              {milestones.length} milestone{milestones.length !== 1 ? 's' : ''}
            </span>
            {agreement.contractAddress && (
              <EtherscanLink address={agreement.contractAddress} />
            )}
          </div>
        </div>
        <div className={`badge ${status.className}`}>
          {status.icon}
          {status.label}
        </div>
      </div>

      {/* Progress */}
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
        {confirmedCount}/{milestones.length} milestones completed
      </div>

      {/* Actions */}
      <div className="agreement-card-footer">
        <div style={{ display: 'flex', gap: '8px' }}>
          {agreement.status === 'PENDING_PAYMENT' && userRole === 'CLIENT' && (
            <>
              {onInitiatePayment && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onInitiatePayment(agreement.id)}
                >
                  <CreditCard size={12} />
                  Pay via Interswitch
                </button>
              )}
              {onMockPay && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onMockPay(agreement.id)}
                  title="Skip real payment for demo"
                >
                  <Zap size={12} />
                  Mock Pay (Demo)
                </button>
              )}
            </>
          )}
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Hide' : 'Show'} Milestones
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Expanded Milestones */}
      {expanded && (
        <div style={{ marginTop: '16px' }}>
          <div className="milestones-list">
            {milestones.map((milestone) => {
              const isConfirmedByMe = userRole === 'CLIENT'
                ? milestone.clientConfirmed
                : milestone.contractorConfirmed;
              const canConfirm =
                !milestone.disbursed &&
                !isConfirmedByMe &&
                (agreement.status === 'FUNDED' || agreement.status === 'IN_PROGRESS');

              return (
                <div
                  key={milestone.id}
                  className={`milestone-item ${milestone.disbursed ? 'disbursed' : ''}`}
                >
                  <div className="milestone-info">
                    <div className="milestone-title">{milestone.title}</div>
                    <div className="milestone-amount">₦{Number(milestone.amount).toLocaleString()}</div>
                  </div>

                  <div className="milestone-confirmations">
                    <div
                      className={`confirmation-dot ${milestone.clientConfirmed ? 'confirmed' : 'pending'}`}
                      title={milestone.clientConfirmed ? 'Client confirmed' : 'Client pending'}
                    >
                      C
                    </div>
                    <div
                      className={`confirmation-dot ${milestone.contractorConfirmed ? 'confirmed' : 'pending'}`}
                      title={milestone.contractorConfirmed ? 'Contractor confirmed' : 'Contractor pending'}
                    >
                      S
                    </div>
                  </div>

                  <div className="milestone-actions">
                    {milestone.disbursed ? (
                      <span className="badge badge-emerald">
                        <CheckCircle2 size={10} />
                        Disbursed
                      </span>
                    ) : isConfirmedByMe ? (
                      <span className="badge badge-teal">
                        <CheckCircle2 size={10} />
                        Confirmed
                      </span>
                    ) : canConfirm ? (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleConfirm(milestone.id)}
                        disabled={confirmingId === milestone.id}
                      >
                        {confirmingId === milestone.id ? (
                          <span className="spinner" />
                        ) : (
                          <CheckCircle2 size={12} />
                        )}
                        Confirm
                      </button>
                    ) : (
                      <span className="badge badge-amber">
                        <Clock size={10} />
                        Awaiting Payment
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* SDK code for milestone confirmation */}
          <SDKCodePanel
            title="Milestone Confirmation SDK Code"
            code={`// Confirm milestone completion
const result = await nerave.milestones.confirm({
  agreementId: '${agreement.id}',
  milestoneId: '<milestone-id>',
});

// When both parties confirm:
// 1. Smart contract emits MilestoneApproved event
// 2. Backend detects event via Viem listener
// 3. Interswitch TransferFunds API disburses to contractor
// 4. GTB account 0014261063 receives ₦${Number(agreement.totalAmount).toLocaleString()}`}
          />
        </div>
      )}
    </div>
  );
}
