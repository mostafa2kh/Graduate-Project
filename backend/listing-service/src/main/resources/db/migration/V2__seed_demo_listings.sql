-- Seed demo listings for the graduation presentation
-- References landlord fixed UUID from auth-service: a0000000-0000-0000-0000-000000000002
-- Uses amenities seeded in V1
DO $$
DECLARE
    listing_1_id UUID;
    listing_2_id UUID;
    listing_3_id UUID;
    listing_4_id UUID;
    listing_5_id UUID;
    listing_6_id UUID;
    wif_id UUID;
    ac_id UUID;
    parking_id UUID;
    gym_id UUID;
    pool_id UUID;
    security_id UUID;
    balcony_id UUID;
    furnished_id UUID;
    washer_id UUID;
    fridge_id UUID;
    elevator_id UUID;
    garden_id UUID;
    heating_id UUID;
    tv_id UUID;
BEGIN
    SELECT id INTO wif_id FROM amenities WHERE name = 'WiFi';
    SELECT id INTO ac_id FROM amenities WHERE name = 'Air Conditioning';
    SELECT id INTO parking_id FROM amenities WHERE name = 'Parking';
    SELECT id INTO gym_id FROM amenities WHERE name = 'Gym';
    SELECT id INTO pool_id FROM amenities WHERE name = 'Swimming Pool';
    SELECT id INTO security_id FROM amenities WHERE name = 'Security';
    SELECT id INTO balcony_id FROM amenities WHERE name = 'Balcony';
    SELECT id INTO furnished_id FROM amenities WHERE name = 'Furnished';
    SELECT id INTO washer_id FROM amenities WHERE name = 'Washer';
    SELECT id INTO fridge_id FROM amenities WHERE name = 'Refrigerator';
    SELECT id INTO elevator_id FROM amenities WHERE name = 'Elevator';
    SELECT id INTO garden_id FROM amenities WHERE name = 'Garden';
    SELECT id INTO heating_id FROM amenities WHERE name = 'Heating';
    SELECT id INTO tv_id FROM amenities WHERE name = 'TV';

    -- Listing 1: Modern Downtown Apartment
    INSERT INTO listings (id, landlord_id, title, description, price, currency, property_type, bedrooms, bathrooms, area_size, area_unit, year_built, status, is_furnished, is_featured, views_count)
    VALUES (uuid_generate_v4(), 'a0000000-0000-0000-0000-000000000002',
            'Modern Downtown Apartment', 'Beautiful modern apartment in the heart of downtown. Floor-to-ceiling windows, open-plan living, and top-of-the-line finishes. Walking distance to restaurants, shops, and public transit.',
            2500.00, 'USD', 'apartment', 2, 2, 1200.00, 'sqft', 2020, 'APPROVED', TRUE, TRUE, 342)
    RETURNING id INTO listing_1_id;
    INSERT INTO listing_addresses (listing_id, street, city, area, state, zip_code, country, latitude, longitude)
    VALUES (listing_1_id, '123 Main Street', 'New York', 'Manhattan', 'NY', '10001', 'United States', 40.7484400, -73.9856900);
    INSERT INTO listing_amenities (listing_id, amenity_id) VALUES
        (listing_1_id, wif_id), (listing_1_id, ac_id), (listing_1_id, heating_id),
        (listing_1_id, gym_id), (listing_1_id, security_id), (listing_1_id, furnished_id),
        (listing_1_id, tv_id), (listing_1_id, elevator_id);

    -- Listing 2: Cozy Beachside Villa
    INSERT INTO listings (id, landlord_id, title, description, price, currency, property_type, bedrooms, bathrooms, area_size, area_unit, year_built, status, is_furnished, is_featured, views_count)
    VALUES (uuid_generate_v4(), 'a0000000-0000-0000-0000-000000000002',
            'Cozy Beachside Villa', 'Stunning beachfront villa with private pool and garden. Perfect for families or groups. Direct beach access, outdoor dining area, and panoramic ocean views from the rooftop terrace.',
            5800.00, 'USD', 'villa', 4, 3, 2800.00, 'sqft', 2019, 'APPROVED', TRUE, TRUE, 587)
    RETURNING id INTO listing_2_id;
    INSERT INTO listing_addresses (listing_id, street, city, area, state, zip_code, country, latitude, longitude)
    VALUES (listing_2_id, '456 Ocean Drive', 'Miami', 'South Beach', 'FL', '33139', 'United States', 25.7826000, -80.1335900);
    INSERT INTO listing_amenities (listing_id, amenity_id) VALUES
        (listing_2_id, wif_id), (listing_2_id, ac_id), (listing_2_id, parking_id),
        (listing_2_id, pool_id), (listing_2_id, garden_id), (listing_2_id, balcony_id),
        (listing_2_id, washer_id), (listing_2_id, fridge_id), (listing_2_id, furnished_id);

    -- Listing 3: Downtown Studio Loft
    INSERT INTO listings (id, landlord_id, title, description, price, currency, property_type, bedrooms, bathrooms, area_size, area_unit, year_built, status, is_furnished, is_featured, views_count)
    VALUES (uuid_generate_v4(), 'a0000000-0000-0000-0000-000000000002',
            'Downtown Studio Loft', 'Chic industrial-style studio loft with exposed brick walls and high ceilings. Ideal for young professionals. Close to metro, cafes, and nightlife.',
            1200.00, 'USD', 'apartment', 0, 1, 550.00, 'sqft', 2018, 'APPROVED', TRUE, FALSE, 189)
    RETURNING id INTO listing_3_id;
    INSERT INTO listing_addresses (listing_id, street, city, area, state, zip_code, country, latitude, longitude)
    VALUES (listing_3_id, '789 Elm Street', 'Austin', 'Downtown', 'TX', '73301', 'United States', 30.2671500, -97.7430600);
    INSERT INTO listing_amenities (listing_id, amenity_id) VALUES
        (listing_3_id, wif_id), (listing_3_id, ac_id), (listing_3_id, washer_id),
        (listing_3_id, fridge_id), (listing_3_id, security_id);

    -- Listing 4: Suburban Family Home
    INSERT INTO listings (id, landlord_id, title, description, price, currency, property_type, bedrooms, bathrooms, area_size, area_unit, year_built, status, is_furnished, is_featured, views_count)
    VALUES (uuid_generate_v4(), 'a0000000-0000-0000-0000-000000000002',
            'Suburban Family Home', 'Spacious family home in a quiet suburban neighborhood. Large backyard with playset, finished basement, and attached two-car garage. Top-rated school district.',
            3200.00, 'USD', 'house', 4, 2.5, 2200.00, 'sqft', 2015, 'PENDING_REVIEW', FALSE, FALSE, 76)
    RETURNING id INTO listing_4_id;
    INSERT INTO listing_addresses (listing_id, street, city, area, state, zip_code, country, latitude, longitude)
    VALUES (listing_4_id, '321 Oak Avenue', 'Chicago', 'Lincoln Park', 'IL', '60614', 'United States', 41.9213000, -87.6522000);
    INSERT INTO listing_amenities (listing_id, amenity_id) VALUES
        (listing_4_id, wif_id), (listing_4_id, heating_id), (listing_4_id, parking_id),
        (listing_4_id, washer_id), (listing_4_id, garden_id), (listing_4_id, security_id);

    -- Listing 5: Luxury Penthouse Suite
    INSERT INTO listings (id, landlord_id, title, description, price, currency, property_type, bedrooms, bathrooms, area_size, area_unit, year_built, status, is_furnished, is_featured, views_count)
    VALUES (uuid_generate_v4(), 'a0000000-0000-0000-0000-000000000002',
            'Luxury Penthouse Suite', 'Exclusive penthouse on the 45th floor with 360-degree city views. Smart home features, private elevator, wine cellar, and rooftop access. The ultimate urban living experience.',
            9500.00, 'USD', 'penthouse', 3, 3.5, 3200.00, 'sqft', 2021, 'APPROVED', TRUE, TRUE, 923)
    RETURNING id INTO listing_5_id;
    INSERT INTO listing_addresses (listing_id, street, city, area, state, zip_code, country, latitude, longitude)
    VALUES (listing_5_id, '555 Tower Boulevard', 'San Francisco', 'Financial District', 'CA', '94111', 'United States', 37.7922000, -122.3970000);
    INSERT INTO listing_amenities (listing_id, amenity_id) VALUES
        (listing_5_id, wif_id), (listing_5_id, ac_id), (listing_5_id, parking_id),
        (listing_5_id, gym_id), (listing_5_id, pool_id), (listing_5_id, security_id),
        (listing_5_id, balcony_id), (listing_5_id, furnished_id), (listing_5_id, elevator_id),
        (listing_5_id, tv_id);

    -- Listing 6: Charming Garden Cottage
    INSERT INTO listings (id, landlord_id, title, description, price, currency, property_type, bedrooms, bathrooms, area_size, area_unit, year_built, status, is_furnished, is_featured, views_count)
    VALUES (uuid_generate_v4(), 'a0000000-0000-0000-0000-000000000002',
            'Charming Garden Cottage', 'Quaint garden cottage with private entrance and lush garden views. Features a cozy fireplace, modern kitchen, and a private patio. Minutes from downtown and parks.',
            1800.00, 'USD', 'cottage', 1, 1, 700.00, 'sqft', 2017, 'APPROVED', TRUE, FALSE, 234)
    RETURNING id INTO listing_6_id;
    INSERT INTO listing_addresses (listing_id, street, city, area, state, zip_code, country, latitude, longitude)
    VALUES (listing_6_id, '777 Garden Lane', 'Portland', 'Pearl District', 'OR', '97201', 'United States', 45.5231000, -122.6764800);
    INSERT INTO listing_amenities (listing_id, amenity_id) VALUES
        (listing_6_id, wif_id), (listing_6_id, heating_id), (listing_6_id, garden_id),
        (listing_6_id, washer_id), (listing_6_id, fridge_id), (listing_6_id, furnished_id);
END $$;
