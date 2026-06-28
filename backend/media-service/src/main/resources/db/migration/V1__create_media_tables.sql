CREATE TABLE IF NOT EXISTS media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(512) NOT NULL,
    stored_file_name VARCHAR(512) NOT NULL UNIQUE,
    content_type VARCHAR(127) NOT NULL,
    file_size BIGINT NOT NULL,
    storage_path VARCHAR(1024) NOT NULL,
    md5_hash VARCHAR(64),
    uploaded_by UUID NOT NULL,
    provider VARCHAR(32) NOT NULL DEFAULT 'LOCAL',
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS listing_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL,
    media_file_id UUID NOT NULL REFERENCES media_files(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_listing_media UNIQUE (listing_id, media_file_id)
);

CREATE INDEX IF NOT EXISTS idx_listing_images_listing_id ON listing_images(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_images_media_file_id ON listing_images(media_file_id);
CREATE INDEX IF NOT EXISTS idx_listing_images_is_primary ON listing_images(listing_id, is_primary) WHERE is_primary = TRUE;
CREATE INDEX IF NOT EXISTS idx_media_files_uploaded_by ON media_files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_media_files_status ON media_files(status);
