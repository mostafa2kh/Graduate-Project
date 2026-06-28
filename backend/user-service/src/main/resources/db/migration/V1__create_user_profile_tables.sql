CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    bio TEXT,
    avatar_url VARCHAR(512),
    city VARCHAR(100),
    area VARCHAR(100),
    date_of_birth DATE,
    preferred_language VARCHAR(10) DEFAULT 'en',
    is_renter BOOLEAN DEFAULT true,
    is_landlord BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    verification_status VARCHAR(20) DEFAULT 'unverified',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    min_price DECIMAL(12, 2),
    max_price DECIMAL(12, 2),
    preferred_bedrooms INTEGER,
    preferred_bathrooms INTEGER,
    property_type VARCHAR(50),
    furnished VARCHAR(20),
    notification_email BOOLEAN DEFAULT true,
    notification_push BOOLEAN DEFAULT true,
    notification_sms BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favorite_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    listing_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, listing_id)
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_favorite_listings_user_id ON favorite_listings(user_id);
