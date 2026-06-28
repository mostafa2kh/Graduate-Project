package com.rentsphere.verification.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class KycAdminDecisionRequest {
    @NotBlank @Size(max = 1024) private String reason;
    public String getReason() { return reason; } public void setReason(String reason) { this.reason = reason; }
}
