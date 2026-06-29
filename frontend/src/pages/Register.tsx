import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import type { UserRole } from '../context/authTypes';
import { Mail, Lock, User, Building2 } from 'lucide-react';
import './Login.css'; // sharing card styles

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('RENTER');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');

    // Simulate profile creation & trigger login
    login(email, role);

    // Redirect based on selected role dashboard
    if (role === 'ADMIN') {
      navigate('/admin/overview');
    } else if (role === 'LANDLORD') {
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
          <h2 style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 800 }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>Join RentSphere to rent or host luxury spaces</p>
        </div>

        {error && <div className="login-error-alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Role selector tabs */}
          <div className="login-role-tabs">
            {(['RENTER', 'LANDLORD'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                className={`login-role-tab ${role === r ? 'active' : ''}`}
                onClick={() => setRole(r)}
                style={{ gridColumn: 'span 1.5' }}
              >
                {r === 'RENTER' ? <User size={14} /> : <Building2 size={14} />}
                <span>I am a {r === 'RENTER' ? 'Renter' : 'Landlord'}</span>
              </button>
            ))}
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} className="login-field-icon" />
              <input
                type="text"
                required
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input login-input"
              />
            </div>
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
            Create Account
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-dark)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};
