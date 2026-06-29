import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getListings, Listing } from '../data/mockListings';
import { Search as SearchIcon, SlidersHorizontal, Bed, Bath, Maximize, Compass, Layers, X } from 'lucide-react';
import * as Cesium from 'cesium';
import './Search.css';

const CesiumGlobe: React.FC<{
  listings: Listing[];
  hoveredId: string | null;
  onSelect: (listing: Listing | null) => void;
}> = ({ listings, hoveredId, onSelect }) => {
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

    listings.forEach(listing => {
      const isHovered = hoveredId === listing.id;
      viewer.entities.add({
        id: listing.id,
        position: Cesium.Cartesian3.fromDegrees(listing.lng, listing.lat, 0),
        point: {
          pixelSize: isHovered ? 18 : 14,
          color: isHovered ? Cesium.Color.NAVY : Cesium.Color.ORANGE,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.NONE,
        },
      });
    });

    if (listings.length > 0) {
      const entities = viewer.entities.values.slice();
      const flyPromise = viewer.flyTo(entities);
      if (flyPromise) {
        flyPromise.catch(() => {});
      }
    }
  }, [listings, hoveredId]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((click: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
      const picked = viewer.scene.pick(click.position);
      const entityId = picked && picked.id && (typeof picked.id === 'string' ? picked.id : picked.id.id);
      if (entityId) {
        const listing = listings.find(l => l.id === entityId);
        if (listing) {
          onSelect(listing);
          const entity = viewer.entities.getById(entityId);
          if (entity) {
            viewer.flyTo(entity, {
              duration: 1,
              offset: new Cesium.HeadingPitchRange(0, -Math.PI / 4, 10000),
            });
          }
        }
      } else {
        onSelect(null);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return () => handler.destroy();
  }, [listings, onSelect]);

  return <div ref={containerRef} className="cesium-globe" />;
};

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [cityInput, setCityInput] = useState(searchParams.get('city') || '');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || 'all');
  const [priceMax, setPriceMax] = useState<number>(5000);
  const [bedFilter, setBedFilter] = useState<string>('any');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);
  const [selectedMapPin, setSelectedMapPin] = useState<Listing | null>(null);

  const amenitiesList = ['Pool', 'Gym', 'Wifi', 'Air Conditioning', 'Parking', 'Smart Home', 'Furnished', 'Balcony', 'Garden', 'Pet Friendly'];

  const allListings = useMemo(() => getListings(), []);

  const filteredListings = useMemo(() => {
    return allListings.filter(item => {
      if (item.status !== 'APPROVED') return false;
      if (cityInput && !item.city.toLowerCase().includes(cityInput.toLowerCase())) return false;
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;
      if (item.price > priceMax) return false;
      if (bedFilter !== 'any') {
        const requiredBeds = parseInt(bedFilter);
        if (item.bedrooms < requiredBeds) return false;
      }
      if (selectedAmenities.length > 0) {
        const hasAll = selectedAmenities.every(a => item.amenities.includes(a));
        if (!hasAll) return false;
      }
      return true;
    });
  }, [allListings, cityInput, typeFilter, priceMax, bedFilter, selectedAmenities]);

  useEffect(() => {
    const params: { [key: string]: string } = {};
    if (cityInput) params.city = cityInput;
    if (typeFilter !== 'all') params.type = typeFilter;
    setSearchParams(params);
  }, [cityInput, typeFilter, setSearchParams]);

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleResetFilters = () => {
    setCityInput('');
    setTypeFilter('all');
    setPriceMax(5000);
    setBedFilter('any');
    setSelectedAmenities([]);
  };

  const handleSelect = useCallback((listing: Listing | null) => {
    setSelectedMapPin(listing);
  }, []);

  return (
    <div className="search-page-container animate-fade-in">
      <aside className="search-sidebar glass">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
            <SlidersHorizontal size={18} style={{ color: 'var(--primary)' }} />
            <span>Search Filters</span>
          </h3>
          <button onClick={handleResetFilters} className="reset-btn">Reset</button>
        </div>

        <div className="form-group">
          <label className="form-label">Location / City</label>
          <div className="sidebar-input-wrapper">
            <SearchIcon size={16} className="input-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Los Angeles, Austin"
              style={{ paddingLeft: '38px' }}
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Space Type</label>
          <select
            className="form-input"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="apartment">Apartments</option>
            <option value="house">Houses</option>
            <option value="villa">Villas</option>
            <option value="studio">Studios</option>
          </select>
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>Max Rent</span>
            <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>${priceMax}/mo</span>
          </div>
          <input
            type="range"
            min="500"
            max="5000"
            step="100"
            value={priceMax}
            onChange={(e) => setPriceMax(parseInt(e.target.value))}
            style={{ width: '100%', marginTop: '8px', cursor: 'pointer', accentColor: 'var(--primary)' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Bedrooms</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['any', '1', '2', '3', '4'].map(beds => (
              <button
                key={beds}
                className={`bed-btn ${bedFilter === beds ? 'active' : ''}`}
                onClick={() => setBedFilter(beds)}
              >
                {beds === 'any' ? 'Any' : `${beds}+`}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Amenities</label>
          <div className="amenities-checklist">
            {amenitiesList.map(a => (
              <label key={a} className="amenity-checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(a)}
                  onChange={() => toggleAmenity(a)}
                  className="amenity-check"
                />
                <span>{a}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      <section className="search-results-wrapper">
        <div style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Showing <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{filteredListings.length}</span> matching spaces
        </div>

        {filteredListings.length === 0 ? (
          <div className="empty-search glass">
            <Compass size={48} className="empty-icon animate-pulse" />
            <h3>No results found</h3>
            <p>Try resetting some filters or searching for another city.</p>
          </div>
        ) : (
          <div className="results-grid">
            {filteredListings.map(listing => (
              <div
                key={listing.id}
                className={`search-card glass glass-hover ${hoveredListingId === listing.id ? 'highlighted' : ''}`}
                onMouseEnter={() => setHoveredListingId(listing.id)}
                onMouseLeave={() => setHoveredListingId(null)}
                onClick={() => navigate(`/search/${listing.id}`)}
              >
                <div className="search-card-img-wrapper">
                  <img src={listing.images[0]} alt={listing.title} className="search-card-img" />
                  <div className="search-card-type">{listing.type}</div>
                  <div className="search-card-score">AI {listing.trustScore}</div>
                </div>
                <div className="search-card-info">
                  <div className="search-card-price-row">
                    <span className="search-price">${listing.price}<span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>/mo</span></span>
                    <span className="search-loc">{listing.city}, {listing.state}</span>
                  </div>
                  <h4 className="search-card-title">{listing.title}</h4>
                  
                  <div className="search-card-specs">
                    <span className="spec-badge"><Bed size={12} /> {listing.bedrooms} Beds</span>
                    <span className="spec-badge"><Bath size={12} /> {listing.bathrooms} Baths</span>
                    <span className="spec-badge"><Maximize size={12} /> {listing.area} sqft</span>
                  </div>

                  <div className="search-card-tags">
                    {listing.amenities.slice(0, 3).map(a => (
                      <span key={a} className="amenity-mini-tag">{a}</span>
                    ))}
                    {listing.amenities.length > 3 && (
                      <span className="amenity-mini-tag">+{listing.amenities.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="search-map-pane glass">
        <div className="map-layer-indicator">
          <Layers size={14} />
          <span>3D Globe</span>
        </div>
        
        <div className="cesium-container">
          <CesiumGlobe
            listings={filteredListings}
            hoveredId={hoveredListingId}
            onSelect={handleSelect}
          />

          {selectedMapPin && (
            <div className="cesium-popup-card glass">
              <button className="cesium-popup-close" onClick={() => setSelectedMapPin(null)}>
                <X size={16} />
              </button>
              <img src={selectedMapPin.images[0]} alt={selectedMapPin.title} className="cesium-popup-img" />
              <div className="cesium-popup-body">
                <h5 className="cesium-popup-title">{selectedMapPin.title}</h5>
                <p className="cesium-popup-price">${selectedMapPin.price}/mo</p>
                <p className="cesium-popup-loc">{selectedMapPin.city}, {selectedMapPin.state}</p>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '6px', fontSize: '0.75rem', marginTop: '8px' }}
                  onClick={() => navigate(`/search/${selectedMapPin.id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
