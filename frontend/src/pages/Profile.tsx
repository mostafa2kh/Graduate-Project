import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { ShieldCheck, Clock, Camera, Upload, CheckCircle2 } from 'lucide-react';
import './Profile.css';

export const Profile: React.FC = () => {
  const { user, updateKyc } = useAuth();
  const [docType, setDocType] = useState('Passport');
  const [docNum, setDocNum] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNum.trim()) return;

    setSubmitting(true);
    updateKyc('PENDING');

    // Simulate verification-service & admin review
    setTimeout(() => {
      setSubmitting(false);
      updateKyc('APPROVED');
    }, 3000);
  };

  if (!user) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h3>Access Denied</h3>
        <p>Please log in to view this profile.</p>
      </div>
    );
  }

  return (
    <div className="profile-page-container animate-fade-in">
      <div className="profile-header-card glass">
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <img src={user.avatar} alt={user.name} className="profile-large-avatar" />
          <div>
            <h2 style={{ color: '#fff', fontSize: '1.6rem' }}>{user.name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.email}</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <span className="badge badge-info">{user.role} Account</span>
              {user.kycStatus === 'APPROVED' ? (
                <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={12} /> Verified Identity</span>
              ) : user.kycStatus === 'PENDING' ? (
                <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> KYC Pending</span>
              ) : (
                <span className="badge badge-danger">KYC Incomplete</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="profile-layout-content">
        {/* Info panel */}
        <div className="profile-details-pane glass">
          <h3 style={{ color: '#fff', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>Account Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>MEMBER ID</p>
              <p style={{ color: '#fff', fontWeight: 600 }}>{user.id}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PREFERENCES</p>
              <p style={{ color: '#fff', fontSize: '0.9rem' }}>Preferred currency: USD ($)<br />Timezone: EST (UTC-5)</p>
            </div>
          </div>
        </div>

        {/* KYC Submission panel */}
        <div className="profile-kyc-pane glass">
          <h3 style={{ color: '#fff', marginBottom: '12px' }}>Verify Your Identity</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
            Submit your legal documents to unlock secure landlord hosting, request direct visits, and receive verified badges.
          </p>

          {user.kycStatus === 'APPROVED' ? (
            <div className="kyc-done-card">
              <CheckCircle2 size={44} style={{ color: 'var(--success)', marginBottom: '12px' }} />
              <h4>Identity Verification Complete</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>
                Your account is verified by the central verification-service microservice. You have full platform access.
              </p>
            </div>
          ) : submitting ? (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <div className="ai-spinner" style={{ margin: '0 auto 16px', width: '32px', height: '32px' }}></div>
              <h5 style={{ color: '#fff' }}>verifying documents...</h5>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>
                verification-service auditing signature authenticity
              </p>
            </div>
          ) : (
            <form onSubmit={handleKycSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Document Type</label>
                <select className="form-input" value={docType} onChange={(e) => setDocType(e.target.value)}>
                  <option value="Passport">Passport</option>
                  <option value="Driver License">Driver's License</option>
                  <option value="National ID">National ID Card</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Document Number</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. DL-910283A" 
                  className="form-input" 
                  value={docNum}
                  onChange={(e) => setDocNum(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '8px 0' }}>
                <div className="mock-upload-box">
                  <Upload size={16} />
                  <span>Scan / Photo ID</span>
                </div>
                <div className="mock-upload-box">
                  <Camera size={16} />
                  <span>Take Selfie</span>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={!docNum}>
                Submit Verification
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
