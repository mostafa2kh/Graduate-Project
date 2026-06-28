package com.rentsphere.auth.security;

import java.util.List;
import java.util.UUID;

public record JwtUserPrincipal(UUID userId, String email, List<String> roles) {
}
