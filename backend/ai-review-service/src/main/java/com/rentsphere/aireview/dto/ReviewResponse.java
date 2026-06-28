package com.rentsphere.aireview.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class ReviewResponse {
    private UUID id;
    private UUID listingId;
    private Integer trustScore;
    private String summary;
    private Instant reviewedAt;
    private String reviewedBy;
    private Integer rerunCount;
    private List<FlagDto> flags;

    public ReviewResponse() {}

    public static class FlagDto {
        private UUID id;
        private String flagType;
        private String severity;
        private String description;
        private Instant createdAt;

        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }
        public String getFlagType() { return flagType; }
        public void setFlagType(String flagType) { this.flagType = flagType; }
        public String getSeverity() { return severity; }
        public void setSeverity(String severity) { this.severity = severity; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public Instant getCreatedAt() { return createdAt; }
        public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getListingId() { return listingId; }
    public void setListingId(UUID listingId) { this.listingId = listingId; }
    public Integer getTrustScore() { return trustScore; }
    public void setTrustScore(Integer trustScore) { this.trustScore = trustScore; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public Instant getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(Instant reviewedAt) { this.reviewedAt = reviewedAt; }
    public String getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; }
    public Integer getRerunCount() { return rerunCount; }
    public void setRerunCount(Integer rerunCount) { this.rerunCount = rerunCount; }
    public List<FlagDto> getFlags() { return flags; }
    public void setFlags(List<FlagDto> flags) { this.flags = flags; }
}
