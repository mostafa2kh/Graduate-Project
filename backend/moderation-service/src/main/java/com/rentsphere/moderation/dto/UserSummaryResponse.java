package com.rentsphere.moderation.dto;

import java.time.Instant;
import java.util.UUID;

public class UserSummaryResponse {
    private UUID userId;
    private String email;
    private String fullName;
    private String phone;
    private String role;
    private boolean enabled;
    private Instant createdAt;
    private int listingCount;
    private boolean verified;

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public int getListingCount() { return listingCount; }
    public void setListingCount(int listingCount) { this.listingCount = listingCount; }
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
}
