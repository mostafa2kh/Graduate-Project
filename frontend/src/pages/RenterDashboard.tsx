import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { getBookings, Booking } from '../data/mockUserData';
import { Calendar, CreditCard, ShieldCheck, CheckCircle2, Clock, XCircle } from 'lucide-react';
import './RenterDashboard.css';

export const RenterDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const all = getBookings();
    setBookings(all.filter(b => b.renterId === user.id));
  }, [user, navigate]);

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'PAID':
        return <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={12} /> Paid</span>;
      case 'APPROVED':
        return <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={12} /> Approved</span>;
      case 'PENDING':
        return <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> Pending Host</span>;
      case 'REJECTED':
        return <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><XCircle size={12} /> Declined</span>;
      default:
        return null;
    }
  };

  return (
    <div className="renter-dashboard animate-fade-in">
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#fff' }}>My Bookings Dashboard</h2>
        <p style={{ color: 'var(--text-muted)' }}>Manage your reservation requests, check contracts, and finalize rent payments.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-bookings glass">
          <Calendar size={40} style={{ color: 'var(--text-dark)', marginBottom: '12px' }} />
          <h3>No bookings found</h3>
          <p>You haven't requested any property reservations yet.</p>
          <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/search')}>
            Browse Available Homes
          </button>
        </div>
      ) : (
        <div className="bookings-table-wrapper glass">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Dates</th>
                <th>Cost</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img src={b.listingImage} alt={b.listingTitle} className="booking-row-img" />
                      <div>
                        <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{b.listingTitle}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {b.id}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>
                      <p style={{ color: '#fff', fontWeight: 600 }}>{b.startDate}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>to {b.endDate}</p>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '1rem' }}>${b.totalPrice}</span>
                  </td>
                  <td>{getStatusBadge(b.status)}</td>
                  <td>
                    {b.status === 'APPROVED' ? (
                      <button 
                        className="btn btn-teal" 
                        style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                        onClick={() => navigate(`/dashboard/payments/${b.id}/checkout`)}
                      >
                        <CreditCard size={14} />
                        <span>Pay Rent</span>
                      </button>
                    ) : (
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                        onClick={() => navigate(`/search/${b.listingId}`)}
                      >
                        View Space
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
