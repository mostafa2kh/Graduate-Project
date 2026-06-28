package com.rentsphere.audit.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "audit_events", indexes = {
    @Index(name = "idx_audit_event_type", columnList = "event_type"),
    @Index(name = "idx_audit_actor", columnList = "actor_id"),
    @Index(name = "idx_audit_target", columnList = "target_type, target_id"),
    @Index(name = "idx_audit_created", columnList = "created_at")
})
public class AuditEvent {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "event_type", nullable = false, length = 64) private String eventType;
    @Column(name = "actor_id") private UUID actorId;
    @Column(name = "actor_role", length = 32) private String actorRole;
    @Column(name = "target_type", length = 64) private String targetType;
    @Column(name = "target_id", length = 128) private String targetId;
    @Column(nullable = false, length = 128) private String action;
    @Column(columnDefinition = "TEXT") private String details;
    @Column(nullable = false, length = 64) private String source;
    @Column(name = "ip_address", length = 45) private String ipAddress;
    @Column(name = "user_agent", length = 512) private String userAgent;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;

    @PrePersist
    protected void onCreate() { if (createdAt == null) createdAt = Instant.now(); }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public UUID getActorId() { return actorId; }
    public void setActorId(UUID actorId) { this.actorId = actorId; }
    public String getActorRole() { return actorRole; }
    public void setActorRole(String actorRole) { this.actorRole = actorRole; }
    public String getTargetType() { return targetType; }
    public void setTargetType(String targetType) { this.targetType = targetType; }
    public String getTargetId() { return targetId; }
    public void setTargetId(String targetId) { this.targetId = targetId; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
