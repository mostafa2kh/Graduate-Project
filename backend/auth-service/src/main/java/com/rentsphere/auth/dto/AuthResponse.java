package com.rentsphere.auth.dto;

import java.util.List;
import java.util.UUID;

public class AuthResponse {

    private UUID userId;
    private String email;
    private String fullName;
    private List<String> roles;
    private String accessToken;
    private String tokenType;
    private long expiresIn;

    public AuthResponse() {
        this.tokenType = "Bearer";
    }

    public AuthResponse(UUID userId, String email, String fullName,
                        List<String> roles, String accessToken, long expiresIn) {
        this();
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.roles = roles;
        this.accessToken = accessToken;
        this.expiresIn = expiresIn;
    }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }
    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    public String getTokenType() { return tokenType; }
    public long getExpiresIn() { return expiresIn; }
    public void setExpiresIn(long expiresIn) { this.expiresIn = expiresIn; }
}
