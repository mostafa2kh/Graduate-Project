package com.rentsphere.user.controller;

import com.rentsphere.user.dto.*;
import com.rentsphere.user.security.JwtUserPrincipal;
import com.rentsphere.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getProfile(@AuthenticationPrincipal JwtUserPrincipal principal) {
        ProfileResponse profile = userService.getProfile(principal.userId());
        return ok("Profile retrieved successfully", profile, "/api/users/me");
    }

    @PutMapping("/me")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @Valid @RequestBody ProfileRequest request) {
        ProfileResponse profile = userService.updateProfile(principal.userId(), request);
        return ok("Profile updated successfully", profile, "/api/users/me");
    }

    @GetMapping("/me/preferences")
    public ResponseEntity<Map<String, Object>> getPreferences(@AuthenticationPrincipal JwtUserPrincipal principal) {
        PreferencesResponse preferences = userService.getPreferences(principal.userId());
        return ok("Preferences retrieved successfully", preferences, "/api/users/me/preferences");
    }

    @PutMapping("/me/preferences")
    public ResponseEntity<Map<String, Object>> updatePreferences(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @Valid @RequestBody PreferencesRequest request) {
        PreferencesResponse preferences = userService.updatePreferences(principal.userId(), request);
        return ok("Preferences updated successfully", preferences, "/api/users/me/preferences");
    }

    @GetMapping("/me/verification-summary")
    public ResponseEntity<Map<String, Object>> getVerificationSummary(@AuthenticationPrincipal JwtUserPrincipal principal) {
        VerificationSummaryResponse summary = userService.getVerificationSummary(principal.userId());
        return ok("Verification summary retrieved", summary, "/api/users/me/verification-summary");
    }

    @GetMapping("/me/favorites")
    public ResponseEntity<Map<String, Object>> getFavorites(@AuthenticationPrincipal JwtUserPrincipal principal) {
        List<UUID> favorites = userService.getFavorites(principal.userId());
        return ok("Favorites retrieved successfully", favorites, "/api/users/me/favorites");
    }

    @PostMapping("/me/favorites/{listingId}")
    public ResponseEntity<Map<String, Object>> addFavorite(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @PathVariable UUID listingId,
            @RequestParam(defaultValue = "/api/users/me/favorites") String requestPath) {
        userService.addFavorite(principal.userId(), listingId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(wrap("Favorite added", null, requestPath));
    }

    @DeleteMapping("/me/favorites/{listingId}")
    public ResponseEntity<Map<String, Object>> removeFavorite(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @PathVariable UUID listingId) {
        userService.removeFavorite(principal.userId(), listingId);
        return ok("Favorite removed", null, "/api/users/me/favorites/" + listingId);
    }

    @PostMapping("/profile")
    public ResponseEntity<Map<String, Object>> createProfile(
            @AuthenticationPrincipal JwtUserPrincipal principal,
            @RequestParam(defaultValue = "false") boolean isLandlord) {
        userService.createProfile(principal.userId(), principal.email(), "", isLandlord);
        ProfileResponse profile = userService.getProfile(principal.userId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(wrap("Profile created", profile, "/api/users/profile"));
    }

    @GetMapping("/public/{userId}")
    public ResponseEntity<Map<String, Object>> getPublicProfile(@PathVariable UUID userId) {
        PublicProfileResponse profile = userService.getPublicProfile(userId);
        return ok("Public profile retrieved", profile, "/api/users/public/" + userId);
    }

    private ResponseEntity<Map<String, Object>> ok(String message, Object data, String path) {
        return ResponseEntity.ok(wrap(message, data, path));
    }

    private Map<String, Object> wrap(String message, Object data, String path) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", true);
        body.put("message", message);
        body.put("data", data);
        body.put("timestamp", Instant.now().toString());
        body.put("path", path);
        return body;
    }
}
