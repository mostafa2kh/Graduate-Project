import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { getListings, saveListings, Listing } from '../data/mockListings';
import { getBookings, saveBookings, Booking } from '../data/mockUserData';
import { Building, DollarSign, CalendarRange, Clock, Check, X, Sparkles, ChevronRight, ChevronLeft, MapPin, Eye, Trash2 } from 'lucide-react';
import './LandlordDashboard.css';

const PRESET_PHOTOS = [
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80', // Modern villa
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', // Beach mansion
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80', // Cosy apartment
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'  // Luxury kitchen/interior
];

export const LandlordDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<Booking[]>([]);
  
  // Wizard States
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardTitle, setWizardTitle] = useState('');
  const [wizardDesc, setWizardDesc] = useState('');
  const [wizardType, setWizardType] = useState<'apartment' | 'house' | 'villa' | 'studio'>('apartment');
  const [wizardCity, setWizardCity] = useState('');
  const [wizardState, setWizardState] = useState('');
  const [wizardLat, setWizardLat] = useState(34.0522);
  const [wizardLng, setWizardLng] = useState(-118.2437);
  const [wizardPrice, setWizardPrice] = useState(1500);
  const [wizardBedrooms, setWizardBedrooms] = useState(2);
  const [wizardBathrooms, setWizardBathrooms] = useState(2);
  const [wizardArea, setWizardArea] = useState(1200);
  const [wizardPhotos, setWizardPhotos] = useState<string[]>([PRESET_PHOTOS[0]]);
  const [wizardAmenities, setWizardAmenities] = useState<string[]>([]);
  const [aiAuditing, setAiAuditing] = useState(false);
  const [aiAuditResults, setAiAuditResults] = useState<{ score: number; status: string } | null>(null);

  const amenitiesOptions = ['Pool', 'Gym', 'Wifi', 'Air Conditioning', 'Parking', 'Smart Home', 'Furnished', 'Balcony', 'Garden', 'Pet Friendly'];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = () => {
    // Get listings owned by this landlord
    const allListings = getListings();
    setMyListings(allListings.filter(l => l.landlordId === 'landlord-1')); // hardcoded for demo landlord matching AuthContext

    // Get bookings requested for properties owned by this landlord
    const allBookings = getBookings();
    setIncomingRequests(allBookings.filter(b => b.landlordId === 'landlord-1'));
  };

  const handleRequestAction = (bookingId: string, action: 'APPROVE' | 'REJECT') => {
    const all = getBookings();
    const updated = all.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: action === 'APPROVE' ? 'APPROVED' as const : 'REJECTED' as const };
      }
      return b;
    });
    saveBookings(updated);

    // Notify the renter
    const current = all.find(b => b.id === bookingId);
    if (current) {
      const storedNotifs = localStorage.getItem('rentsphere_notifications');
      const notifs = storedNotifs ? JSON.parse(storedNotifs) : [];
      notifs.push({
        id: `notif-${Math.random().toString(36).substr(2, 9)}`,
        userId: current.renterId,
        title: action === 'APPROVE' ? 'Booking Request Approved' : 'Booking Request Declined',
        message: `Landlord ${user?.name} has ${action.toLowerCase()}d your booking request for ${current.listingTitle}.`,
        date: new Date().toISOString(),
        read: false,
        type: 'booking'
      });
      localStorage.setItem('rentsphere_notifications', JSON.stringify(notifs));
    }

    loadDashboardData();
  };

  const toggleWizardAmenity = (amenity: string) => {
    if (wizardAmenities.includes(amenity)) {
      setWizardAmenities(wizardAmenities.filter(a => a !== amenity));
    } else {
      setWizardAmenities([...wizardAmenities, amenity]);
    }
  };

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setWizardPhotos(prev => [...prev, dataUrl]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  }, []);

  const removePhoto = useCallback((index: number) => {
    setWizardPhotos(prev => prev.filter((_, i) => i !== index));
  }, []);

  const startAiAuditAndSubmit = () => {
    setAiAuditing(true);
    // Simulate AI Microservice Analysis (ai-review-service + media-service EXIF coordinates validation)
    setTimeout(() => {
      const randomScore = Math.floor(Math.random() * 20) + 80; // generate 80-99 trust index
      setAiAuditResults({
        score: randomScore,
        status: 'SUCCESS'
      });
      setAiAuditing(false);
    }, 2500);
  };

  const finalizeWizardSubmit = () => {
    if (!aiAuditResults) return;

    const photosToUse = wizardPhotos.length > 0 ? wizardPhotos : [PRESET_PHOTOS[0]];

    const newListing: Listing = {
      id: `list-${Math.random().toString(36).substr(2, 9)}`,
      title: wizardTitle,
      description: wizardDesc,
      price: wizardPrice,
      type: wizardType,
      city: wizardCity,
      state: wizardState,
      lat: wizardLat,
      lng: wizardLng,
      bedrooms: wizardBedrooms,
      bathrooms: wizardBathrooms,
      area: wizardArea,
      images: photosToUse,
      amenities: wizardAmenities,
      landlordId: 'landlord-1',
      landlordName: user?.name || 'Sarah Landlord',
      landlordAvatar: user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      landlordRating: 4.9,
      status: 'PENDING', // awaits admin moderation
      trustScore: aiAuditResults.score,
      isFeatured: false,
      reviews: []
    };

    const all = getListings();
    all.push(newListing);
    saveListings(all);

    // Simulated event payload downstream
    const auditLogs = localStorage.getItem('rentsphere_audit_logs');
    const logs = auditLogs ? JSON.parse(auditLogs) : [];
    logs.push({
      id: `log-${Date.now()}`,
      service: 'listing-service',
      message: `Listing created: ${newListing.title} (ID: ${newListing.id})`,
      timestamp: new Date().toISOString()
    });
    logs.push({
      id: `log-${Date.now() + 1}`,
      service: 'ai-review-service',
      message: `AI Review complete for ${newListing.id}. Score: ${newListing.trustScore}/100. No safety violations.`,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('rentsphere_audit_logs', JSON.stringify(logs));

    // Reset wizard
    setWizardOpen(false);
    setWizardStep(1);
    setWizardTitle('');
    setWizardDesc('');
    setWizardCity('');
    setWizardState('');
    setWizardLat(34.0522);
    setWizardLng(-118.2437);
    setWizardPhotos([PRESET_PHOTOS[0]]);
    setWizardAmenities([]);
    setAiAuditResults(null);

    loadDashboardData();
  };

  const totalEarnings = incomingRequests
    .filter(r => r.status === 'PAID')
    .reduce((sum, r) => sum + r.totalPrice, 0);

  return (
    <div className="landlord-dashboard animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: '#fff' }}>Landlord Console</h2>
          <p style={{ color: 'var(--text-muted)' }}>Oversee bookings, track earnings, and launch new rental properties.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setWizardOpen(true)}>
          <Building size={16} />
          <span>Add New Property</span>
        </button>
      </div>

      {/* Analytics widgets */}
      <div className="landlord-stats-grid">
        <div className="landlord-stat-card glass">
          <div className="stat-icon-wrapper blue">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="lbl">Total Earnings</p>
            <h3 className="val">${totalEarnings.toLocaleString()}</h3>
          </div>
        </div>
        <div className="landlord-stat-card glass">
          <div className="stat-icon-wrapper green">
            <Building size={24} />
          </div>
          <div>
            <p className="lbl">My Properties</p>
            <h3 className="val">{myListings.length} Spaces</h3>
          </div>
        </div>
        <div className="landlord-stat-card glass">
          <div className="stat-icon-wrapper orange">
            <CalendarRange size={24} />
          </div>
          <div>
            <p className="lbl">Total Bookings</p>
            <h3 className="val">{incomingRequests.length} Requests</h3>
          </div>
        </div>
      </div>

      <div className="landlord-content-layout">
        {/* Incoming Rent Requests */}
        <div className="landlord-requests-pane glass">
          <h3 className="pane-title">Incoming Rental Requests</h3>
          {incomingRequests.length === 0 ? (
            <p style={{ color: 'var(--text-dark)', padding: '20px 0' }}>No tenant requests found yet.</p>
          ) : (
            <div className="requests-list">
              {incomingRequests.map(req => (
                <div key={req.id} className="request-card glass">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>{req.listingTitle}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tenant: {req.renterName}</p>
                    </div>
                    <span style={{ fontWeight: 800, color: 'var(--secondary)' }}>${req.totalPrice}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>Dates: {req.startDate} to {req.endDate}</span>
                    <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>Status: {req.status}</span>
                  </div>

                  {req.status === 'PENDING' && (
                    <div className="request-action-row">
                      <button className="btn btn-secondary action-btn decline" onClick={() => handleRequestAction(req.id, 'REJECT')}>
                        <X size={14} />
                        <span>Decline</span>
                      </button>
                      <button className="btn btn-primary action-btn approve" onClick={() => handleRequestAction(req.id, 'APPROVE')}>
                        <Check size={14} />
                        <span>Approve</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Listed Properties */}
        <div className="landlord-listings-pane glass">
          <h3 className="pane-title">My Properties</h3>
          <div className="my-properties-list">
            {myListings.map(listing => (
              <div key={listing.id} className="my-prop-card glass">
                <img src={listing.images[0]} alt={listing.title} className="my-prop-img" />
                <div className="my-prop-info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h4 className="my-prop-title">{listing.title}</h4>
                    <span className="my-prop-price">${listing.price}/mo</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{listing.city}, {listing.state}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span className="badge badge-info">AI {listing.trustScore}</span>
                      {listing.status === 'PENDING' ? (
                        <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Clock size={10} /> Pending Audit</span>
                      ) : listing.status === 'APPROVED' ? (
                        <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Check size={10} /> Live</span>
                      ) : (
                        <span className="badge badge-danger">Rejected</span>
                      )}
                    </div>
                    <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => navigate(`/search/${listing.id}`)}>
                      <Eye size={12} />
                      <span>Inspect</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6-STEP MULTI-STEP CREATION WIZARD MODAL */}
      {wizardOpen && (
        <div className="wizard-overlay">
          <div className="wizard-modal glass animate-fade-in">
            {/* Wizard Header */}
            <div className="wizard-header">
              <div>
                <h3 style={{ color: '#fff' }}>List a New Property</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Step {wizardStep} of 6 — Configuring listing parameters</p>
              </div>
              <button className="wizard-close-btn" onClick={() => setWizardOpen(false)}>×</button>
            </div>

            {/* Step Progress Line */}
            <div className="wizard-progress-bar">
              {[1, 2, 3, 4, 5, 6].map(s => (
                <div 
                  key={s} 
                  className={`progress-step-node ${wizardStep >= s ? 'active' : ''}`}
                >
                  {s}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="wizard-content">
              {/* Step 1: General Info */}
              {wizardStep === 1 && (
                <div className="animate-fade-in">
                  <h4 className="wizard-step-title">Basic Property Details</h4>
                  <div className="form-group">
                    <label className="form-label">Property Title</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Modern Glass Loft with City Views" 
                      value={wizardTitle}
                      onChange={(e) => setWizardTitle(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Detailed Description</label>
                    <textarea 
                      rows={4}
                      className="form-input" 
                      placeholder="Provide background information, accessibility features, and special qualities..." 
                      style={{ resize: 'none' }}
                      value={wizardDesc}
                      onChange={(e) => setWizardDesc(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select 
                      className="form-input" 
                      value={wizardType}
                      onChange={(e) => setWizardType(e.target.value as Listing['type'])}
                    >
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="villa">Villa</option>
                      <option value="studio">Studio</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Auto Location */}
              {wizardStep === 2 && (
                <div className="animate-fade-in">
                  <h4 className="wizard-step-title">Enable Location Access</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px', lineHeight: '1.6' }}>
                    The site will use your browser's location to automatically detect where this property is.
                    Grant location permission when prompted, then click the button below.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ padding: '14px', fontSize: '1rem', gap: '10px' }}
                      onClick={async () => {
                        if (!navigator.geolocation) {
                          alert('Geolocation is not supported by your browser.');
                          return;
                        }
                        navigator.geolocation.getCurrentPosition(
                          async (pos) => {
                            const { latitude, longitude } = pos.coords;
                            setWizardLat(latitude);
                            setWizardLng(longitude);

                            // Call backend reverse-geocode service
                            try {
                              const res = await fetch('/api/listings/location/reverse-geocode', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ latitude, longitude }),
                              });
                              const json = await res.json();
                              if (json.success && json.data) {
                                if (json.data.city) setWizardCity(json.data.city);
                                if (json.data.state) setWizardState(json.data.state);
                              }
                            } catch {
                              // Backend unavailable — just use coordinates
                            }

                            // Request notification permission and send a notification
                            if ('Notification' in window && Notification.permission !== 'denied') {
                              Notification.requestPermission().then(perm => {
                                if (perm === 'granted') {
                                  new Notification('📍 Location Detected', {
                                    body: `Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
                                  });
                                }
                              });
                            }
                          },
                          (err) => {
                            alert(`Location access denied or unavailable: ${err.message}`);
                          },
                          { enableHighAccuracy: true }
                        );
                      }}
                    >
                      <MapPin size={20} />
                      <span>Detect My Current Location</span>
                    </button>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Los Angeles"
                          value={wizardCity}
                          onChange={(e) => setWizardCity(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">State / Region</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. California"
                          value={wizardState}
                          onChange={(e) => setWizardState(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="coord-display-box">
                      <div className="coord-row">
                        <span className="coord-lbl">Latitude</span>
                        <span className="coord-val">{wizardLat.toFixed(6)}</span>
                      </div>
                      <div className="coord-row">
                        <span className="coord-lbl">Longitude</span>
                        <span className="coord-val">{wizardLng.toFixed(6)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Pricing */}
              {wizardStep === 3 && (
                <div className="animate-fade-in">
                  <h4 className="wizard-step-title">Monthly Rental Pricing</h4>
                  <div className="form-group">
                    <label className="form-label">Rent Price per Month (USD)</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: 'bold', color: 'var(--text-dark)' }}>$</span>
                      <input 
                        type="number" 
                        className="form-input" 
                        style={{ paddingLeft: '32px' }}
                        value={wizardPrice}
                        onChange={(e) => setWizardPrice(parseInt(e.target.value))}
                        min={100}
                      />
                      <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ month</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Recommended price range for {wizardType}s in {wizardCity || 'this area'}: <b>$1,200 - $2,800</b>
                  </p>
                </div>
              )}

              {/* Step 4: Physical Specs */}
              {wizardStep === 4 && (
                <div className="animate-fade-in">
                  <h4 className="wizard-step-title">Property Specifications</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#fff', fontSize: '0.95rem' }}>Bedrooms</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[1, 2, 3, 4, 5].map(b => (
                          <button 
                            key={b} 
                            className={`spec-sel-btn ${wizardBedrooms === b ? 'active' : ''}`}
                            onClick={() => setWizardBedrooms(b)}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#fff', fontSize: '0.95rem' }}>Bathrooms</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[1, 1.5, 2, 2.5, 3, 4].map(b => (
                          <button 
                            key={b} 
                            className={`spec-sel-btn ${wizardBathrooms === b ? 'active' : ''}`}
                            onClick={() => setWizardBathrooms(b)}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="form-group" style={{ marginTop: '10px' }}>
                      <label className="form-label">Total Living Area (sqft)</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        value={wizardArea}
                        onChange={(e) => setWizardArea(parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Photos Upload */}
              {wizardStep === 5 && (
                <div className="animate-fade-in">
                  <h4 className="wizard-step-title">Upload Listing Photos</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
                    Upload real photos of your property. They will appear on the listing and on the 3D globe popup.
                  </p>

                  <div className="photo-upload-area">
                    <label className="photo-upload-trigger">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        style={{ display: 'none' }}
                      />
                      <div className="photo-upload-placeholder">
                        <span style={{ fontSize: '2rem', lineHeight: 1 }}>+</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Add Photos</span>
                      </div>
                    </label>

                    {wizardPhotos.map((ph, idx) => (
                      <div key={idx} className="photo-preview-tile">
                        <img src={ph} alt="" className="photo-preview-img" />
                        <button
                          type="button"
                          className="photo-remove-btn"
                          onClick={() => removePhoto(idx)}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <p style={{ color: 'var(--text-dark)', fontSize: '0.75rem', marginTop: '12px' }}>
                    {wizardPhotos.length} photo{wizardPhotos.length !== 1 ? 's' : ''} selected
                  </p>

                  <details style={{ marginTop: '16px', cursor: 'pointer' }}>
                    <summary style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Or use preset demo photos
                    </summary>
                    <div className="presets-images-grid" style={{ marginTop: '12px' }}>
                      {PRESET_PHOTOS.map((ph, idx) => (
                        <div
                          key={idx}
                          className={`preset-photo-tile ${wizardPhotos.includes(ph) ? 'active' : ''}`}
                          onClick={() => {
                            if (wizardPhotos.includes(ph)) {
                              setWizardPhotos(wizardPhotos.filter(p => p !== ph));
                            } else {
                              setWizardPhotos([...wizardPhotos, ph]);
                            }
                          }}
                        >
                          <img src={ph} alt="" className="preset-photo-img" />
                          {wizardPhotos.includes(ph) && <div className="preset-check-badge"><Check size={12} /></div>}
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              )}

              {/* Step 6: Amenities + AI review */}
              {wizardStep === 6 && (
                <div className="animate-fade-in">
                  <h4 className="wizard-step-title">Amenities & AI Trust Validation</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
                    {amenitiesOptions.map(a => (
                      <label key={a} className={`wizard-amenity-tile ${wizardAmenities.includes(a) ? 'active' : ''}`}>
                        <input 
                          type="checkbox" 
                          style={{ display: 'none' }}
                          checked={wizardAmenities.includes(a)}
                          onChange={() => toggleWizardAmenity(a)}
                        />
                        <span>{a}</span>
                      </label>
                    ))}
                  </div>

                  <div className="ai-audit-console glass">
                    {aiAuditing ? (
                      <div className="ai-loading-box">
                        <div className="ai-spinner"></div>
                        <div style={{ textAlign: 'left' }}>
                          <p style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.85rem' }}>ai-review-service auditing assets...</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Exemplifying image signatures & verifying host credentials</p>
                        </div>
                      </div>
                    ) : aiAuditResults ? (
                      <div className="ai-results-box">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="ai-score-node">{aiAuditResults.score}</div>
                          <div>
                            <p style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.9rem' }}>Safety Audit Completed</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Trust Score: {aiAuditResults.score}/100. Audit cleared.</p>
                          </div>
                        </div>
                        <button className="btn btn-teal" style={{ padding: '8px 16px', fontSize: '0.8rem' }} onClick={finalizeWizardSubmit}>
                          Publish Listing
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <Sparkles size={20} style={{ color: 'var(--primary)' }} />
                          <div style={{ textAlign: 'left' }}>
                            <p style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.85rem' }}>AI Safety Audit Required</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Run automated audit checks on listing integrity.</p>
                          </div>
                        </div>
                        <button type="button" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }} onClick={startAiAuditAndSubmit}>
                          Run Audit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Wizard Actions Footer */}
            <div className="wizard-footer">
              {wizardStep > 1 ? (
                <button 
                  className="btn btn-secondary" 
                  disabled={aiAuditing}
                  onClick={() => setWizardStep(wizardStep - 1)}
                >
                  <ChevronLeft size={16} />
                  <span>Back</span>
                </button>
              ) : (
                <div></div> // empty spacer
              )}

              {wizardStep < 6 ? (
                <button 
                  className="btn btn-primary" 
                  onClick={() => setWizardStep(wizardStep + 1)}
                  disabled={
                    (wizardStep === 1 && (!wizardTitle || !wizardDesc)) ||
                    (wizardStep === 2 && (!wizardCity || !wizardState))
                  }
                >
                  <span>Continue</span>
                  <ChevronRight size={16} />
                </button>
              ) : (
                <div /> // button shown inside AI audit panel
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
