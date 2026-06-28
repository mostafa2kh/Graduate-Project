package com.rentsphere.media.dto;

import com.rentsphere.media.enums.StorageProvider;

import java.time.Instant;
import java.util.UUID;

public class ImageResponse {
    private UUID imageId;
    private UUID mediaFileId;
    private String fileName;
    private String contentType;
    private Long fileSize;
    private boolean isPrimary;
    private Integer sortOrder;
    private String url;
    private StorageProvider provider;
    private Instant createdAt;

    public UUID getImageId() { return imageId; }
    public void setImageId(UUID imageId) { this.imageId = imageId; }
    public UUID getMediaFileId() { return mediaFileId; }
    public void setMediaFileId(UUID mediaFileId) { this.mediaFileId = mediaFileId; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    public boolean getIsPrimary() { return isPrimary; }
    public void setIsPrimary(boolean isPrimary) { this.isPrimary = isPrimary; }
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public StorageProvider getProvider() { return provider; }
    public void setProvider(StorageProvider provider) { this.provider = provider; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
