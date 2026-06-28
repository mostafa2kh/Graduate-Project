package com.rentsphere.media.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.List;
import java.util.UUID;

@Component
public class JwtTokenProvider {

    private static final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);
    private final SecretKey secretKey;

    public JwtTokenProvider(@Value("${jwt.secret}") String secret) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public UUID getUserIdFromToken(String token) { return UUID.fromString(parseToken(token).getSubject()); }
    public String getEmailFromToken(String token) { return parseToken(token).get("email", String.class); }
    @SuppressWarnings("unchecked")
    public List<String> getRolesFromToken(String token) { return parseToken(token).get("roles", List.class); }

    public boolean validateToken(String token) {
        try { parseToken(token); return true; }
        catch (JwtException | IllegalArgumentException e) { log.warn("Invalid JWT token: {}", e.getMessage()); return false; }
    }

    private Claims parseToken(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload();
    }
}
