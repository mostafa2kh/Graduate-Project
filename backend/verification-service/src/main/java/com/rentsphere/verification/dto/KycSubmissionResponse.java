package com.rentsphere.verification.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class KycSubmissionResponse {
    private UUID id; private String status; private String submissionType; private String notes;
    private Instant submittedAt; private Instant reviewedAt;
    private List<KycDocumentResponse> documents;
    private List<KycDecisionResponse> decisions;

    public static class KycDocumentResponse {
        private UUID id; private String documentType; private String fileName; private Long fileSize; private String contentType; private Instant createdAt;
        public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
        public String getDocumentType() { return documentType; } public void setDocumentType(String documentType) { this.documentType = documentType; }
        public String getFileName() { return fileName; } public void setFileName(String fileName) { this.fileName = fileName; }
        public Long getFileSize() { return fileSize; } public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
        public String getContentType() { return contentType; } public void setContentType(String contentType) { this.contentType = contentType; }
        public Instant getCreatedAt() { return createdAt; } public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    }

    public static class KycDecisionResponse {
        private UUID id; private String decision; private String reason; private UUID decidedBy; private Instant createdAt;
        public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
        public String getDecision() { return decision; } public void setDecision(String decision) { this.decision = decision; }
        public String getReason() { return reason; } public void setReason(String reason) { this.reason = reason; }
        public UUID getDecidedBy() { return decidedBy; } public void setDecidedBy(UUID decidedBy) { this.decidedBy = decidedBy; }
        public Instant getCreatedAt() { return createdAt; } public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    }

    public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
    public String getStatus() { return status; } public void setStatus(String status) { this.status = status; }
    public String getSubmissionType() { return submissionType; } public void setSubmissionType(String submissionType) { this.submissionType = submissionType; }
    public String getNotes() { return notes; } public void setNotes(String notes) { this.notes = notes; }
    public Instant getSubmittedAt() { return submittedAt; } public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }
    public Instant getReviewedAt() { return reviewedAt; } public void setReviewedAt(Instant reviewedAt) { this.reviewedAt = reviewedAt; }
    public List<KycDocumentResponse> getDocuments() { return documents; } public void setDocuments(List<KycDocumentResponse> documents) { this.documents = documents; }
    public List<KycDecisionResponse> getDecisions() { return decisions; } public void setDecisions(List<KycDecisionResponse> decisions) { this.decisions = decisions; }
}
