import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/useAuth';
import { getNotifications, saveNotifications, Notification } from '../data/mockUserData';
import { Bell, Calendar, Shield, MessageSquare, Trash2, CheckCheck } from 'lucide-react';
import './Notifications.css';

export const Notifications: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadNotifications = useCallback(() => {
    const all = getNotifications();
    // filter notifications for active user
    setNotifications(all.filter(n => n.userId === user?.id));
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;
    loadNotifications();
  }, [user, loadNotifications]);

  const handleMarkAllRead = () => {
    const all = getNotifications();
    const updated = all.map(n => n.userId === user?.id ? { ...n, read: true } : n);
    saveNotifications(updated);
    loadNotifications();
  };

  const handleClearAll = () => {
    const all = getNotifications();
    const updated = all.filter(n => n.userId !== user?.id);
    saveNotifications(updated);
    loadNotifications();
  };

  const getNotifIcon = (type: Notification['type']) => {
    switch (type) {
      case 'booking':
        return <Calendar size={16} style={{ color: 'var(--secondary)' }} />;
      case 'moderation':
        return <Shield size={16} style={{ color: 'var(--primary)' }} />;
      case 'chat':
        return <MessageSquare size={16} style={{ color: 'var(--info)' }} />;
      default:
        return <Bell size={16} style={{ color: 'var(--text-muted)' }} />;
    }
  };

  const formatTime = (isoStr: string) => {
    const date = new Date(isoStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="notifications-page animate-fade-in" style={{ paddingTop: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: '#fff' }}>Alert Notification Hub</h2>
          <p style={{ color: 'var(--text-muted)' }}>Keep track of booking agreements, moderation statuses, and network events.</p>
        </div>
        
        {notifications.length > 0 && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={handleMarkAllRead}>
              <CheckCheck size={14} />
              <span>Mark all read</span>
            </button>
            <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.1)' }} onClick={handleClearAll}>
              <Trash2 size={14} />
              <span>Clear all</span>
            </button>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="empty-notifications glass" style={{ padding: '60px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Bell size={40} style={{ color: 'var(--text-dark)', marginBottom: '12px' }} />
          <h3>No notifications found</h3>
          <p style={{ color: 'var(--text-muted)' }}>We will alert you when critical platform events trigger.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.map(n => (
            <div key={n.id} className={`notification-item glass ${n.read ? 'read' : 'unread'}`}>
              <div className="notif-icon-circle">
                {getNotifIcon(n.type)}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700 }}>{n.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '3px' }}>{n.message}</p>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dark)', marginTop: '6px', display: 'block' }}>{formatTime(n.date)}</span>
              </div>
              {!n.read && <div className="unread-dot"></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
