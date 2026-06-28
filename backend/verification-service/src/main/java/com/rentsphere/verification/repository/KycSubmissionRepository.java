package com.rentsphere.verification.repository;

import com.rentsphere.verification.entity.KycSubmission;
import com.rentsphere.verification.enums.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface KycSubmissionRepository extends JpaRepository<KycSubmission, UUID> {
    List<KycSubmission> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<KycSubmission> findByStatusOrderBySubmittedAtDesc(VerificationStatus status);
    long countByStatus(VerificationStatus status);
    boolean existsByUserIdAndStatus(UUID userId, VerificationStatus status);
}
