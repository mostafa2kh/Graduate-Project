package com.rentsphere.aichatbot.service;

import com.rentsphere.aichatbot.dto.ChatRequest;
import com.rentsphere.aichatbot.dto.ChatResponse;
import com.rentsphere.aichatbot.dto.ConversationResponse;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChatbotService {

    private final Map<String, List<ConversationResponse.ChatMessage>> conversations = new ConcurrentHashMap<>();

    public ChatResponse chat(ChatRequest req, UUID userId) {
        String convId = req.context() != null ? req.context() : userId.toString();
        var history = conversations.computeIfAbsent(convId, k -> new ArrayList<>());

        history.add(new ConversationResponse.ChatMessage("user", req.message(), Instant.now()));

        String reply = generateReply(req.message(), req.listingId());
        history.add(new ConversationResponse.ChatMessage("assistant", reply, Instant.now()));

        return new ChatResponse(UUID.randomUUID(), reply, Instant.now(), convId);
    }

    public ConversationResponse getHistory(String conversationId, UUID userId) {
        var msgs = conversations.getOrDefault(conversationId, List.of());
        var last = msgs.isEmpty() ? Instant.now() : msgs.getLast().timestamp();
        return new ConversationResponse(conversationId, msgs.size(), last, msgs);
    }

    public void clearHistory(String conversationId, UUID userId) {
        conversations.remove(conversationId);
    }

    private String generateReply(String message, String listingId) {
        String lower = message.toLowerCase();

        if (lower.contains("hello") || lower.contains("hi") || lower.contains("hey"))
            return "Hello! I'm your RentSphere AI assistant. How can I help you today?";

        if (lower.contains("help"))
            return "I can help you with:\n- Finding listings and properties\n- Answering questions about the platform\n- Explaining booking and payment processes\n- KYC and verification steps\n- Account management\n\nWhat would you like to know?";

        if (lower.contains("listing") || lower.contains("property") || lower.contains("apartment"))
            return "You can browse available listings on the Search page. Use filters like city, price range, and property type to find your perfect place. Each listing includes photos, amenities, and trust scores to help you decide.";

        if (lower.contains("book") || lower.contains("reserve") || lower.contains("rent"))
            return "To book a listing, go to the listing details and click \"Book Now\". You'll select your dates and submit a booking request. The landlord will review and accept it. Once accepted, you can proceed with payment.";

        if (lower.contains("pay") || lower.contains("payment") || lower.contains("price"))
            return "RentSphere uses a secure payment system. After your booking is accepted, you can make a mock payment from the booking details page. All transactions are tracked in your payment history.";

        if (lower.contains("kyc") || lower.contains("verify") || lower.contains("verification"))
            return "KYC (Know Your Customer) verification is required for certain actions. Go to Settings > KYC Verification to submit your documents. You'll need a government ID, proof of address, and a selfie.";

        if (lower.contains("chat") || lower.contains("message") || lower.contains("contact"))
            return "You can message landlords directly from listing pages using the \"Contact Landlord\" button. All your conversations are available in the Chat section of your dashboard.";

        if (lower.contains("review") || lower.contains("trust") || lower.contains("score"))
            return "Each listing has a Trust Score (0-100) calculated by our AI based on various factors. You can see it on listing cards and detail pages. After staying, you can leave a review for the property.";

        if (lower.contains("admin") || lower.contains("moderat"))
            return "Administrators can access the admin dashboard to review pending listings, manage users, handle KYC submissions, and view audit logs. Admin features require ROLE_ADMIN privileges.";

        if (lower.contains("cancel") || lower.contains("refund"))
            return "To cancel a booking, go to your bookings and click \"Cancel\". Refund eligibility depends on the landlord's cancellation policy. Contact support for specific refund inquiries.";

        if (listingId != null && !listingId.isBlank())
            return "I see you're looking at a specific listing. You can check the listing details for pricing, availability calendar, amenities, and photos. Would you like to know more about the booking process for this property?";

        return "I'm not sure I understand. Could you rephrase your question? You can ask me about listings, bookings, payments, KYC verification, or any other RentSphere feature.";
    }
}
