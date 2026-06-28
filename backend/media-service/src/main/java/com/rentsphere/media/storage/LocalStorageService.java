package com.rentsphere.media.storage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.security.DigestInputStream;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class LocalStorageService {

    private static final Logger log = LoggerFactory.getLogger(LocalStorageService.class);
    private final Path uploadDir;

    public LocalStorageService(@Value("${media.storage.local.upload-dir}") String uploadDir) {
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(uploadDir);
            log.info("Media upload directory initialized: {}", uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory: " + uploadDir, e);
        }
    }

    public StoredFile store(MultipartFile file) {
        String originalName = file.getOriginalFilename();
        String extension = extractExtension(originalName);
        String storedName = UUID.randomUUID() + (extension != null ? "." + extension : "");
        Path targetPath = uploadDir.resolve(storedName).normalize();

        if (!targetPath.startsWith(uploadDir)) {
            throw new SecurityException("Path traversal detected");
        }

        try (InputStream is = file.getInputStream();
             DigestInputStream dis = new DigestInputStream(is, MessageDigest.getInstance("MD5"))) {
            Files.copy(dis, targetPath, StandardCopyOption.REPLACE_EXISTING);
            String md5 = HexFormat.of().formatHex(dis.getMessageDigest().digest());
            return new StoredFile(storedName, targetPath.toString(), md5);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + originalName, e);
        } catch (java.security.NoSuchAlgorithmException e) {
            throw new RuntimeException("MD5 algorithm not available", e);
        }
    }

    public void delete(String storagePath) {
        try {
            Path path = Paths.get(storagePath).normalize();
            if (path.startsWith(uploadDir)) {
                Files.deleteIfExists(path);
            }
        } catch (IOException e) {
            log.warn("Failed to delete file: {}", storagePath, e);
        }
    }

    public Path load(String storedFileName) {
        Path path = uploadDir.resolve(storedFileName).normalize();
        if (!path.startsWith(uploadDir)) throw new SecurityException("Path traversal detected");
        return path;
    }

    private String extractExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) return null;
        return fileName.substring(fileName.lastIndexOf('.') + 1);
    }

    public record StoredFile(String storedFileName, String storagePath, String md5Hash) {}
}
