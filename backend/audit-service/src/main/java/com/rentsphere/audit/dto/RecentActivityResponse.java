package com.rentsphere.audit.dto;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record RecentActivityResponse(
    UUID id,
    String eventType,
    String action,
    String actorLabel,
    String targetSummary,
    Instant createdAt
) {}
