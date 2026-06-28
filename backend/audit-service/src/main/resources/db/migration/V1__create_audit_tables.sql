CREATE TABLE IF NOT EXISTS audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(64) NOT NULL,
    actor_id UUID,
    actor_role VARCHAR(32),
    target_type VARCHAR(64),
    target_id VARCHAR(128),
    action VARCHAR(128) NOT NULL,
    details TEXT,
    source VARCHAR(64) NOT NULL,
    ip_address VARCHAR(45),
    user_agent VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_event_type ON audit_events(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_events(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_target ON audit_events(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_events(created_at);
