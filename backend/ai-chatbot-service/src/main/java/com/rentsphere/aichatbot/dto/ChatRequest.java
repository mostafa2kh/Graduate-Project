package com.rentsphere.aichatbot.dto;

import jakarta.validation.constraints.NotBlank;

public record ChatRequest(
    @NotBlank String message,
    String listingId,
    String context
) {}
