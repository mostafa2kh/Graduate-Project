package com.rentsphere.chat.repository;

import com.rentsphere.chat.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {
    List<Message> findByConversationIdOrderByCreatedAtAsc(UUID conversationId);

    long countByConversationIdAndIsReadFalseAndSenderIdNot(UUID conversationId, UUID senderId);

    @Modifying
    @Query("UPDATE Message m SET m.isRead = true WHERE m.conversationId = :convId AND m.senderId != :userId AND m.isRead = false")
    int markAsRead(@Param("convId") UUID convId, @Param("userId") UUID userId);
}
