CREATE TABLE IF NOT EXISTS listing_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL UNIQUE,
    trust_score INTEGER NOT NULL CHECK (trust_score >= 0 AND trust_score <= 100),
    summary VARCHAR(1024),
    reviewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    reviewed_by VARCHAR(64) NOT NULL DEFAULT 'AI_MOCK',
    rerun_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS review_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES listing_reviews(id) ON DELETE CASCADE,
    flag_type VARCHAR(64) NOT NULL,
    severity VARCHAR(16) NOT NULL DEFAULT 'INFO',
    description VARCHAR(512) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_listing_reviews_listing_id ON listing_reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_review_flags_review_id ON review_flags(review_id);
CREATE INDEX IF NOT EXISTS idx_review_flags_severity ON review_flags(severity);
