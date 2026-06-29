import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check, CreditCard, ShieldCheck } from 'lucide-react';
import { getBookings, saveBookings } from '../data/mockUserData';
import { useAuth } from '../context/useAuth';

export const PaymentCheckout: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paid, setPaid] = useState(false);

  const booking = useMemo(() => {
    return getBookings().find(item => item.id === bookingId && item.renterId === user?.id);
  }, [bookingId, user?.id]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!booking) return;

    const updated = getBookings().map(item => item.id === booking.id ? { ...item, status: 'PAID' as const } : item);
    saveBookings(updated);
    setPaid(true);
  };

  if (!booking) {
    return (
      <div className="glass animate-fade-in" style={{ padding: '50px', textAlign: 'center' }}>
        <h2 style={{ color: '#fff' }}>Booking Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '8px 0 20px' }}>This checkout request does not exist for your account.</p>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard/payments')}>Back to Payments</button>
      </div>
    );
  }

  if (booking.status === 'PAID' || paid) {
    return (
      <div className="glass animate-fade-in" style={{ maxWidth: '620px', margin: '0 auto', padding: '50px', textAlign: 'center' }}>
        <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'var(--success)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
          <Check size={34} />
        </div>
        <h2 style={{ color: '#fff' }}>Payment Complete</h2>
        <p style={{ color: 'var(--text-muted)', margin: '8px 0 24px' }}>Your mock payment for {booking.listingTitle} was recorded successfully.</p>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard/payments')}>View Payment History</button>
      </div>
    );
  }

  return (
    <div className="glass animate-fade-in" style={{ maxWidth: '720px', margin: '0 auto', padding: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'start', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.6rem' }}>Secure Checkout</h2>
          <p style={{ color: 'var(--text-muted)' }}>{booking.listingTitle}</p>
        </div>
        <span className="badge badge-info"><ShieldCheck size={12} /> Mock Gateway</span>
      </div>

      <div className="glass" style={{ padding: '18px', marginBottom: '22px', boxShadow: 'none' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700 }}>TOTAL DUE</p>
        <p style={{ color: 'var(--secondary)', fontSize: '1.8rem', fontWeight: 900 }}>${booking.totalPrice}</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{booking.startDate} to {booking.endDate}</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Cardholder Name</label>
          <input type="text" required className="form-input" placeholder={user?.name || 'Cardholder'} />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Card Number</label>
          <input
            type="text"
            required
            maxLength={19}
            className="form-input"
            placeholder="4000 1234 5678 9010"
            value={cardNumber}
            onChange={(event) => {
              const rawValue = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/g, '');
              setCardNumber(rawValue.match(/.{1,4}/g)?.join(' ') || rawValue);
            }}
          />
        </div>
        <div className="grid-cols-2">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Expiry Date</label>
            <input
              type="text"
              required
              maxLength={5}
              className="form-input"
              placeholder="MM/YY"
              value={cardExpiry}
              onChange={(event) => {
                const rawValue = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/g, '');
                setCardExpiry(rawValue.length > 2 ? `${rawValue.substring(0, 2)}/${rawValue.substring(2, 4)}` : rawValue);
              }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">CVV</label>
            <input type="password" required maxLength={3} className="form-input" placeholder="123" value={cardCvv} onChange={(event) => setCardCvv(event.target.value.replace(/[^0-9]/g, ''))} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '13px' }}>
          <CreditCard size={16} /> Verify & Pay ${booking.totalPrice}
        </button>
      </form>
    </div>
  );
};
