CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL,
    renter_id UUID NOT NULL,
    landlord_id UUID NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(8) DEFAULT 'USD',
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    guests_count INTEGER DEFAULT 1,
    special_requests VARCHAR(1024),
    cancelled_by UUID,
    cancellation_reason VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS booking_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    from_status VARCHAR(32),
    to_status VARCHAR(32) NOT NULL,
    changed_by UUID,
    note VARCHAR(256),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_booking_listing ON bookings(listing_id);
CREATE INDEX IF NOT EXISTS idx_booking_renter ON bookings(renter_id);
CREATE INDEX IF NOT EXISTS idx_booking_landlord ON bookings(landlord_id);
CREATE INDEX IF NOT EXISTS idx_booking_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_booking_history ON booking_status_history(booking_id);
