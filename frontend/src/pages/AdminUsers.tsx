import React, { useState } from 'react';
import { ShieldCheck, UserCog } from 'lucide-react';
import { demoAccounts } from '../context/demoAccounts';

type UserStatus = 'ACTIVE' | 'SUSPENDED';

export const AdminUsers: React.FC = () => {
  const [statuses, setStatuses] = useState<Record<string, UserStatus>>({});
  const users = Object.values(demoAccounts);

  const toggleStatus = (id: string) => {
    setStatuses(prev => ({ ...prev, [id]: prev[id] === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED' }));
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#fff' }}>User Management</h2>
        <p style={{ color: 'var(--text-muted)' }}>Review demo users, roles, KYC state, and account access.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {users.map(user => {
          const status = statuses[user.id] || 'ACTIVE';
          return (
            <div key={user.id} className="glass" style={{ padding: '18px', display: 'grid', gridTemplateColumns: '56px 1fr auto', gap: '16px', alignItems: 'center' }}>
              <img src={user.avatar} alt={user.name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <h3 style={{ color: '#fff', fontSize: '1rem' }}>{user.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{user.email}</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                  <span className="badge badge-info"><UserCog size={12} /> {user.role}</span>
                  <span className="badge badge-success"><ShieldCheck size={12} /> KYC Approved</span>
                  <span className={status === 'ACTIVE' ? 'badge badge-success' : 'badge badge-danger'}>{status}</span>
                </div>
              </div>
              <button className="btn btn-secondary" onClick={() => toggleStatus(user.id)}>
                {status === 'ACTIVE' ? 'Suspend' : 'Restore'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
