import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="glass animate-fade-in" style={{ padding: '70px 30px', textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
      <h1 style={{ color: '#fff', fontSize: '2.4rem' }}>Page Not Found</h1>
      <p style={{ color: 'var(--text-muted)', margin: '12px 0 24px' }}>The page you requested does not exist or is not available for your role.</p>
      <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
};
