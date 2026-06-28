package com.rentsphere.verification.service;

import com.rentsphere.verification.dto.*;
import com.rentsphere.verification.entity.KycDecision;
import com.rentsphere.verification.entity.KycDocument;
import com.rentsphere.verification.entity.KycSubmission;
import com.rentsphere.verification.enums.VerificationStatus;
import com.rentsphere.verification.repository.KycDecisionRepository;
import com.rentsphere.verification.repository.KycDocumentRepository;
import com.rentsphere.verification.repository.KycSubmissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service @Transactional
public class VerificationService {

    private final KycSubmissionRepository submissionRepo;
    private final KycDocumentRepository documentRepo;
    private final KycDecisionRepository decisionRepo;

    public VerificationService(KycSubmissionRepository submissionRepo, KycDocumentRepository documentRepo, KycDecisionRepository decisionRepo) {
        this.submissionRepo = submissionRepo; this.documentRepo = documentRepo; this.decisionRepo = decisionRepo;
    }

    public KycSubmissionResponse submitKyc(UUID userId, KycSubmissionRequest req) {
        if (submissionRepo.existsByUserIdAndStatus(userId, VerificationStatus.PENDING))
            throw new IllegalArgumentException("You already have a pending KYC submission");
        var sub = new KycSubmission();
        sub.setUserId(userId); sub.setSubmissionType(req.getSubmissionType() != null ? req.getSubmissionType() : "INDIVIDUAL");
        sub.setNotes(req.getNotes()); sub.setStatus(VerificationStatus.PENDING);
        sub = submissionRepo.save(sub);
        return toResponse(sub);
    }

    public KycSubmissionResponse uploadDocument(UUID submissionId, UUID userId, String documentType, String fileName, long fileSize, String contentType, byte[] fileBytes) {
        var sub = submissionRepo.findById(submissionId).orElseThrow(() -> new IllegalArgumentException("Submission not found"));
        if (!sub.getUserId().equals(userId)) throw new IllegalArgumentException("Submission does not belong to you");
        if (sub.getStatus() == VerificationStatus.VERIFIED) throw new IllegalArgumentException("Cannot upload to a verified submission");
        var doc = new KycDocument();
        doc.setSubmission(sub);
        doc.setDocumentType(documentType != null ? documentType : "NATIONAL_ID");
        doc.setFileName(fileName);
        var uploadDir = System.getenv("KYC_UPLOAD_DIR");
        if (uploadDir == null) uploadDir = "/tmp/rentsphere/kyc-documents";
        var subDir = java.nio.file.Path.of(uploadDir, submissionId.toString());
        try {
            java.nio.file.Files.createDirectories(subDir);
            var storedName = UUID.randomUUID() + "_" + fileName;
            var targetPath = subDir.resolve(storedName);
            java.nio.file.Files.write(targetPath, fileBytes);
            doc.setFilePath(targetPath.toString());
        } catch (java.io.IOException e) {
            throw new RuntimeException("Failed to store document file", e);
        }
        doc.setFileSize(fileSize);
        doc.setContentType(contentType);
        documentRepo.save(doc);
        return toResponse(sub);
    }

    @Transactional(readOnly = true)
    public KycStatusResponse getMyStatus(UUID userId) {
        var subs = submissionRepo.findByUserIdOrderByCreatedAtDesc(userId);
        var resp = new KycStatusResponse();
        resp.setSubmissionCount(subs.size());
        if (subs.isEmpty()) { resp.setStatus("UNVERIFIED"); resp.setVerified(false); return resp; }
        var latest = subs.get(0);
        resp.setStatus(latest.getStatus().name());
        resp.setLatestSubmissionId(latest.getId());
        resp.setVerified(latest.getStatus() == VerificationStatus.VERIFIED);
        return resp;
    }

    @Transactional(readOnly = true)
    public List<KycSubmissionResponse> getMySubmissions(UUID userId) {
        return submissionRepo.findByUserIdOrderByCreatedAtDesc(userId).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<KycSubmissionResponse> getPendingSubmissions() {
        return submissionRepo.findByStatusOrderBySubmittedAtDesc(VerificationStatus.PENDING).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public KycSubmissionResponse getSubmissionDetail(UUID submissionId) {
        var sub = submissionRepo.findById(submissionId).orElseThrow(() -> new IllegalArgumentException("Submission not found"));
        return toResponse(sub);
    }

    public KycSubmissionResponse approveSubmission(UUID submissionId, UUID adminId) {
        var sub = submissionRepo.findById(submissionId).orElseThrow(() -> new IllegalArgumentException("Submission not found"));
        if (sub.getStatus() != VerificationStatus.PENDING) throw new IllegalArgumentException("Submission is not pending");
        sub.setStatus(VerificationStatus.VERIFIED); sub.setReviewedAt(Instant.now()); sub.setReviewedBy(adminId);
        sub = submissionRepo.save(sub);
        var dec = new KycDecision(); dec.setSubmission(sub); dec.setDecision("APPROVED"); dec.setDecidedBy(adminId);
        decisionRepo.save(dec);
        return toResponse(sub);
    }

    public KycSubmissionResponse rejectSubmission(UUID submissionId, UUID adminId, String reason) {
        var sub = submissionRepo.findById(submissionId).orElseThrow(() -> new IllegalArgumentException("Submission not found"));
        if (sub.getStatus() != VerificationStatus.PENDING) throw new IllegalArgumentException("Submission is not pending");
        sub.setStatus(VerificationStatus.REJECTED); sub.setReviewedAt(Instant.now()); sub.setReviewedBy(adminId);
        sub = submissionRepo.save(sub);
        var dec = new KycDecision(); dec.setSubmission(sub); dec.setDecision("REJECTED"); dec.setReason(reason); dec.setDecidedBy(adminId);
        decisionRepo.save(dec);
        return toResponse(sub);
    }

    private KycSubmissionResponse toResponse(KycSubmission s) {
        var r = new KycSubmissionResponse();
        r.setId(s.getId()); r.setStatus(s.getStatus().name()); r.setSubmissionType(s.getSubmissionType());
        r.setNotes(s.getNotes()); r.setSubmittedAt(s.getSubmittedAt()); r.setReviewedAt(s.getReviewedAt());
        r.setDocuments(documentRepo.findBySubmissionId(s.getId()).stream().map(d -> {
            var dr = new KycSubmissionResponse.KycDocumentResponse();
            dr.setId(d.getId()); dr.setDocumentType(d.getDocumentType()); dr.setFileName(d.getFileName());
            dr.setFileSize(d.getFileSize()); dr.setContentType(d.getContentType()); dr.setCreatedAt(d.getCreatedAt());
            return dr;
        }).toList());
        r.setDecisions(decisionRepo.findBySubmissionIdOrderByCreatedAtDesc(s.getId()).stream().map(d -> {
            var dr = new KycSubmissionResponse.KycDecisionResponse();
            dr.setId(d.getId()); dr.setDecision(d.getDecision()); dr.setReason(d.getReason());
            dr.setDecidedBy(d.getDecidedBy()); dr.setCreatedAt(d.getCreatedAt());
            return dr;
        }).toList());
        return r;
    }
}
