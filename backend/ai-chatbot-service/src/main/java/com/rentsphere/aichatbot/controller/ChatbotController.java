package com.rentsphere.aichatbot.controller;

import com.rentsphere.aichatbot.dto.ChatRequest;
import com.rentsphere.aichatbot.dto.ChatResponse;
import com.rentsphere.aichatbot.dto.ConversationResponse;
import com.rentsphere.aichatbot.security.JwtUserPrincipal;
import com.rentsphere.aichatbot.service.ChatbotService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai-chatbot")
public class ChatbotController {

    private final ChatbotService chatbotService;
    public ChatbotController(ChatbotService chatbotService) { this.chatbotService = chatbotService; }

    @PostMapping("/messages")
    public ResponseEntity<Map<String, Object>> sendMessage(
            @Valid @RequestBody ChatRequest req,
            @AuthenticationPrincipal JwtUserPrincipal user) {
        ChatResponse result = chatbotService.chat(req, user.userId());
        return ok("Message processed", result);
    }

    @GetMapping("/conversations/{conversationId}")
    public ResponseEntity<Map<String, Object>> getHistory(
            @PathVariable String conversationId,
            @AuthenticationPrincipal JwtUserPrincipal user) {
        ConversationResponse result = chatbotService.getHistory(conversationId, user.userId());
        return ok("Conversation retrieved", result);
    }

    @DeleteMapping("/conversations/{conversationId}")
    public ResponseEntity<Map<String, Object>> clearHistory(
            @PathVariable String conversationId,
            @AuthenticationPrincipal JwtUserPrincipal user) {
        chatbotService.clearHistory(conversationId, user.userId());
        return ok("Conversation cleared", null);
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
