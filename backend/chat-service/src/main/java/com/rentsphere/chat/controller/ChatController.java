package com.rentsphere.chat.controller;

import com.rentsphere.chat.dto.*;
import com.rentsphere.chat.security.JwtUserPrincipal;
import com.rentsphere.chat.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) { this.chatService = chatService; }

    @PostMapping("/threads")
    public ResponseEntity<Map<String, Object>> createThread(@Valid @RequestBody CreateThreadRequest req,
                                                             @AuthenticationPrincipal JwtUserPrincipal user) {
        ConversationResponse result = chatService.createOrGetThread(user.userId(), req);
        return ok("Thread created", result);
    }

    @GetMapping("/threads")
    public ResponseEntity<Map<String, Object>> getMyThreads(@AuthenticationPrincipal JwtUserPrincipal user) {
        List<ConversationResponse> result = chatService.getMyThreads(user.userId());
        return ok("Threads retrieved", result);
    }

    @GetMapping("/threads/{threadId}")
    public ResponseEntity<Map<String, Object>> getThreadDetail(@PathVariable UUID threadId,
                                                                @AuthenticationPrincipal JwtUserPrincipal user) {
        ConversationResponse result = chatService.getThreadDetail(threadId, user.userId());
        return ok("Thread details retrieved", result);
    }

    @GetMapping("/threads/{threadId}/messages")
    public ResponseEntity<Map<String, Object>> getMessages(@PathVariable UUID threadId,
                                                            @AuthenticationPrincipal JwtUserPrincipal user) {
        List<MessageResponse> result = chatService.getMessages(threadId, user.userId());
        return ok("Messages retrieved", result);
    }

    @PostMapping("/threads/{threadId}/messages")
    public ResponseEntity<Map<String, Object>> sendMessage(@PathVariable UUID threadId,
                                                            @Valid @RequestBody SendMessageRequest req,
                                                            @AuthenticationPrincipal JwtUserPrincipal user) {
        MessageResponse result = chatService.sendMessage(threadId, user.userId(), req);
        return ok("Message sent", result);
    }

    @PostMapping("/threads/{threadId}/read")
    public ResponseEntity<Map<String, Object>> markAsRead(@PathVariable UUID threadId,
                                                           @AuthenticationPrincipal JwtUserPrincipal user) {
        int updated = chatService.markAsRead(threadId, user.userId());
        return ok("Marked as read", Map.of("updated", updated));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Object>> getUnreadCount(@AuthenticationPrincipal JwtUserPrincipal user) {
        UnreadCountResponse result = chatService.getUnreadCount(user.userId());
        return ok("Unread count retrieved", result);
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
