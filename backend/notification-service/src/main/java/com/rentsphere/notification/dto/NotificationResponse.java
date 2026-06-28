package com.rentsphere.notification.dto;

import java.time.Instant;
import java.util.UUID;

public class NotificationResponse {
    private UUID id;
    private String type;
    private String title;
    private String body;
    private String data;
    private boolean isRead;
    private Instant createdAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
    public String getData() { return data; }
    public void setData(String data) { this.data = data; }
    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
