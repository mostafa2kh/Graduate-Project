import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListings } from '../data/mockListings';
import { getBookings, saveBookings, Booking, ChatThread, isListingFavorited, toggleFavoriteListing } from '../data/mockUserData';
import { useAuth } from '../context/useAuth';
import { Shield, MapPin, Bed, Bath, Maximize, Calendar, ArrowLeft, Star, Heart, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';
import * as Cesium from 'cesium';
import './ListingDetail.css';

const DetailLocationMap: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);

  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return;

    const viewer = new Cesium.Viewer(containerRef.current, {
      infoBox: false,
      selectionIndicator: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
    });

    viewerRef.current = viewer;

    return () => {
      viewer.destroy();
      viewerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    viewer.entities.removeAll();
    viewer.scene.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(lng, lat, 2000),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-45),
        roll: 0,
      },
    });

    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(lng, lat, 0),
      point: {
        pixelSize: 18,
        color: Cesium.Color.ORANGE,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 3,
        heightReference: Cesium.HeightReference.NONE,
      },
      label: {
        text: '📍',
        font: '24px sans-serif',
        pixelOffset: new Cesium.Cartesian2(0, -30),
      },
    });
  }, [lat, lng]);

  return <div ref={containerRef} className="detail-location-globe" />;
};

export const ListingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const listing = useMemo(() => {
    return getListings().find(l => l.id === id);
  }, [id]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<'IDLE' | 'SUCCESS'>('IDLE');
  const [submittedBookingId, setSubmittedBookingId] = useState<string | null>(null);

  // Calculate pricing based on chosen dates
  const pricingInfo = useMemo(() => {
    if (!listing || !startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    if (timeDiff <= 0) return null;
    
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const dailyPrice = Math.round(listing.price / 30);
    const baseTotal = dailyPrice * days;
    const serviceFee = Math.round(baseTotal * 0.05);
    const cleaningFee = 150;
    const grandTotal = baseTotal + serviceFee + cleaningFee;

    return { days, dailyPrice, baseTotal, serviceFee, cleaningFee, grandTotal };
  }, [startDate, endDate, listing]);

  useEffect(() => {
    setIsLiked(Boolean(user && listing && isListingFavorited(user.id, listing.id)));
  }, [user, listing]);

  if (!listing) {
    return (
      <div className="detail-empty glass">
        <h2>Listing Not Found</h2>
        <p>The space you are trying to view does not exist or has been removed.</p>
        <button className="btn btn-primary" onClick={() => navigate('/search')}>Back to Search</button>
      </div>
    );
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!pricingInfo) return;

    // Create a new booking
    const newBooking: Booking = {
      id: `book-${Math.random().toString(36).substr(2, 9)}`,
      listingId: listing.id,
      listingTitle: listing.title,
      listingImage: listing.images[0],
      renterId: user.id,
      renterName: user.name,
      landlordId: listing.landlordId,
      startDate,
      endDate,
      totalPrice: pricingInfo.grandTotal,
      status: 'APPROVED'
    };

    const bookings = getBookings();
    bookings.push(newBooking);
    saveBookings(bookings);

    // Create a notification for the landlord (simulated)
    const storedNotifs = localStorage.getItem('rentsphere_notifications');
    const notifs = storedNotifs ? JSON.parse(storedNotifs) : [];
    notifs.push({
      id: `notif-${Math.random().toString(36).substr(2, 9)}`,
      userId: listing.landlordId,
      title: 'New Booking Request',
      message: `${user.name} requested a booking for ${listing.title}.`,
      date: new Date().toISOString(),
      read: false,
      type: 'booking'
    });
    localStorage.setItem('rentsphere_notifications', JSON.stringify(notifs));

    setSubmittedBookingId(newBooking.id);
    setBookingStatus('SUCCESS');
  };

  const handleStartChat = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Check if thread exists or create one
    const storedThreads = localStorage.getItem('rentsphere_chat_threads');
    const threads: ChatThread[] = storedThreads ? JSON.parse(storedThreads) : [];
    
    let thread = threads.find((t) => 
      t.participants.some((p) => p.id === user.id) &&
      t.participants.some((p) => p.id === listing.landlordId)
    );

    if (!thread) {
      const newThread: ChatThread = {
        id: `thread-${Math.random().toString(36).substr(2, 9)}`,
        participants: [
          { id: user.id, name: user.name, avatar: user.avatar, role: user.role },
          { id: listing.landlordId, name: listing.landlordName, avatar: listing.landlordAvatar, role: 'LANDLORD' }
        ],
        messages: [
          {
            id: `msg-${Date.now()}`,
            senderId: user.id,
            senderName: user.name,
            text: `Hi ${listing.landlordName}, I am interested in your property: "${listing.title}". Is it available?`,
            timestamp: new Date().toISOString()
          }
        ]
      };
      threads.push(newThread);
      localStorage.setItem('rentsphere_chat_threads', JSON.stringify(threads));
      thread = newThread;
    }

    navigate(`/dashboard/messages/${thread.id}`);
  };

  return (
    <div className="detail-page-container animate-fade-in">
      <button className="back-nav-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} />
        <span>Back to search</span>
      </button>

      <div className="detail-header-row">
        <div>
          <h1 className="detail-title">{listing.title}</h1>
          <div className="detail-subtitle">
            <MapPin size={16} style={{ color: 'var(--primary)' }} />
            <span>{listing.city}, {listing.state}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className={`btn-icon ${isLiked ? 'liked' : ''}`}
            onClick={() => {
              if (!user) {
                navigate('/login');
                return;
              }
              setIsLiked(toggleFavoriteListing(user.id, listing.id));
            }}
          >
            <Heart size={20} fill={isLiked ? 'var(--danger)' : 'none'} style={{ color: isLiked ? 'var(--danger)' : 'var(--text-muted)' }} />
          </button>
        </div>
      </div>

      {/* Main Image Slider Panel */}
      <div className="detail-gallery-row">
        <div className="main-image-panel glass">
          <img src={listing.images[activeImageIndex]} alt={listing.title} className="detail-main-img" />
          
          <div className="image-carousel-indicators">
            {listing.images.map((img, index) => (
              <img 
                key={index} 
                src={img} 
                alt="" 
                className={`indicator-thumb ${activeImageIndex === index ? 'active' : ''}`}
                onClick={() => setActiveImageIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* AI verification report card */}
        <div className="detail-report-panel glass">
          <div className="report-header">
            <Shield size={22} className="report-shield-icon" />
            <h3 style={{ color: '#fff' }}>RentSphere AI Trust Report</h3>
          </div>
          
          <div className="trust-gauge-wrapper">
            <div className="trust-score-circle" style={{ borderColor: listing.trustScore > 90 ? 'var(--success)' : 'var(--primary)' }}>
              <span className="score-num">{listing.trustScore}</span>
              <span className="score-lbl">Trust Index</span>
            </div>
            <div>
              <p style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>AI Safety Audit: Cleared</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Verified against duplication, bait-and-switch terms, and fake images.</p>
            </div>
          </div>

          <ul className="report-checklist">
            <li>
              <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
              <span>Host identity verified (KYC Approved)</span>
            </li>
            <li>
              <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
              <span>Smart Contract validation: Complete</span>
            </li>
            <li>
              <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
              <span>Price match analysis: Within fair market bounds</span>
            </li>
            <li>
              <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
              <span>EXIF geolocation metadata matches coordinates</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="detail-content-layout">
        {/* Left Side: Details & Reviews */}
        <div className="detail-main-info">
          {/* Properties Specs Grid */}
          <div className="detail-specs-row glass">
            <div className="spec-tile">
              <Bed size={22} />
              <div>
                <p className="spec-val">{listing.bedrooms}</p>
                <p className="spec-lbl">Bedrooms</p>
              </div>
            </div>
            <div className="spec-tile">
              <Bath size={22} />
              <div>
                <p className="spec-val">{listing.bathrooms}</p>
                <p className="spec-lbl">Bathrooms</p>
              </div>
            </div>
            <div className="spec-tile">
              <Maximize size={22} />
              <div>
                <p className="spec-val">{listing.area}</p>
                <p className="spec-lbl">Square Feet</p>
              </div>
            </div>
          </div>

          <div style={{ margin: '30px 0' }}>
            <h3 style={{ color: '#fff', marginBottom: '12px' }}>Description</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1rem' }}>{listing.description}</p>
          </div>

          <div style={{ margin: '30px 0' }}>
            <h3 style={{ color: '#fff', marginBottom: '16px' }}>What this space offers</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '14px' }}>
              {listing.amenities.map(a => (
                <div key={a} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--secondary)' }} />
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location Map */}
          <div style={{ margin: '30px 0' }}>
            <h3 style={{ color: '#fff', marginBottom: '16px' }}>Property Location</h3>
            <div className="detail-location-map">
              <DetailLocationMap lat={listing.lat} lng={listing.lng} />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} style={{ color: 'var(--primary)' }} />
              {listing.lat.toFixed(4)}, {listing.lng.toFixed(4)} — {listing.city}, {listing.state}
            </p>
          </div>

          {/* Landlord Card */}
          <div className="landlord-card-box glass">
            <img src={listing.landlordAvatar} alt={listing.landlordName} className="landlord-photo" />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Hosted by</p>
              <h4 style={{ color: '#fff', fontSize: '1.1rem', margin: '2px 0 6px' }}>{listing.landlordName}</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <span className="badge badge-success">Verfied Host</span>
                <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Star size={14} fill="var(--warning)" /> {listing.landlordRating} Rating
                </span>
              </div>
            </div>
            <button className="btn btn-secondary" onClick={handleStartChat}>
              <MessageSquare size={16} />
              <span>Ask Host</span>
            </button>
          </div>

          {/* Reviews Grid */}
          <div style={{ margin: '40px 0' }}>
            <h3 style={{ color: '#fff', marginBottom: '20px' }}>Guest Reviews ({listing.reviews.length})</h3>
            {listing.reviews.length === 0 ? (
              <p style={{ color: 'var(--text-dark)' }}>No reviews yet for this listing.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {listing.reviews.map(r => (
                  <div key={r.id} className="review-box glass">
                    <div className="review-header">
                      <img src={r.reviewerAvatar} alt={r.reviewerName} className="reviewer-avatar" />
                      <div style={{ flex: 1 }}>
                        <h5 style={{ color: '#fff', fontSize: '0.95rem' }}>{r.reviewerName}</h5>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.date}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--warning)' }}>
                        <Star size={14} fill="var(--warning)" />
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{r.rating}</span>
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginTop: '10px' }}>{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Booking Form */}
        <div className="detail-sidebar-booking">
          {bookingStatus === 'SUCCESS' ? (
            <div className="booking-success-box glass animate-fade-in">
              <CheckCircle2 size={48} style={{ color: 'var(--success)', marginBottom: '16px' }} />
              <h3>Booking Request Sent!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '10px 0 20px' }}>
                Your booking is ready for secure mock checkout. You can pay now or review it from your renter panel.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => submittedBookingId && navigate(`/dashboard/payments/${submittedBookingId}/checkout`)}
                >
                  Pay Now
                </button>
                <button className="btn btn-secondary" style={{ width: '100%' }} onClick={() => navigate('/dashboard/bookings')}>
                  Go to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <div className="booking-card glass">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
                <span className="booking-card-price">${listing.price}<span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/mo</span></span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={14} fill="var(--warning)" style={{ color: 'var(--warning)' }} />
                  <span style={{ color: '#fff', fontWeight: 600 }}>{listing.landlordRating}</span>
                </span>
              </div>

              <form onSubmit={handleBookingSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Check-In</label>
                    <div style={{ position: 'relative' }}>
                      <Calendar size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dark)' }} />
                      <input 
                        type="date" 
                        required
                        className="form-input" 
                        style={{ paddingLeft: '34px', fontSize: '0.8rem' }}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Check-Out</label>
                    <div style={{ position: 'relative' }}>
                      <Calendar size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dark)' }} />
                      <input 
                        type="date" 
                        required
                        className="form-input" 
                        style={{ paddingLeft: '34px', fontSize: '0.8rem' }}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>

                {pricingInfo && (
                  <div className="price-details-panel">
                    <div className="price-row">
                      <span>${pricingInfo.dailyPrice} × {pricingInfo.days} days</span>
                      <span>${pricingInfo.baseTotal}</span>
                    </div>
                    <div className="price-row">
                      <span>Cleaning Fee</span>
                      <span>${pricingInfo.cleaningFee}</span>
                    </div>
                    <div className="price-row">
                      <span>RentSphere Service Fee (5%)</span>
                      <span>${pricingInfo.serviceFee}</span>
                    </div>
                    <div style={{ borderTop: '1px solid var(--border-light)', margin: '10px 0' }}></div>
                    <div className="price-row total" style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem' }}>
                      <span>Grand Total</span>
                      <span style={{ color: 'var(--secondary)' }}>${pricingInfo.grandTotal}</span>
                    </div>
                  </div>
                )}

                {user ? (
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={!pricingInfo}>
                    Request Reservation
                  </button>
                ) : (
                  <button type="button" className="btn btn-secondary" style={{ width: '100%', padding: '12px' }} onClick={() => navigate('/login')}>
                    Sign In to Request Booking
                  </button>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
