package com.rentsphere.verification.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name = "kyc_documents")
public class KycDocument {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "submission_id", nullable = false) private KycSubmission submission;
    @Column(name = "document_type", nullable = false, length = 64) private String documentType;
    @Column(name = "file_name", nullable = false, length = 512) private String fileName;
    @Column(name = "file_path", nullable = false, length = 1024) private String filePath;
    @Column(name = "file_size", nullable = false) private Long fileSize;
    @Column(name = "content_type", nullable = false, length = 127) private String contentType;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
    @PrePersist protected void onCreate() { createdAt = Instant.now(); }

    public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
    public KycSubmission getSubmission() { return submission; } public void setSubmission(KycSubmission submission) { this.submission = submission; }
    public String getDocumentType() { return documentType; } public void setDocumentType(String documentType) { this.documentType = documentType; }
    public String getFileName() { return fileName; } public void setFileName(String fileName) { this.fileName = fileName; }
    public String getFilePath() { return filePath; } public void setFilePath(String filePath) { this.filePath = filePath; }
    public Long getFileSize() { return fileSize; } public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    public String getContentType() { return contentType; } public void setContentType(String contentType) { this.contentType = contentType; }
    public Instant getCreatedAt() { return createdAt; }
}
