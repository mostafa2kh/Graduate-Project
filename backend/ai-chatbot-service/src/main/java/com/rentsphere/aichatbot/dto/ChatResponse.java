package com.rentsphere.aichatbot.dto;

import java.time.Instant;
import java.util.UUID;

public record ChatResponse(
    UUID messageId,
    String reply,
    Instant timestamp,
    String conversationId
) {}
