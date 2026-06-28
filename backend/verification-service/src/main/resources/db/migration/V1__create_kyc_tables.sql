CREATE TABLE IF NOT EXISTS kyc_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    submission_type VARCHAR(64) NOT NULL DEFAULT 'INDIVIDUAL',
    notes VARCHAR(1024),
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS kyc_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES kyc_submissions(id) ON DELETE CASCADE,
    document_type VARCHAR(64) NOT NULL,
    file_name VARCHAR(512) NOT NULL,
    file_path VARCHAR(1024) NOT NULL,
    file_size BIGINT NOT NULL,
    content_type VARCHAR(127) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS kyc_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES kyc_submissions(id) ON DELETE CASCADE,
    decision VARCHAR(16) NOT NULL,
    reason VARCHAR(1024),
    decided_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_kyc_sub_user_id ON kyc_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_sub_status ON kyc_submissions(status);
CREATE INDEX IF NOT EXISTS idx_kyc_doc_sub_id ON kyc_documents(submission_id);
CREATE INDEX IF NOT EXISTS idx_kyc_dec_sub_id ON kyc_decisions(submission_id);
