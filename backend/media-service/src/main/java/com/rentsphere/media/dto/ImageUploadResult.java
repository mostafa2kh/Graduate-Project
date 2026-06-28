package com.rentsphere.media.dto;

import java.util.UUID;

public class ImageUploadResult {
    private UUID imageId;
    private UUID mediaFileId;
    private String fileName;
    private String url;

    public ImageUploadResult(UUID imageId, UUID mediaFileId, String fileName, String url) {
        this.imageId = imageId;
        this.mediaFileId = mediaFileId;
        this.fileName = fileName;
        this.url = url;
    }

    public UUID getImageId() { return imageId; }
    public UUID getMediaFileId() { return mediaFileId; }
    public String getFileName() { return fileName; }
    public String getUrl() { return url; }
}
