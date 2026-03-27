import { CheckCircle, Circle, Zap } from 'lucide-react';

interface FlowDiagramProps {
  /** Which step(s) are active, 0-indexed */
  currentStep?: number;
}

const STEPS = [
  { label: 'Create Agreement', icon: '📝' },
  { label: 'Deploy Contract', icon: '⛓️' },
  { label: 'Fund via Interswitch', icon: '💳' },
  { label: 'Confirm Milestones', icon: '✅' },
  { label: 'Auto-Disburse', icon: '🏦' },
];

export default function FlowDiagram({ currentStep = -1 }: FlowDiagramProps) {
  return (
    <div className="flow-container glass-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <Zap size={16} style={{ color: 'var(--color-teal)' }} />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
          Nerave Payment Flow
        </span>
      </div>
      <div className="flow-steps">
        {STEPS.map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className={`flow-step ${i === currentStep ? 'active' : i < currentStep ? 'completed' : ''}`}>
              <span>{step.icon}</span>
              <span>{step.label}</span>
              {i < currentStep ? <CheckCircle size={14} /> : <Circle size={14} />}
            </div>
            {i < STEPS.length - 1 && <span className="flow-arrow">→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
