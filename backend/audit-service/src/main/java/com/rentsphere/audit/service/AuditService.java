package com.rentsphere.audit.service;

import com.rentsphere.audit.dto.*;
import com.rentsphere.audit.entity.AuditEvent;
import com.rentsphere.audit.repository.AuditEventRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class AuditService {
    private final AuditEventRepository repository;
    public AuditService(AuditEventRepository repository) { this.repository = repository; }

    public AuditEventResponse createEvent(CreateAuditEventRequest request) {
        AuditEvent event = new AuditEvent();
        event.setEventType(request.eventType());
        event.setActorId(request.actorId());
        event.setActorRole(request.actorRole());
        event.setTargetType(request.targetType());
        event.setTargetId(request.targetId());
        event.setAction(request.action());
        event.setDetails(request.details());
        event.setSource(request.source());
        event.setIpAddress(request.ipAddress());
        event.setUserAgent(request.userAgent());
        return toResponse(repository.save(event));
    }

    @Transactional(readOnly = true)
    public PagedAuditResponse listEvents(UUID actorId, String action, String targetType, String eventType,
                                          Instant dateFrom, Instant dateTo, int page, int size) {
        PageRequest pr = PageRequest.of(Math.max(0, page), Math.max(1, Math.min(100, size)));
        Specification<AuditEvent> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (actorId != null) predicates.add(cb.equal(root.get("actorId"), actorId));
            if (action != null) predicates.add(cb.equal(root.get("action"), action));
            if (targetType != null) predicates.add(cb.equal(root.get("targetType"), targetType));
            if (eventType != null) predicates.add(cb.equal(root.get("eventType"), eventType));
            if (dateFrom != null) predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), dateFrom));
            if (dateTo != null) predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), dateTo));
            return cb.and(predicates.toArray(Predicate[]::new));
        };
        Page<AuditEvent> result = repository.findAll(spec, pr);
        return new PagedAuditResponse(
            result.getContent().stream().map(this::toResponse).toList(),
            result.getNumber(), result.getSize(), result.getTotalElements(), result.getTotalPages()
        );
    }

    @Transactional(readOnly = true)
    public Optional<AuditEventResponse> getEvent(UUID eventId) {
        return repository.findById(eventId).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public List<RecentActivityResponse> getRecentActivity() {
        return repository.findTop10ByOrderByCreatedAtDesc().stream().map(e -> new RecentActivityResponse(
            e.getId(), e.getEventType(), e.getAction(),
            e.getActorId() != null ? e.getActorId().toString() : "SYSTEM",
            e.getTargetType() != null ? e.getTargetType() + " " + e.getTargetId() : "N/A",
            e.getCreatedAt()
        )).toList();
    }

    private AuditEventResponse toResponse(AuditEvent e) {
        return new AuditEventResponse(e.getId(), e.getEventType(), e.getActorId(), e.getActorRole(),
            e.getTargetType(), e.getTargetId(), e.getAction(), e.getDetails(), e.getSource(),
            e.getIpAddress(), e.getUserAgent(), e.getCreatedAt());
    }
}
