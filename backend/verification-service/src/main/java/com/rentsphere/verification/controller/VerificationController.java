package com.rentsphere.verification.controller;

import com.rentsphere.verification.dto.*;
import com.rentsphere.verification.security.JwtUserPrincipal;
import com.rentsphere.verification.service.VerificationService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class VerificationController {

    private final VerificationService verificationService;
    public VerificationController(VerificationService verificationService) { this.verificationService = verificationService; }

    @PostMapping("/verification/me/submit")
    public ResponseEntity<KycSubmissionResponse> submitKyc(@RequestBody KycSubmissionRequest req, @AuthenticationPrincipal JwtUserPrincipal p) {
        return ResponseEntity.ok(verificationService.submitKyc(p.userId(), req));
    }

    @GetMapping("/verification/me/status")
    public ResponseEntity<KycStatusResponse> getStatus(@AuthenticationPrincipal JwtUserPrincipal p) {
        return ResponseEntity.ok(verificationService.getMyStatus(p.userId()));
    }

    @GetMapping("/verification/me/submissions")
    public ResponseEntity<List<KycSubmissionResponse>> getMySubmissions(@AuthenticationPrincipal JwtUserPrincipal p) {
        return ResponseEntity.ok(verificationService.getMySubmissions(p.userId()));
    }

    @PostMapping(value = "/verification/me/submissions/{submissionId}/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<KycSubmissionResponse> uploadDocument(
            @PathVariable UUID submissionId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "documentType", defaultValue = "NATIONAL_ID") String documentType,
            @AuthenticationPrincipal JwtUserPrincipal p) throws IOException {
        return ResponseEntity.ok(verificationService.uploadDocument(
                submissionId, p.userId(), documentType,
                file.getOriginalFilename(), file.getSize(),
                file.getContentType(), file.getBytes()));
    }

    @GetMapping("/admin/verification/submissions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<KycSubmissionResponse>> getPendingSubmissions() {
        return ResponseEntity.ok(verificationService.getPendingSubmissions());
    }

    @GetMapping("/admin/verification/submissions/{submissionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<KycSubmissionResponse> getSubmissionDetail(@PathVariable UUID submissionId) {
        return ResponseEntity.ok(verificationService.getSubmissionDetail(submissionId));
    }

    @PostMapping("/admin/verification/submissions/{submissionId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<KycSubmissionResponse> approveSubmission(@PathVariable UUID submissionId, @AuthenticationPrincipal JwtUserPrincipal p) {
        return ResponseEntity.ok(verificationService.approveSubmission(submissionId, p.userId()));
    }

    @PostMapping("/admin/verification/submissions/{submissionId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<KycSubmissionResponse> rejectSubmission(@PathVariable UUID submissionId, @Valid @RequestBody KycAdminDecisionRequest req, @AuthenticationPrincipal JwtUserPrincipal p) {
        return ResponseEntity.ok(verificationService.rejectSubmission(submissionId, p.userId(), req.getReason()));
    }
}
