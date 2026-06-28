package com.rentsphere.audit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record CreateAuditEventRequest(
    @NotBlank @Size(max = 64) String eventType,
    UUID actorId,
    @Size(max = 32) String actorRole,
    @Size(max = 64) String targetType,
    @Size(max = 128) String targetId,
    @NotBlank @Size(max = 128) String action,
    String details,
    @NotBlank @Size(max = 64) String source,
    @Size(max = 45) String ipAddress,
    @Size(max = 512) String userAgent
) {}
