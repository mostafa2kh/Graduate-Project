import React from 'react';
import { useAuth } from '../context/useAuth';
import { Settings as SettingsIcon, Bell, Key, CreditCard } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="settings-page animate-fade-in" style={{ paddingTop: '10px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#fff' }}>Account Settings</h2>
        <p style={{ color: 'var(--text-muted)' }}>Configure notifications preferences, smart keys, and security controls.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '30px' }}>
        {/* Navigation Sidebar */}
        <aside className="glass" style={{ padding: '16px', height: 'fit-content' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.9rem' }}>
              <SettingsIcon size={16} />
              <span>General Settings</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}>
              <Key size={16} />
              <span>API Credentials</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}>
              <Bell size={16} />
              <span>Notifications Feed</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}>
              <CreditCard size={16} />
              <span>Payment Methods</span>
            </div>
          </div>
        </aside>

        {/* Content Pane */}
        <div className="glass" style={{ padding: '30px' }}>
          <h3 style={{ color: '#fff', marginBottom: '24px' }}>Profile Information</h3>
          
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" defaultValue={user.name} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" defaultValue={user.email} disabled />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password Changes</label>
              <input type="password" className="form-input" placeholder="Current Password" />
              <input type="password" className="form-input" placeholder="New Password" style={{ marginTop: '10px' }} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: 'fit-content', padding: '10px 24px' }}>
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
