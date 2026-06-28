package com.rentsphere.chat.dto;

import java.time.Instant;
import java.util.UUID;

public class ConversationResponse {
    private UUID id;
    private UUID listingId;
    private UUID otherParticipantId;
    private String lastMessagePreview;
    private Instant lastMessageAt;
    private long unreadCount;
    private Instant createdAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getListingId() { return listingId; }
    public void setListingId(UUID listingId) { this.listingId = listingId; }
    public UUID getOtherParticipantId() { return otherParticipantId; }
    public void setOtherParticipantId(UUID otherParticipantId) { this.otherParticipantId = otherParticipantId; }
    public String getLastMessagePreview() { return lastMessagePreview; }
    public void setLastMessagePreview(String lastMessagePreview) { this.lastMessagePreview = lastMessagePreview; }
    public Instant getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(Instant lastMessageAt) { this.lastMessageAt = lastMessageAt; }
    public long getUnreadCount() { return unreadCount; }
    public void setUnreadCount(long unreadCount) { this.unreadCount = unreadCount; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
