import React from 'react';
import { Home, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      background: 'rgba(10, 14, 26, 0.9)',
      borderTop: '1px solid var(--border-light)',
      padding: '40px 40px 20px',
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-body)',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px',
        marginBottom: '30px'
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1.25rem',
            fontFamily: 'var(--font-display)',
            marginBottom: '16px'
          }}>
            <Home size={20} style={{ color: 'var(--primary)' }} />
            <span style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>RentSphere</span>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
            A high-fidelity modern real-estate marketplace project built as a graduation project for the Department of Communications and Electronics Engineering, Menoufia University.
          </p>
        </div>

        <div>
          <h4 style={{ color: '#fff', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Department & University</h4>
          <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Menoufia University</p>
          <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Faculty of Engineering</p>
          <p style={{ fontSize: '0.9rem' }}>Electronics & Communications Engineering Dept.</p>
        </div>

        <div>
          <h4 style={{ color: '#fff', marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Contact Information</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} style={{ color: 'var(--primary)' }} />
              <span>Shebin El-Kom, Menoufia, Egypt</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} style={{ color: 'var(--primary)' }} />
              <span>support@rentsphere.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={16} style={{ color: 'var(--primary)' }} />
              <span>+20 48 222 1234</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        borderTop: '1px solid var(--border-light)',
        paddingTop: '20px',
        textAlign: 'center',
        fontSize: '0.8rem'
      }}>
        <p>&copy; {new Date().getFullYear()} RentSphere. Built for excellence.</p>
      </div>
    </footer>
  );
};
