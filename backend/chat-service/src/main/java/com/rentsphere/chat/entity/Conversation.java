package com.rentsphere.chat.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "conversations", indexes = {
    @Index(name = "idx_conv_p1", columnList = "participant_one"),
    @Index(name = "idx_conv_p2", columnList = "participant_two")
})
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "listing_id")
    private UUID listingId;

    @Column(name = "participant_one", nullable = false)
    private UUID participantOne;

    @Column(name = "participant_two", nullable = false)
    private UUID participantTwo;

    @Column(name = "last_message_at")
    private Instant lastMessageAt;

    @Column(name = "last_message_preview", length = 256)
    private String lastMessagePreview;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public Conversation() {}

    @PrePersist
    protected void onCreate() { createdAt = Instant.now(); }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getListingId() { return listingId; }
    public void setListingId(UUID listingId) { this.listingId = listingId; }
    public UUID getParticipantOne() { return participantOne; }
    public void setParticipantOne(UUID participantOne) { this.participantOne = participantOne; }
    public UUID getParticipantTwo() { return participantTwo; }
    public void setParticipantTwo(UUID participantTwo) { this.participantTwo = participantTwo; }
    public Instant getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(Instant lastMessageAt) { this.lastMessageAt = lastMessageAt; }
    public String getLastMessagePreview() { return lastMessagePreview; }
    public void setLastMessagePreview(String lastMessagePreview) { this.lastMessagePreview = lastMessagePreview; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
