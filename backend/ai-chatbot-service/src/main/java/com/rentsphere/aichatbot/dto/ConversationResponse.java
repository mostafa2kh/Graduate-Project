package com.rentsphere.aichatbot.dto;

import java.time.Instant;
import java.util.List;

public record ConversationResponse(
    String conversationId,
    int messageCount,
    Instant lastActivity,
    List<ChatMessage> messages
) {
    public record ChatMessage(String role, String content, Instant timestamp) {}
}
