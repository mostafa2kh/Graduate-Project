import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle2, Clock, Receipt } from 'lucide-react';
import { Booking, getBookings } from '../data/mockUserData';
import { useAuth } from '../context/useAuth';

export const PaymentHistory: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!user) return;
    setBookings(getBookings().filter(booking => booking.renterId === user.id && ['APPROVED', 'PAID'].includes(booking.status)));
  }, [user]);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#fff' }}>Payment History</h2>
        <p style={{ color: 'var(--text-muted)' }}>Review paid bookings and complete approved payment requests.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="glass" style={{ padding: '60px 30px', textAlign: 'center' }}>
          <Receipt size={42} style={{ color: 'var(--text-dark)', marginBottom: '12px' }} />
          <h3 style={{ color: '#fff' }}>No payment records yet</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Approved bookings will appear here when they are ready for checkout.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {bookings.map(booking => (
            <div key={booking.id} className="glass" style={{ padding: '18px', display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '18px', alignItems: 'center' }}>
              <img src={booking.listingImage} alt={booking.listingTitle} style={{ width: '80px', height: '64px', objectFit: 'cover', borderRadius: '10px' }} />
              <div>
                <h3 style={{ color: '#fff', fontSize: '1rem' }}>{booking.listingTitle}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{booking.startDate} to {booking.endDate}</p>
                <p style={{ color: 'var(--secondary)', fontWeight: 800, marginTop: '4px' }}>${booking.totalPrice}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {booking.status === 'PAID' ? (
                  <span className="badge badge-success"><CheckCircle2 size={12} /> Paid</span>
                ) : (
                  <>
                    <span className="badge badge-warning"><Clock size={12} /> Awaiting Payment</span>
                    <button className="btn btn-primary" onClick={() => navigate(`/dashboard/payments/${booking.id}/checkout`)}>
                      <CreditCard size={16} /> Pay Now
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
