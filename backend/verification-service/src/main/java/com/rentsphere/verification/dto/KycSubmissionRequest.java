package com.rentsphere.verification.dto;

public class KycSubmissionRequest {
    private String submissionType;
    private String notes;
    public String getSubmissionType() { return submissionType; } public void setSubmissionType(String submissionType) { this.submissionType = submissionType; }
    public String getNotes() { return notes; } public void setNotes(String notes) { this.notes = notes; }
}
