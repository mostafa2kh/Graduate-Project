import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { demoAccounts } from '../context/demoAccounts';
import { useAuth } from '../context/useAuth';
import type { UserRole } from '../context/authTypes';
import { Shield, Mail, Lock, User, Sparkles, Building2, UserCheck } from 'lucide-react';
import './Login.css';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('RENTER');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide an email address.');
      return;
    }
    setError('');
    login(email, role);
    
    // Redirect based on role
    if (role === 'ADMIN') {
      navigate('/admin/overview');
    } else if (role === 'LANDLORD') {
      navigate('/dashboard/listings');
    } else {
      navigate('/dashboard/bookings');
    }
  };

  const handleDemoLogin = (type: 'renter' | 'landlord' | 'admin') => {
    const account = demoAccounts[type];
    setEmail(account.email);
    setPassword('password123');
    setRole(account.role);
    
    login(account.email, account.role);
    
    if (account.role === 'ADMIN') {
      navigate('/admin/overview');
    } else if (account.role === 'LANDLORD') {
      navigate('/dashboard/listings');
    } else {
      navigate('/dashboard/bookings');
    }
  };

  return (
    <div className="login-page animate-fade-in">
      <div className="login-bg-glow"></div>
      <div className="login-card glass">
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 800 }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>Sign in to continue to RentSphere</p>
        </div>

        {error && <div className="login-error-alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Role selector tabs */}
          <div className="login-role-tabs">
            {(['RENTER', 'LANDLORD', 'ADMIN'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                className={`login-role-tab ${role === r ? 'active' : ''}`}
                onClick={() => setRole(r)}
              >
                {r === 'RENTER' && <User size={14} />}
                {r === 'LANDLORD' && <Building2 size={14} />}
                {r === 'ADMIN' && <Shield size={14} />}
                <span>{r}</span>
              </button>
            ))}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} className="login-field-icon" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input login-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} className="login-field-icon" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input login-input"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary login-submit-btn">
            Sign In
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-dark)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create account</Link>
        </p>

        {/* Demo Fast Login Panel */}
        <div className="demo-accounts-panel">
          <p className="demo-accounts-title">
            <Sparkles size={14} style={{ color: 'var(--warning)' }} />
            <span>Graduate Review: Instant Role Access</span>
          </p>
          <div className="demo-buttons-grid">
            <button className="demo-login-btn renter" onClick={() => handleDemoLogin('renter')}>
              <UserCheck size={14} />
              <span>Renter Profile</span>
            </button>
            <button className="demo-login-btn landlord" onClick={() => handleDemoLogin('landlord')}>
              <Building2 size={14} />
              <span>Landlord Profile</span>
            </button>
            <button className="demo-login-btn admin" onClick={() => handleDemoLogin('admin')}>
              <Shield size={14} />
              <span>Admin Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
