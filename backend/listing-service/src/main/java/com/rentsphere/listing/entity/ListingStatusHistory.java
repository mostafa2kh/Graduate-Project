package com.rentsphere.listing.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.rentsphere.listing.enums.ListingStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity @Table(name = "listing_status_history")
public class ListingStatusHistory {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne @JoinColumn(name = "listing_id", nullable = false)
    @JsonIgnore
    private Listing listing;

    @Enumerated(EnumType.STRING)
    @Column(name = "from_status", length = 30)
    private ListingStatus fromStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "to_status", nullable = false, length = 30)
    private ListingStatus toStatus;

    @Column(name = "changed_by", nullable = false)
    private UUID changedBy;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Listing getListing() { return listing; }
    public void setListing(Listing listing) { this.listing = listing; }
    public ListingStatus getFromStatus() { return fromStatus; }
    public void setFromStatus(ListingStatus fromStatus) { this.fromStatus = fromStatus; }
    public ListingStatus getToStatus() { return toStatus; }
    public void setToStatus(ListingStatus toStatus) { this.toStatus = toStatus; }
    public UUID getChangedBy() { return changedBy; }
    public void setChangedBy(UUID changedBy) { this.changedBy = changedBy; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
