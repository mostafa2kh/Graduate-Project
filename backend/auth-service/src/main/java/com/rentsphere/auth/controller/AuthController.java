package com.rentsphere.auth.controller;

import com.rentsphere.auth.dto.*;
import com.rentsphere.auth.security.JwtUserPrincipal;
import com.rentsphere.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse authResponse = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(wrap("User registered successfully", authResponse, "/api/auth/register"));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(wrap("Login successful", authResponse, "/api/auth/login"));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        return ResponseEntity.ok(wrap("Logged out successfully", null, "/api/auth/logout"));
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me(@AuthenticationPrincipal JwtUserPrincipal principal) {
        UserResponse user = authService.getCurrentUser(principal.userId());
        return ResponseEntity.ok(wrap("User retrieved successfully", user, "/api/auth/me"));
    }

    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validate(@AuthenticationPrincipal JwtUserPrincipal principal) {
        return ResponseEntity.ok(wrap("Token is valid", Map.of(
                "userId", principal.userId(),
                "email", principal.email(),
                "roles", principal.roles()
        ), "/api/auth/validate"));
    }

    private Map<String, Object> wrap(String message, Object data, String path) {
        Map<String, Object> body = new java.util.LinkedHashMap<>();
        body.put("success", true);
        body.put("message", message);
        body.put("data", data);
        body.put("timestamp", java.time.Instant.now().toString());
        body.put("path", path);
        return body;
    }
}
