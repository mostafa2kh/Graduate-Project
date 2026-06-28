package com.rentsphere.media.controller;

import com.rentsphere.media.dto.ImageResponse;
import com.rentsphere.media.dto.ImageUploadResult;
import com.rentsphere.media.dto.ImageValidationResponse;
import com.rentsphere.media.security.JwtUserPrincipal;
import com.rentsphere.media.service.MediaService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/media")
public class MediaController {

    private final MediaService mediaService;

    public MediaController(MediaService mediaService) {
        this.mediaService = mediaService;
    }

    @PostMapping("/listings/{listingId}/images")
    public ResponseEntity<List<ImageUploadResult>> uploadImages(
            @PathVariable UUID listingId,
            @RequestParam("files") List<MultipartFile> files,
            @AuthenticationPrincipal JwtUserPrincipal principal) {
        return ResponseEntity.ok(mediaService.uploadImages(listingId, files, principal.userId()));
    }

    @GetMapping("/listings/{listingId}/images")
    public ResponseEntity<List<ImageResponse>> getListingImages(@PathVariable UUID listingId) {
        return ResponseEntity.ok(mediaService.getListingImages(listingId));
    }

    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<Void> deleteImage(
            @PathVariable UUID imageId,
            @RequestParam UUID listingId,
            @AuthenticationPrincipal JwtUserPrincipal principal) {
        mediaService.deleteImage(listingId, imageId, principal.userId());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/listings/{listingId}/images/{imageId}/primary")
    public ResponseEntity<Void> setPrimaryImage(
            @PathVariable UUID listingId,
            @PathVariable UUID imageId,
            @AuthenticationPrincipal JwtUserPrincipal principal) {
        mediaService.setPrimaryImage(listingId, imageId, principal.userId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/listings/{listingId}/validation")
    public ResponseEntity<ImageValidationResponse> validateImageCount(@PathVariable UUID listingId) {
        return ResponseEntity.ok(mediaService.validateImageCount(listingId));
    }

    @GetMapping("/files/{fileId}")
    public ResponseEntity<Resource> serveFile(@PathVariable UUID fileId) {
        var mediaFile = mediaService.getMediaFile(fileId);
        try {
            var path = mediaFile.getStoragePath();
            Resource resource = new UrlResource(java.net.URI.create("file:" + path).toURL());
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(mediaFile.getContentType()))
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "inline; filename=\"" + mediaFile.getFileName() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
