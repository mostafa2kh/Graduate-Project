package com.rentsphere.media.service;

import com.rentsphere.media.dto.ImageResponse;
import com.rentsphere.media.dto.ImageUploadResult;
import com.rentsphere.media.dto.ImageValidationResponse;
import com.rentsphere.media.entity.ListingImage;
import com.rentsphere.media.entity.MediaFile;
import com.rentsphere.media.enums.MediaFileStatus;
import com.rentsphere.media.enums.StorageProvider;
import com.rentsphere.media.repository.ListingImageRepository;
import com.rentsphere.media.repository.MediaFileRepository;
import com.rentsphere.media.storage.LocalStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional
public class MediaService {

    private static final Logger log = LoggerFactory.getLogger(MediaService.class);
    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp");
    private static final long MAX_FILE_SIZE = 10L * 1024 * 1024;
    private static final long MIN_IMAGES = 3;
    private static final long MAX_IMAGES = 20;

    private final MediaFileRepository mediaFileRepository;
    private final ListingImageRepository listingImageRepository;
    private final LocalStorageService localStorageService;

    public MediaService(MediaFileRepository mediaFileRepository,
                        ListingImageRepository listingImageRepository,
                        LocalStorageService localStorageService) {
        this.mediaFileRepository = mediaFileRepository;
        this.listingImageRepository = listingImageRepository;
        this.localStorageService = localStorageService;
    }

    public List<ImageUploadResult> uploadImages(UUID listingId, List<MultipartFile> files, UUID userId) {
        long currentCount = listingImageRepository.countByListingId(listingId);
        long totalAfter = currentCount + files.size();
        if (totalAfter > MAX_IMAGES) {
            throw new IllegalArgumentException("Maximum " + MAX_IMAGES + " images per listing. You can add " + (MAX_IMAGES - currentCount) + " more.");
        }

        return files.stream().map(file -> {
            validateFile(file);
            var stored = localStorageService.store(file);

            MediaFile mediaFile = new MediaFile();
            mediaFile.setFileName(file.getOriginalFilename());
            mediaFile.setStoredFileName(stored.storedFileName());
            mediaFile.setContentType(file.getContentType());
            mediaFile.setFileSize(file.getSize());
            mediaFile.setStoragePath(stored.storagePath());
            mediaFile.setMd5Hash(stored.md5Hash());
            mediaFile.setUploadedBy(userId);
            mediaFile.setProvider(StorageProvider.LOCAL);
            mediaFile.setStatus(MediaFileStatus.ACTIVE);
            mediaFile = mediaFileRepository.save(mediaFile);

            int nextSort = (int) listingImageRepository.findByListingIdOrderBySortOrderAsc(listingId).size();
            boolean isPrimary = nextSort == 0;

            ListingImage listingImage = new ListingImage();
            listingImage.setListingId(listingId);
            listingImage.setMediaFile(mediaFile);
            listingImage.setSortOrder(nextSort);
            listingImage.setIsPrimary(isPrimary);
            listingImage = listingImageRepository.save(listingImage);

            log.info("Uploaded image {} for listing {}", mediaFile.getId(), listingId);
            return new ImageUploadResult(listingImage.getId(), mediaFile.getId(),
                    mediaFile.getFileName(), "/api/media/files/" + mediaFile.getId());
        }).toList();
    }

    @Transactional(readOnly = true)
    public List<ImageResponse> getListingImages(UUID listingId) {
        return listingImageRepository.findByListingIdOrderBySortOrderAsc(listingId)
                .stream().map(li -> {
                    MediaFile mf = li.getMediaFile();
                    ImageResponse r = new ImageResponse();
                    r.setImageId(li.getId());
                    r.setMediaFileId(mf.getId());
                    r.setFileName(mf.getFileName());
                    r.setContentType(mf.getContentType());
                    r.setFileSize(mf.getFileSize());
                    r.setIsPrimary(li.getIsPrimary());
                    r.setSortOrder(li.getSortOrder());
                    r.setUrl("/api/media/files/" + mf.getId());
                    r.setProvider(mf.getProvider());
                    r.setCreatedAt(li.getCreatedAt());
                    return r;
                }).toList();
    }

    public void deleteImage(UUID listingId, UUID imageId, UUID userId) {
        ListingImage li = listingImageRepository.findByIdAndListingId(imageId, listingId)
                .orElseThrow(() -> new IllegalArgumentException("Image not found for this listing"));

        MediaFile mf = li.getMediaFile();
        if (!mf.getUploadedBy().equals(userId)) {
            throw new SecurityException("Only the listing owner can delete images");
        }

        boolean wasPrimary = li.getIsPrimary();
        localStorageService.delete(mf.getStoragePath());
        mf.setStatus(MediaFileStatus.DELETED);
        mediaFileRepository.save(mf);
        listingImageRepository.delete(li);

        if (wasPrimary) {
            listingImageRepository.findByListingIdOrderBySortOrderAsc(listingId).stream()
                    .findFirst().ifPresent(n -> {
                        n.setIsPrimary(true);
                        listingImageRepository.save(n);
                    });
        }
    }

    public void setPrimaryImage(UUID listingId, UUID imageId, UUID userId) {
        ListingImage li = listingImageRepository.findByIdAndListingId(imageId, listingId)
                .orElseThrow(() -> new IllegalArgumentException("Image not found for this listing"));

        MediaFile mf = li.getMediaFile();
        if (!mf.getUploadedBy().equals(userId)) {
            throw new SecurityException("Only the listing owner can set primary image");
        }

        listingImageRepository.clearPrimaryByListingId(listingId);
        li.setIsPrimary(true);
        listingImageRepository.save(li);
    }

    @Transactional(readOnly = true)
    public ImageValidationResponse validateImageCount(UUID listingId) {
        long count = listingImageRepository.countByListingId(listingId);
        return new ImageValidationResponse(count, MIN_IMAGES, MAX_IMAGES);
    }

    @Transactional(readOnly = true)
    public MediaFile getMediaFile(UUID fileId) {
        return mediaFileRepository.findByIdAndStatus(fileId, MediaFileStatus.ACTIVE)
                .orElseThrow(() -> new IllegalArgumentException("File not found"));
    }

    private void validateFile(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Invalid file type: " + contentType + ". Only JPEG, PNG, and WebP are allowed.");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File too large: " + file.getSize() + " bytes. Maximum is " + MAX_FILE_SIZE + " bytes.");
        }
        if (file.getSize() == 0) {
            throw new IllegalArgumentException("File is empty");
        }
    }
}
