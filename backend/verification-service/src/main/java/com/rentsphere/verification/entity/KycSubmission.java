package com.rentsphere.verification.entity;

import com.rentsphere.verification.enums.VerificationStatus;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "kyc_submissions")
public class KycSubmission {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "user_id", nullable = false) private UUID userId;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 32) private VerificationStatus status = VerificationStatus.PENDING;
    @Column(name = "submission_type", length = 64) private String submissionType = "INDIVIDUAL";
    @Column(length = 1024) private String notes;
    @Column(name = "submitted_at", nullable = false) private Instant submittedAt;
    @Column(name = "reviewed_at") private Instant reviewedAt;
    @Column(name = "reviewed_by") private UUID reviewedBy;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
    @Column(name = "updated_at", nullable = false) private Instant updatedAt;
    @PrePersist protected void onCreate() { submittedAt = Instant.now(); createdAt = Instant.now(); updatedAt = Instant.now(); }
    @PreUpdate protected void onUpdate() { updatedAt = Instant.now(); }

    public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
    public UUID getUserId() { return userId; } public void setUserId(UUID userId) { this.userId = userId; }
    public VerificationStatus getStatus() { return status; } public void setStatus(VerificationStatus status) { this.status = status; }
    public String getSubmissionType() { return submissionType; } public void setSubmissionType(String submissionType) { this.submissionType = submissionType; }
    public String getNotes() { return notes; } public void setNotes(String notes) { this.notes = notes; }
    public Instant getSubmittedAt() { return submittedAt; }
    public Instant getReviewedAt() { return reviewedAt; } public void setReviewedAt(Instant reviewedAt) { this.reviewedAt = reviewedAt; }
    public UUID getReviewedBy() { return reviewedBy; } public void setReviewedBy(UUID reviewedBy) { this.reviewedBy = reviewedBy; }
    public Instant getCreatedAt() { return createdAt; } public Instant getUpdatedAt() { return updatedAt; }
}
