package com.rentsphere.chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SendMessageRequest {
    @NotBlank(message = "Message content is required")
    @Size(max = 5000, message = "Message too long")
    private String content;

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
