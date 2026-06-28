package com.rentsphere.audit.controller;

import com.rentsphere.audit.dto.*;
import com.rentsphere.audit.service.AuditService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/audit")
public class AuditController {
    private final AuditService auditService;
    public AuditController(AuditService auditService) { this.auditService = auditService; }

    @PostMapping("/events")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AuditEventResponse> createEvent(@Valid @RequestBody CreateAuditEventRequest request) {
        return ResponseEntity.ok(auditService.createEvent(request));
    }

    @GetMapping("/events")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PagedAuditResponse> listEvents(
            @RequestParam(required = false) UUID actorId,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String targetType,
            @RequestParam(required = false) String eventType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant dateTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(auditService.listEvents(actorId, action, targetType, eventType, dateFrom, dateTo, page, size));
    }

    @GetMapping("/events/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AuditEventResponse> getEvent(@PathVariable UUID eventId) {
        return auditService.getEvent(eventId).map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/recent")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RecentActivityResponse>> getRecent() {
        return ResponseEntity.ok(auditService.getRecentActivity());
    }
}
