package com.rentsphere.verification.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name = "kyc_decisions")
public class KycDecision {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "submission_id", nullable = false) private KycSubmission submission;
    @Column(nullable = false, length = 16) private String decision;
    @Column(length = 1024) private String reason;
    @Column(name = "decided_by", nullable = false) private UUID decidedBy;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
    @PrePersist protected void onCreate() { createdAt = Instant.now(); }

    public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
    public KycSubmission getSubmission() { return submission; } public void setSubmission(KycSubmission submission) { this.submission = submission; }
    public String getDecision() { return decision; } public void setDecision(String decision) { this.decision = decision; }
    public String getReason() { return reason; } public void setReason(String reason) { this.reason = reason; }
    public UUID getDecidedBy() { return decidedBy; } public void setDecidedBy(UUID decidedBy) { this.decidedBy = decidedBy; }
    public Instant getCreatedAt() { return createdAt; }
}
