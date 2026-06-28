package com.rentsphere.moderation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ApprovalRequest {
    @Size(max = 1024)
    private String note;

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
