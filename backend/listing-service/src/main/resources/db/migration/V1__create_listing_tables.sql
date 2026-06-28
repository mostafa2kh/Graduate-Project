CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50),
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    landlord_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    property_type VARCHAR(50) NOT NULL,
    bedrooms INTEGER NOT NULL DEFAULT 0,
    bathrooms INTEGER NOT NULL DEFAULT 0,
    area_size DECIMAL(10, 2),
    area_unit VARCHAR(10) DEFAULT 'sqft',
    year_built INTEGER,
    status VARCHAR(30) NOT NULL DEFAULT 'draft',
    is_furnished BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE listing_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL UNIQUE REFERENCES listings(id) ON DELETE CASCADE,
    street VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    area VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Egypt',
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE listing_amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    UNIQUE(listing_id, amenity_id)
);

CREATE TABLE listing_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_available BOOLEAN DEFAULT true,
    notes VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE listing_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    from_status VARCHAR(30),
    to_status VARCHAR(30) NOT NULL,
    changed_by UUID NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed standard amenities
INSERT INTO amenities (name, category, icon) VALUES
  ('WiFi', 'utility', 'wifi'),
  ('Air Conditioning', 'climate', 'wind'),
  ('Heating', 'climate', 'thermometer'),
  ('Washer', 'appliance', 'washing-machine'),
  ('Dryer', 'appliance', 'dryer'),
  ('Refrigerator', 'appliance', 'refrigerator'),
  ('Oven', 'appliance', 'oven'),
  ('Microwave', 'appliance', 'microwave'),
  ('Dishwasher', 'appliance', 'dishwasher'),
  ('TV', 'entertainment', 'tv'),
  ('Parking', 'parking', 'parking'),
  ('Elevator', 'building', 'elevator'),
  ('Gym', 'building', 'gym'),
  ('Swimming Pool', 'building', 'pool'),
  ('Security', 'building', 'shield'),
  ('Balcony', 'outdoor', 'balcony'),
  ('Garden', 'outdoor', 'garden'),
  ('Pets Allowed', 'rules', 'paw-print'),
  ('Smoking Allowed', 'rules', 'smoking'),
  ('Furnished', 'furnishing', 'sofa');

CREATE INDEX idx_listings_landlord_id ON listings(landlord_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listing_addresses_city ON listing_addresses(city);
CREATE INDEX idx_listing_availability_dates ON listing_availability(start_date, end_date);
CREATE INDEX idx_listing_status_history_listing_id ON listing_status_history(listing_id);
