package com.rentsphere.chat.repository;

import com.rentsphere.chat.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, UUID> {

    @Query("SELECT c FROM Conversation c WHERE c.participantOne = :userId OR c.participantTwo = :userId ORDER BY c.lastMessageAt DESC NULLS LAST")
    List<Conversation> findByParticipant(@Param("userId") UUID userId);

    @Query("SELECT c FROM Conversation c WHERE (c.participantOne = :u1 AND c.participantTwo = :u2) OR (c.participantOne = :u2 AND c.participantTwo = :u1)")
    Optional<Conversation> findBetweenParticipants(@Param("u1") UUID u1, @Param("u2") UUID u2);
}
