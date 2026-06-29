import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Trash2, Bed, Bath, Maximize } from 'lucide-react';
import { getListings, Listing } from '../data/mockListings';
import { getFavoriteListings, removeFavoriteListing } from '../data/mockUserData';
import { useAuth } from '../context/useAuth';

export const Favorites: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Listing[]>([]);

  const loadFavorites = useCallback(() => {
    if (!user) return;
    const favoriteIds = getFavoriteListings()
      .filter(favorite => favorite.userId === user.id)
      .map(favorite => favorite.listingId);
    setFavorites(getListings().filter(listing => favoriteIds.includes(listing.id)));
  }, [user]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleRemove = (listingId: string) => {
    if (!user) return;
    removeFavoriteListing(user.id, listingId);
    loadFavorites();
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: '#fff' }}>Saved Listings</h2>
          <p style={{ color: 'var(--text-muted)' }}>Your shortlist of homes to revisit, compare, and book later.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/search')}>Find More Homes</button>
      </div>

      {favorites.length === 0 ? (
        <div className="glass" style={{ padding: '60px 30px', textAlign: 'center' }}>
          <Heart size={42} style={{ color: 'var(--text-dark)', marginBottom: '12px' }} />
          <h3 style={{ color: '#fff' }}>No saved listings yet</h3>
          <p style={{ color: 'var(--text-muted)', margin: '8px 0 20px' }}>Open a listing and press the heart button to save it here.</p>
          <button className="btn btn-secondary" onClick={() => navigate('/search')}>Browse Listings</button>
        </div>
      ) : (
        <div className="grid-cols-3">
          {favorites.map(listing => (
            <div key={listing.id} className="glass glass-hover" style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => navigate(`/search/${listing.id}`)}>
              <img src={listing.images[0]} alt={listing.title} style={{ width: '100%', height: '210px', objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'start' }}>
                  <div>
                    <h3 style={{ color: '#fff', fontSize: '1.05rem' }}>{listing.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      <MapPin size={14} style={{ color: 'var(--primary)' }} /> {listing.city}, {listing.state}
                    </p>
                  </div>
                  <button
                    className="btn-icon"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleRemove(listing.id);
                    }}
                    aria-label="Remove saved listing"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
                <p style={{ color: 'var(--secondary)', fontWeight: 800, margin: '14px 0' }}>${listing.price}/mo</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <span className="badge badge-info"><Bed size={12} /> {listing.bedrooms} Beds</span>
                  <span className="badge badge-info"><Bath size={12} /> {listing.bathrooms} Baths</span>
                  <span className="badge badge-info"><Maximize size={12} /> {listing.area} sqft</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
