package com.rentsphere.verification.repository;

import com.rentsphere.verification.entity.KycDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface KycDocumentRepository extends JpaRepository<KycDocument, UUID> {
    List<KycDocument> findBySubmissionId(UUID submissionId);
}
