package com.rentsphere.notification.service;

import com.rentsphere.notification.dto.NotificationPreferenceResponse;
import com.rentsphere.notification.dto.NotificationResponse;
import com.rentsphere.notification.entity.NotificationPreference;
import com.rentsphere.notification.repository.NotificationPreferenceRepository;
import com.rentsphere.notification.repository.NotificationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;
import com.rentsphere.notification.entity.Notification;

@Service
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepo;
    private final NotificationPreferenceRepository preferenceRepo;

    public NotificationService(NotificationRepository notificationRepo, NotificationPreferenceRepository preferenceRepo) {
        this.notificationRepo = notificationRepo;
        this.preferenceRepo = preferenceRepo;
    }

    @Transactional(readOnly = true)
    public Page<NotificationResponse> getNotifications(UUID userId, int page, int size) {
        return notificationRepo.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(page, size))
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(UUID userId) {
        return notificationRepo.countByUserIdAndIsReadFalse(userId);
    }

    public void markAsRead(UUID notificationId, UUID userId) {
        if (!notificationRepo.existsByIdAndUserId(notificationId, userId))
            throw new IllegalArgumentException("Notification not found");
        Notification n = notificationRepo.findById(notificationId).orElseThrow();
        n.setRead(true);
        notificationRepo.save(n);
    }

    public int markAllAsRead(UUID userId) {
        return notificationRepo.markAllAsRead(userId);
    }

    public NotificationResponse createNotification(UUID userId, String type, String title, String body, String data) {
        Notification n = new Notification();
        n.setUserId(userId);
        n.setType(type);
        n.setTitle(title);
        n.setBody(body);
        n.setData(data);
        n = notificationRepo.save(n);
        return toResponse(n);
    }

    @Transactional(readOnly = true)
    public NotificationPreferenceResponse getPreferences(UUID userId) {
        return preferenceRepo.findByUserId(userId)
                .map(this::toPrefResponse)
                .orElseGet(NotificationPreferenceResponse::new);
    }

    public NotificationPreferenceResponse updatePreferences(UUID userId, NotificationPreferenceResponse req) {
        NotificationPreference pref = preferenceRepo.findByUserId(userId).orElseGet(() -> {
            NotificationPreference p = new NotificationPreference();
            p.setUserId(userId);
            return p;
        });
        pref.setEmailNotifications(req.isEmailNotifications());
        pref.setPushNotifications(req.isPushNotifications());
        pref.setListingUpdates(req.isListingUpdates());
        pref.setBookingUpdates(req.isBookingUpdates());
        pref.setMessageAlerts(req.isMessageAlerts());
        pref.setAdminAnnouncements(req.isAdminAnnouncements());
        preferenceRepo.save(pref);
        return toPrefResponse(pref);
    }

    private NotificationResponse toResponse(Notification n) {
        NotificationResponse r = new NotificationResponse();
        r.setId(n.getId());
        r.setType(n.getType());
        r.setTitle(n.getTitle());
        r.setBody(n.getBody());
        r.setData(n.getData());
        r.setRead(n.isRead());
        r.setCreatedAt(n.getCreatedAt());
        return r;
    }

    private NotificationPreferenceResponse toPrefResponse(NotificationPreference p) {
        NotificationPreferenceResponse r = new NotificationPreferenceResponse();
        r.setEmailNotifications(p.isEmailNotifications());
        r.setPushNotifications(p.isPushNotifications());
        r.setListingUpdates(p.isListingUpdates());
        r.setBookingUpdates(p.isBookingUpdates());
        r.setMessageAlerts(p.isMessageAlerts());
        r.setAdminAnnouncements(p.isAdminAnnouncements());
        return r;
    }
}
