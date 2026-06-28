package com.rentsphere.aireview.entity;

import com.rentsphere.aireview.enums.FlagSeverity;
import com.rentsphere.aireview.enums.FlagType;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "review_flags")
public class ReviewFlag {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private ListingReview review;

    @Enumerated(EnumType.STRING)
    @Column(name = "flag_type", nullable = false, length = 64)
    private FlagType flagType;

    @Enumerated(EnumType.STRING)
    @Column(name = "severity", nullable = false, length = 16)
    private FlagSeverity severity = FlagSeverity.INFO;

    @Column(name = "description", nullable = false, length = 512)
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public ListingReview getReview() { return review; }
    public void setReview(ListingReview review) { this.review = review; }
    public FlagType getFlagType() { return flagType; }
    public void setFlagType(FlagType flagType) { this.flagType = flagType; }
    public FlagSeverity getSeverity() { return severity; }
    public void setSeverity(FlagSeverity severity) { this.severity = severity; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Instant getCreatedAt() { return createdAt; }
}
