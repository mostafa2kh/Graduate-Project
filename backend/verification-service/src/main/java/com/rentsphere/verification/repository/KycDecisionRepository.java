package com.rentsphere.verification.repository;

import com.rentsphere.verification.entity.KycDecision;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface KycDecisionRepository extends JpaRepository<KycDecision, UUID> {
    List<KycDecision> findBySubmissionIdOrderByCreatedAtDesc(UUID submissionId);
}
