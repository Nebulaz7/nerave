import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../context/AuthContext';
import { Building2, Wrench, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login, register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [role, setRole] = useState<UserRole>('CLIENT');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError('');
    clearError();

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!businessName.trim()) {
          setLocalError('Business name is required');
          return;
        }
        await register(email, password, businessName, role);
      }
      // Navigate based on role after login
      const stored = localStorage.getItem('nerave_demo_user');
      if (stored) {
        const u = JSON.parse(stored);
        navigate(u.role === 'CLIENT' ? '/business' : '/client');
      }
    } catch {
      // Error is handled by context
    }
  }

  async function quickLogin(quickRole: 'CLIENT' | 'CONTRACTOR') {
    setLocalError('');
    clearError();
    const suffix = quickRole === 'CLIENT' ? 'owner' : 'contractor';
    const quickEmail = `demo-${suffix}@nerave.test`;
    const quickPass = 'Demo12345!';
    const quickBiz = quickRole === 'CLIENT' ? 'AcmeCorp Ltd' : 'DevStudio Pro';

    try {
      // Try login first
      await login(quickEmail, quickPass);
      navigate(quickRole === 'CLIENT' ? '/business' : '/client');
    } catch {
      // If login fails, register then login
      try {
        await register(quickEmail, quickPass, quickBiz, quickRole);
        navigate(quickRole === 'CLIENT' ? '/business' : '/client');
      } catch (regErr: unknown) {
        setLocalError(regErr instanceof Error ? regErr.message : 'Quick login failed. Try manual registration.');
      }
    }
  }

  const displayError = localError || error;

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Brand */}
        <div className="login-brand">
          <h1>Nerave<span className="brand-dot">.</span></h1>
          <p>Trustless milestone payments for African businesses</p>
        </div>

        {/* Login Card */}
        <div className="login-card glass-card">
          {/* Tabs */}
          <div className="login-tabs">
            <button
              className={`login-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); clearError(); setLocalError(''); }}
            >
              <LogIn size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: '-2px' }} />
              Sign In
            </button>
            <button
              className={`login-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); clearError(); setLocalError(''); }}
            >
              <UserPlus size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: '-2px' }} />
              Register
            </button>
          </div>

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  style={{ width: '100%', paddingRight: '40px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <>
                <div className="input-group">
                  <label htmlFor="businessName">Business Name</label>
                  <input
                    id="businessName"
                    type="text"
                    className="input-field"
                    placeholder="Your Company Ltd"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="role">Role</label>
                  <select
                    id="role"
                    className="input-field"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                  >
                    <option value="CLIENT">Business Owner (Client)</option>
                    <option value="CONTRACTOR">Service Provider (Contractor)</option>
                  </select>
                </div>
              </>
            )}

            {displayError && (
              <div style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-rose-dim)',
                color: 'var(--color-rose)',
                fontSize: '0.8rem',
                border: '1px solid rgba(244,63,94,0.2)',
              }}>
                {displayError}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-lg submit-btn" disabled={loading}>
              {loading && <span className="spinner" />}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Quick Access */}
          <div className="quick-access">
            <div className="divider">Quick Demo Access</div>
            <div className="quick-btns">
              <button className="quick-btn" onClick={() => quickLogin('CLIENT')} disabled={loading}>
                <div className="quick-icon client-icon">
                  <Building2 size={14} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 500, color: 'var(--color-text-primary)', fontSize: '0.85rem' }}>
                    Login as Business Owner
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                    Create agreements & fund milestones
                  </div>
                </div>
              </button>
              <button className="quick-btn" onClick={() => quickLogin('CONTRACTOR')} disabled={loading}>
                <div className="quick-icon contractor-icon">
                  <Wrench size={14} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 500, color: 'var(--color-text-primary)', fontSize: '0.85rem' }}>
                    Login as Contractor
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                    View & confirm milestones
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
        }}>
          Built with <span style={{ color: 'var(--color-teal)' }}>nerave-sdk</span> · Interswitch Sandbox · Sepolia Testnet
        </div>
      </div>
    </div>
  );
}
