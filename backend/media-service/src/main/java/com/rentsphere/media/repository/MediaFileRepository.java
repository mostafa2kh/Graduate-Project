package com.rentsphere.media.repository;

import com.rentsphere.media.entity.MediaFile;
import com.rentsphere.media.enums.MediaFileStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface MediaFileRepository extends JpaRepository<MediaFile, UUID> {
    Optional<MediaFile> findByIdAndStatus(UUID id, MediaFileStatus status);
    boolean existsByStoredFileName(String storedFileName);
}
