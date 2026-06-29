import React, { useState, useEffect, useRef } from 'react';
import { getListings, saveListings, Listing } from '../data/mockListings';
import { Check, X, ShieldCheck, FileText, ShieldAlert, Terminal, Activity, Sparkles } from 'lucide-react';
import './AdminDashboard.css';

interface AuditLog {
  id: string;
  service: 'auth-service' | 'user-service' | 'listing-service' | 'ai-review-service' | 'payment-service' | 'notification-service';
  message: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
}

const initialAuditLogs: AuditLog[] = [
  { id: 'log-1', service: 'auth-service', level: 'INFO', message: 'Token signed: RENTER session created for john@rentsphere.com', timestamp: '06:40:12' },
  { id: 'log-2', service: 'listing-service', level: 'INFO', message: 'Listing submitted for AI screening: Obsidian Glass Villa', timestamp: '06:40:15' },
  { id: 'log-3', service: 'ai-review-service', level: 'INFO', message: 'Calculated listing trust index score = 98 (Passed filters)', timestamp: '06:40:18' },
  { id: 'log-4', service: 'payment-service', level: 'INFO', message: 'Mock payment gateway intent created: pi_mock_8123984', timestamp: '06:41:01' },
  { id: 'log-5', service: 'notification-service', level: 'INFO', message: 'SMS transaction notification dispatched to landlord-1', timestamp: '06:41:05' }
];

export const AdminDashboard: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState<'moderation' | 'kyc' | 'logs'>('moderation');
  
  // KYC review items
  const [kycRequests, setKycRequests] = useState([
    { id: 'kyc-1', name: 'Mia Wallace', documentType: 'Driver License', docNumber: 'DL-918239A', selfieUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80', status: 'PENDING' },
    { id: 'kyc-2', name: 'Ethan Hunt', documentType: 'Passport', docNumber: 'PP-007X889', selfieUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', status: 'PENDING' }
  ]);

  // Terminal Logs State
  const [logs, setLogs] = useState<AuditLog[]>(initialAuditLogs);
  const logTerminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadListings();
    
    // Periodically append mock microservice activity logs to the terminal to make it look active!
    const logInterval = setInterval(() => {
      const services: AuditLog['service'][] = ['auth-service', 'user-service', 'listing-service', 'ai-review-service', 'payment-service', 'notification-service'];
      const actions = [
        'JWT token refreshed: correlation-id = 812-a192',
        'Profile update syncing with PostgreSQL db: rentsphere_user_db',
        'Redis cache invalidated: Listing search indexes',
        'Webhook delivery success: event = payment.completed',
        'Event published to Redpanda topic: profile.updated',
        'KYC status updated: User id = renter-102 (APPROVED)'
      ];
      
      const randomService = services[Math.floor(Math.random() * services.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        service: randomService,
        level: Math.random() > 0.85 ? 'WARN' : 'INFO',
        message: randomAction,
        timestamp: timeStr
      };

      setLogs(prev => [...prev.slice(-30), newLog]); // Keep last 30 logs
    }, 4000);

    return () => clearInterval(logInterval);
  }, []);

  useEffect(() => {
    // Auto scroll the logs terminal
    if (logTerminalEndRef.current) {
      logTerminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, activeTab]);

  const loadListings = () => {
    const all = getListings();
    setListings(all.filter(l => l.status === 'PENDING'));
  };

  const handleModeration = (listingId: string, action: 'APPROVE' | 'REJECT') => {
    const all = getListings();
    const updated = all.map(l => {
      if (l.id === listingId) {
        return { ...l, status: action === 'APPROVE' ? 'APPROVED' as const : 'REJECTED' as const };
      }
      return l;
    });
    saveListings(updated);

    // Notify the landlord (mock)
    const current = all.find(l => l.id === listingId);
    if (current) {
      const storedNotifs = localStorage.getItem('rentsphere_notifications');
      const notifs = storedNotifs ? JSON.parse(storedNotifs) : [];
      notifs.push({
        id: `notif-${Math.random().toString(36).substr(2, 9)}`,
        userId: current.landlordId,
        title: action === 'APPROVE' ? 'Listing Approved' : 'Listing Rejected',
        message: `Your listing "${current.title}" was ${action.toLowerCase()}d by admin moderation.`,
        date: new Date().toISOString(),
        read: false,
        type: 'moderation'
      });
      localStorage.setItem('rentsphere_notifications', JSON.stringify(notifs));
    }

    loadListings();
  };

  const handleKycAction = (id: string, action: 'APPROVED' | 'REJECTED') => {
    setKycRequests(prev => prev.map(k => k.id === id ? { ...k, status: action } : k));
  };

  return (
    <div className="admin-dashboard animate-fade-in">
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#fff' }}>Global Control Panel</h2>
        <p style={{ color: 'var(--text-muted)' }}>Perform system moderation audits, review verification queues, and trace service metrics.</p>
      </div>

      {/* Grid summary cards */}
      <div className="admin-summary-grid">
        <div className="admin-stat-widget glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span className="lbl">Moderation Queue</span>
            <ShieldAlert size={20} style={{ color: 'var(--warning)' }} />
          </div>
          <h3 className="val">{listings.length} Pending</h3>
          <span className="desc">Requires review checks</span>
        </div>
        <div className="admin-stat-widget glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span className="lbl">KYC Submissions</span>
            <FileText size={20} style={{ color: 'var(--primary)' }} />
          </div>
          <h3 className="val">{kycRequests.filter(k => k.status === 'PENDING').length} Pending</h3>
          <span className="desc">Identity validation requests</span>
        </div>
        <div className="admin-stat-widget glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span className="lbl">Microservice Nodes</span>
            <Activity size={20} style={{ color: 'var(--secondary)' }} />
          </div>
          <h3 className="val" style={{ color: 'var(--secondary)' }}>14 / 14 UP</h3>
          <span className="desc">All services reporting healthy</span>
        </div>
      </div>

      {/* Tabs selectors */}
      <div className="admin-tabs">
        <button className={`admin-tab-btn ${activeTab === 'moderation' ? 'active' : ''}`} onClick={() => setActiveTab('moderation')}>
          <ShieldCheck size={16} />
          <span>Moderation Queue ({listings.length})</span>
        </button>
        <button className={`admin-tab-btn ${activeTab === 'kyc' ? 'active' : ''}`} onClick={() => setActiveTab('kyc')}>
          <FileText size={16} />
          <span>KYC Reviews ({kycRequests.filter(k => k.status === 'PENDING').length})</span>
        </button>
        <button className={`admin-tab-btn ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>
          <Terminal size={16} />
          <span>Audit Logs Feed</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="admin-tab-panel">
        
        {/* Moderation Panel */}
        {activeTab === 'moderation' && (
          <div className="moderation-queue-pane">
            {listings.length === 0 ? (
              <div className="empty-panel-box text-center">
                <Check size={40} style={{ color: 'var(--success)', marginBottom: '12px' }} />
                <h4>Moderation queue empty</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No properties are waiting to be audited.</p>
              </div>
            ) : (
              <div className="pending-listings-grid">
                {listings.map(l => (
                  <div key={l.id} className="pending-listing-card glass">
                    <img src={l.images[0]} alt={l.title} className="pending-card-img" />
                    <div className="pending-card-info">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <h4 className="title">{l.title}</h4>
                        <span className="price">${l.price}/mo</span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{l.city}, {l.state}</p>
                      
                      <div className="ai-rating-pill" style={{ marginBottom: '14px' }}>
                        <Sparkles size={12} />
                        <span>AI Screening Trust Score: <b>{l.trustScore}/100</b></span>
                      </div>

                      <div className="action-row">
                        <button className="btn btn-secondary reject-btn" onClick={() => handleModeration(l.id, 'REJECT')}>
                          <X size={14} />
                          <span>Reject</span>
                        </button>
                        <button className="btn btn-primary approve-btn" onClick={() => handleModeration(l.id, 'APPROVE')}>
                          <Check size={14} />
                          <span>Approve</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* KYC Panel */}
        {activeTab === 'kyc' && (
          <div className="kyc-requests-pane">
            {kycRequests.filter(k => k.status === 'PENDING').length === 0 ? (
              <div className="empty-panel-box text-center">
                <Check size={40} style={{ color: 'var(--success)', marginBottom: '12px' }} />
                <h4>No pending KYC submissions</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>All identity verifications completed.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {kycRequests.filter(k => k.status === 'PENDING').map(req => (
                  <div key={req.id} className="kyc-request-card glass">
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <img src={req.selfieUrl} alt={req.name} className="kyc-avatar" />
                      
                      <div style={{ flex: 1 }}>
                        <h4 style={{ color: '#fff', fontSize: '1rem' }}>{req.name}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Document: {req.documentType} ({req.docNumber})</p>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-secondary action-btn decline" style={{ padding: '8px 16px', fontSize: '0.8rem' }} onClick={() => handleKycAction(req.id, 'REJECTED')}>
                          <X size={14} />
                          <span>Decline</span>
                        </button>
                        <button className="btn btn-primary action-btn approve" style={{ padding: '8px 16px', fontSize: '0.8rem' }} onClick={() => handleKycAction(req.id, 'APPROVED')}>
                          <Check size={14} />
                          <span>Approve</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Terminal Logs Panel */}
        {activeTab === 'logs' && (
          <div className="terminal-logs-pane glass">
            <div className="terminal-header">
              <div style={{ display: 'flex', gap: '6px' }}>
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <span className="title">Central Microservices Audit Feed</span>
            </div>
            
            <div className="terminal-canvas">
              {logs.map((log) => (
                <div key={log.id} className={`terminal-line ${log.level === 'WARN' ? 'warn' : ''}`}>
                  <span className="time">[{log.timestamp}]</span>
                  <span className="level">[{log.level}]</span>
                  <span className={`service ${log.service}`}>[{log.service}]</span>
                  <span className="message">{log.message}</span>
                </div>
              ))}
              <div ref={logTerminalEndRef} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
