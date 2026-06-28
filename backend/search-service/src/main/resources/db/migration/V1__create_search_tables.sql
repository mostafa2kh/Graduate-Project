CREATE TABLE IF NOT EXISTS searchable_listings (
    id UUID PRIMARY KEY,
    title VARCHAR(256) NOT NULL,
    description TEXT,
    property_type VARCHAR(32),
    price DECIMAL(12,2),
    currency VARCHAR(8) DEFAULT 'USD',
    bedrooms INTEGER,
    bathrooms INTEGER,
    area_size DECIMAL(10,2),
    area_unit VARCHAR(8),
    furnished BOOLEAN DEFAULT FALSE,
    city VARCHAR(128),
    area VARCHAR(128),
    state VARCHAR(128),
    country VARCHAR(64) DEFAULT 'EG',
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    status VARCHAR(32) NOT NULL,
    landlord_id UUID NOT NULL,
    primary_image_url VARCHAR(512),
    trust_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_search_city ON searchable_listings(city);
CREATE INDEX IF NOT EXISTS idx_search_type ON searchable_listings(property_type);
CREATE INDEX IF NOT EXISTS idx_search_price ON searchable_listings(price);
CREATE INDEX IF NOT EXISTS idx_search_status ON searchable_listings(status);
