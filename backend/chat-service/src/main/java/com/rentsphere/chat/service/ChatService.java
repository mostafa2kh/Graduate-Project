package com.rentsphere.chat.service;

import com.rentsphere.chat.dto.*;
import com.rentsphere.chat.entity.Conversation;
import com.rentsphere.chat.entity.Message;
import com.rentsphere.chat.repository.ConversationRepository;
import com.rentsphere.chat.repository.MessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ChatService {

    private final ConversationRepository conversationRepo;
    private final MessageRepository messageRepo;

    public ChatService(ConversationRepository conversationRepo, MessageRepository messageRepo) {
        this.conversationRepo = conversationRepo;
        this.messageRepo = messageRepo;
    }

    public ConversationResponse createOrGetThread(UUID currentUserId, CreateThreadRequest req) {
        UUID otherId = req.getOtherParticipantId();
        if (currentUserId.equals(otherId))
            throw new IllegalArgumentException("Cannot chat with yourself");

        Conversation conv = conversationRepo.findBetweenParticipants(currentUserId, otherId)
                .orElseGet(() -> {
                    Conversation c = new Conversation();
                    c.setParticipantOne(currentUserId);
                    c.setParticipantTwo(otherId);
                    c.setListingId(req.getListingId());
                    return conversationRepo.save(c);
                });

        return toConversationResponse(conv, currentUserId);
    }

    @Transactional(readOnly = true)
    public List<ConversationResponse> getMyThreads(UUID userId) {
        return conversationRepo.findByParticipant(userId).stream()
                .map(c -> toConversationResponse(c, userId))
                .sorted(Comparator.comparing(ConversationResponse::getLastMessageAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    @Transactional(readOnly = true)
    public ConversationResponse getThreadDetail(UUID threadId, UUID userId) {
        Conversation conv = conversationRepo.findById(threadId)
                .orElseThrow(() -> new IllegalArgumentException("Thread not found"));
        if (!conv.getParticipantOne().equals(userId) && !conv.getParticipantTwo().equals(userId))
            throw new IllegalArgumentException("Access denied");
        return toConversationResponse(conv, userId);
    }

    @Transactional(readOnly = true)
    public List<MessageResponse> getMessages(UUID threadId, UUID userId) {
        Conversation conv = conversationRepo.findById(threadId)
                .orElseThrow(() -> new IllegalArgumentException("Thread not found"));
        if (!conv.getParticipantOne().equals(userId) && !conv.getParticipantTwo().equals(userId))
            throw new IllegalArgumentException("Access denied");
        return messageRepo.findByConversationIdOrderByCreatedAtAsc(threadId).stream()
                .map(this::toMessageResponse).toList();
    }

    public MessageResponse sendMessage(UUID threadId, UUID senderId, SendMessageRequest req) {
        if (req.getContent() == null || req.getContent().trim().isEmpty())
            throw new IllegalArgumentException("Message cannot be empty");

        Conversation conv = conversationRepo.findById(threadId)
                .orElseThrow(() -> new IllegalArgumentException("Thread not found"));
        if (!conv.getParticipantOne().equals(senderId) && !conv.getParticipantTwo().equals(senderId))
            throw new IllegalArgumentException("Access denied");

        Message msg = new Message();
        msg.setConversationId(threadId);
        msg.setSenderId(senderId);
        msg.setContent(req.getContent().trim());
        msg = messageRepo.save(msg);

        conv.setLastMessageAt(msg.getCreatedAt());
        conv.setLastMessagePreview(msg.getContent().length() > 100 ? msg.getContent().substring(0, 100) + "..." : msg.getContent());
        conversationRepo.save(conv);

        return toMessageResponse(msg);
    }

    public int markAsRead(UUID threadId, UUID userId) {
        Conversation conv = conversationRepo.findById(threadId)
                .orElseThrow(() -> new IllegalArgumentException("Thread not found"));
        if (!conv.getParticipantOne().equals(userId) && !conv.getParticipantTwo().equals(userId))
            throw new IllegalArgumentException("Access denied");
        return messageRepo.markAsRead(threadId, userId);
    }

    @Transactional(readOnly = true)
    public UnreadCountResponse getUnreadCount(UUID userId) {
        List<Conversation> conversations = conversationRepo.findByParticipant(userId);
        long total = conversations.stream()
                .mapToLong(c -> messageRepo.countByConversationIdAndIsReadFalseAndSenderIdNot(c.getId(), userId))
                .sum();
        return new UnreadCountResponse(total);
    }

    private ConversationResponse toConversationResponse(Conversation c, UUID currentUserId) {
        ConversationResponse r = new ConversationResponse();
        r.setId(c.getId());
        r.setListingId(c.getListingId());
        r.setOtherParticipantId(c.getParticipantOne().equals(currentUserId) ? c.getParticipantTwo() : c.getParticipantOne());
        r.setLastMessagePreview(c.getLastMessagePreview());
        r.setLastMessageAt(c.getLastMessageAt());
        r.setUnreadCount(messageRepo.countByConversationIdAndIsReadFalseAndSenderIdNot(c.getId(), currentUserId));
        r.setCreatedAt(c.getCreatedAt());
        return r;
    }

    private MessageResponse toMessageResponse(Message m) {
        MessageResponse r = new MessageResponse();
        r.setId(m.getId());
        r.setConversationId(m.getConversationId());
        r.setSenderId(m.getSenderId());
        r.setContent(m.getContent());
        r.setRead(m.isRead());
        r.setCreatedAt(m.getCreatedAt());
        return r;
    }
}
