package com.rentsphere.user.dto;

import java.time.LocalDate;
import java.util.UUID;

public class PublicProfileResponse {

    private UUID userId;
    private String fullName;
    private String avatarUrl;
    private String city;
    private boolean verified;
    private LocalDate memberSince;

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public LocalDate getMemberSince() { return memberSince; }
    public void setMemberSince(LocalDate memberSince) { this.memberSince = memberSince; }
}
