package com.rentsphere.notification.controller;

import com.rentsphere.notification.dto.NotificationPreferenceResponse;
import com.rentsphere.notification.dto.NotificationResponse;
import com.rentsphere.notification.security.JwtUserPrincipal;
import com.rentsphere.notification.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) { this.notificationService = notificationService; }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getNotifications(@AuthenticationPrincipal JwtUserPrincipal user,
                                                                 @RequestParam(defaultValue = "0") int page,
                                                                 @RequestParam(defaultValue = "20") int size) {
        Page<NotificationResponse> result = notificationService.getNotifications(user.userId(), page, size);
        return ok("Notifications retrieved", result);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Object>> getUnreadCount(@AuthenticationPrincipal JwtUserPrincipal user) {
        long count = notificationService.getUnreadCount(user.userId());
        return ok("Unread count retrieved", Map.of("count", count));
    }

    @PostMapping("/{notificationId}/read")
    public ResponseEntity<Map<String, Object>> markAsRead(@PathVariable UUID notificationId,
                                                           @AuthenticationPrincipal JwtUserPrincipal user) {
        notificationService.markAsRead(notificationId, user.userId());
        return ok("Marked as read", null);
    }

    @PostMapping("/read-all")
    public ResponseEntity<Map<String, Object>> markAllAsRead(@AuthenticationPrincipal JwtUserPrincipal user) {
        int updated = notificationService.markAllAsRead(user.userId());
        return ok("All marked as read", Map.of("updated", updated));
    }

    @GetMapping("/preferences")
    public ResponseEntity<Map<String, Object>> getPreferences(@AuthenticationPrincipal JwtUserPrincipal user) {
        NotificationPreferenceResponse result = notificationService.getPreferences(user.userId());
        return ok("Preferences retrieved", result);
    }

    @PutMapping("/preferences")
    public ResponseEntity<Map<String, Object>> updatePreferences(@AuthenticationPrincipal JwtUserPrincipal user,
                                                                  @RequestBody NotificationPreferenceResponse req) {
        NotificationPreferenceResponse result = notificationService.updatePreferences(user.userId(), req);
        return ok("Preferences updated", result);
    }

    private ResponseEntity<Map<String, Object>> ok(String message, Object data) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", true);
        body.put("message", message);
        body.put("data", data);
        body.put("timestamp", java.time.Instant.now().toString());
        body.put("path", "");
        return ResponseEntity.ok(body);
    }
}
