CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL,
    user_id UUID NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(8) DEFAULT 'USD',
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    payment_method VARCHAR(64) DEFAULT 'STRIPE_MOCK',
    stripe_payment_intent_id VARCHAR(256),
    description VARCHAR(512),
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES payment_transactions(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    reason VARCHAR(512) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payment_booking ON payment_transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_payment_user ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_status ON payment_transactions(status);
