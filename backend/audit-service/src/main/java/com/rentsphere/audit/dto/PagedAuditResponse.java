package com.rentsphere.audit.dto;

import java.time.Instant;
import java.util.List;

public record PagedAuditResponse(List<AuditEventResponse> events, int page, int size, long totalElements, int totalPages) {}
