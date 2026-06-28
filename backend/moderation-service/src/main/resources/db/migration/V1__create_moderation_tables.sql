CREATE TABLE IF NOT EXISTS moderation_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL UNIQUE,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    assigned_to UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS moderation_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES moderation_cases(id) ON DELETE CASCADE,
    decision VARCHAR(16) NOT NULL,
    reason VARCHAR(1024),
    decided_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES moderation_cases(id) ON DELETE CASCADE,
    note VARCHAR(2048) NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_moderation_cases_status ON moderation_cases(status);
CREATE INDEX IF NOT EXISTS idx_moderation_decisions_case_id ON moderation_decisions(case_id);
CREATE INDEX IF NOT EXISTS idx_admin_notes_case_id ON admin_notes(case_id);
