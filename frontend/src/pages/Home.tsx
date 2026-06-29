import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initialListings } from '../data/mockListings';
import { Compass, Search, Award, Sparkles, Building2, MapPin, Bed, Bath, Maximize } from 'lucide-react';
import './Home.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchCity, setSearchCity] = useState('');
  const [searchType, setSearchType] = useState('all');

  const featured = initialListings.filter(l => l.isFeatured);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?city=${encodeURIComponent(searchCity)}&type=${searchType}`);
  };

  const handleCategoryClick = (type: string) => {
    navigate(`/search?type=${type}`);
  };

  return (
    <div className="home-container animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-glow"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>Graduate Project 2026</span>
          </div>
          <h1 className="hero-title">
            The Smart Way to Rent <br />
            <span className="gradient-text">Premium Real Estate</span>
          </h1>
          <p className="hero-subtitle">
            Experience a secure, decentralized-style rental platform with AI trust ratings, instant booking approval, and integrated identity verification (KYC).
          </p>

          <form className="hero-search-box glass" onSubmit={handleSearchSubmit}>
            <div className="search-field">
              <MapPin size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Where do you want to live? (e.g. Los Angeles, New York)"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="search-divider"></div>
            <div className="search-field">
              <Building2 size={18} className="search-icon" />
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="search-select"
              >
                <option value="all">Any Property Type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="studio">Studio</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary search-btn">
              <Search size={18} />
              <span>Search</span>
            </button>
          </form>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid grid-cols-4">
          <div className="stat-card glass">
            <div className="stat-num gradient-text">98%</div>
            <div className="stat-label">AI Trust Rate Accuracy</div>
          </div>
          <div className="stat-card glass">
            <div className="stat-num gradient-text">14</div>
            <div className="stat-label">Microservices Running</div>
          </div>
          <div className="stat-card glass">
            <div className="stat-num gradient-text">&lt; 3m</div>
            <div className="stat-label">KYC Document Approval</div>
          </div>
          <div className="stat-card glass">
            <div className="stat-num gradient-text">100%</div>
            <div className="stat-label">Verified Listings</div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-wrapper">
        <h2 className="section-title">Explore by Property Category</h2>
        <p className="section-subtitle">Jump straight to custom-filtered high-end spaces.</p>
        
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '20px' }}>
          {['all', 'apartment', 'house', 'villa', 'studio'].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="btn btn-secondary"
              style={{ textTransform: 'capitalize', padding: '12px 28px' }}
            >
              {cat === 'all' ? 'All Spaces' : `${cat}s`}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="section-wrapper">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <div>
            <h2 className="section-title">Featured Luxury Homes</h2>
            <p className="section-subtitle">Exquisite rentals highly rated by our automated AI verification agents.</p>
          </div>
          <button onClick={() => navigate('/search')} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>View All Listings</span>
            <Compass size={16} />
          </button>
        </div>

        <div className="listings-grid grid-cols-3">
          {featured.map((listing) => (
            <div 
              key={listing.id} 
              className="listing-card glass glass-hover"
              onClick={() => navigate(`/search/${listing.id}`)}
            >
              <div className="listing-image-wrapper">
                <img src={listing.images[0]} alt={listing.title} className="listing-card-img" />
                <div className="listing-type-badge">{listing.type}</div>
                <div className="listing-score-badge">
                  <Award size={14} />
                  <span>AI Score {listing.trustScore}</span>
                </div>
              </div>
              <div className="listing-card-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="listing-card-price">${listing.price}<span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/mo</span></span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <MapPin size={14} style={{ color: 'var(--primary)' }} />
                    <span>{listing.city}</span>
                  </div>
                </div>
                <h3 className="listing-card-title">{listing.title}</h3>
                
                <div className="listing-card-specs">
                  <div className="spec-item">
                    <Bed size={16} />
                    <span>{listing.bedrooms} Beds</span>
                  </div>
                  <div className="spec-item">
                    <Bath size={16} />
                    <span>{listing.bathrooms} Baths</span>
                  </div>
                  <div className="spec-item">
                    <Maximize size={16} />
                    <span>{listing.area} sqft</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
