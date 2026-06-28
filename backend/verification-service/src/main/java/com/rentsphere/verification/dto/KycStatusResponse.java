package com.rentsphere.verification.dto;

import java.util.UUID;

public class KycStatusResponse {
    private String status;
    private int submissionCount;
    private UUID latestSubmissionId;
    private boolean verified;

    public String getStatus() { return status; } public void setStatus(String status) { this.status = status; }
    public int getSubmissionCount() { return submissionCount; } public void setSubmissionCount(int submissionCount) { this.submissionCount = submissionCount; }
    public UUID getLatestSubmissionId() { return latestSubmissionId; } public void setLatestSubmissionId(UUID latestSubmissionId) { this.latestSubmissionId = latestSubmissionId; }
    public boolean isVerified() { return verified; } public void setVerified(boolean verified) { this.verified = verified; }
}
