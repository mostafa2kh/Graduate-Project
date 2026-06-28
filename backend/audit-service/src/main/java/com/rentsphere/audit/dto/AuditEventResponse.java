package com.rentsphere.audit.dto;

import java.time.Instant;
import java.util.UUID;

public record AuditEventResponse(
    UUID id,
    String eventType,
    UUID actorId,
    String actorRole,
    String targetType,
    String targetId,
    String action,
    String details,
    String source,
    String ipAddress,
    String userAgent,
    Instant createdAt
) {}
