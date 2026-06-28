package com.rentsphere.user.service;

import com.rentsphere.user.dto.*;
import com.rentsphere.user.entity.FavoriteListing;
import com.rentsphere.user.entity.UserPreference;
import com.rentsphere.user.entity.UserProfile;
import com.rentsphere.user.mapper.UserMapper;
import com.rentsphere.user.repository.FavoriteListingRepository;
import com.rentsphere.user.repository.UserPreferenceRepository;
import com.rentsphere.user.repository.UserProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserProfileRepository profileRepository;
    private final UserPreferenceRepository preferenceRepository;
    private final FavoriteListingRepository favoriteRepository;

    public UserService(UserProfileRepository profileRepository,
                       UserPreferenceRepository preferenceRepository,
                       FavoriteListingRepository favoriteRepository) {
        this.profileRepository = profileRepository;
        this.preferenceRepository = preferenceRepository;
        this.favoriteRepository = favoriteRepository;
    }

    @Transactional
    public UserProfile createProfile(UUID userId, String email, String fullName, boolean isLandlord) {
        UserProfile profile = new UserProfile();
        profile.setUserId(userId);
        profile.setEmail(email);
        profile.setFullName(fullName);
        profile.setRenter(!isLandlord);
        profile.setLandlord(isLandlord);
        return profileRepository.save(profile);
    }

    public ProfileResponse getProfile(UUID userId) {
        UserProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        return UserMapper.toProfileResponse(profile);
    }

    @Transactional
    public ProfileResponse updateProfile(UUID userId, ProfileRequest request) {
        UserProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        profile.setFullName(request.getFullName());
        if (request.getPhone() != null) profile.setPhone(request.getPhone());
        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getCity() != null) profile.setCity(request.getCity());
        if (request.getArea() != null) profile.setArea(request.getArea());
        if (request.getDateOfBirth() != null) profile.setDateOfBirth(request.getDateOfBirth());

        profileRepository.save(profile);
        return UserMapper.toProfileResponse(profile);
    }

    public PublicProfileResponse getPublicProfile(UUID userId) {
        UserProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        return UserMapper.toPublicProfileResponse(profile);
    }

    public PreferencesResponse getPreferences(UUID userId) {
        UserPreference pref = preferenceRepository.findByUserId(userId)
                .orElse(new UserPreference());
        if (pref.getUserId() == null) {
            pref.setUserId(userId);
            preferenceRepository.save(pref);
        }
        return UserMapper.toPreferencesResponse(pref);
    }

    @Transactional
    public PreferencesResponse updatePreferences(UUID userId, PreferencesRequest request) {
        UserPreference pref = preferenceRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserPreference p = new UserPreference();
                    p.setUserId(userId);
                    return p;
                });

        if (request.getMinPrice() != null) pref.setMinPrice(request.getMinPrice());
        if (request.getMaxPrice() != null) pref.setMaxPrice(request.getMaxPrice());
        if (request.getPreferredBedrooms() != null) pref.setPreferredBedrooms(request.getPreferredBedrooms());
        if (request.getPreferredBathrooms() != null) pref.setPreferredBathrooms(request.getPreferredBathrooms());
        if (request.getPropertyType() != null) pref.setPropertyType(request.getPropertyType());
        if (request.getFurnished() != null) pref.setFurnished(request.getFurnished());
        if (request.getNotificationEmail() != null) pref.setNotificationEmail(request.getNotificationEmail());
        if (request.getNotificationPush() != null) pref.setNotificationPush(request.getNotificationPush());
        if (request.getNotificationSms() != null) pref.setNotificationSms(request.getNotificationSms());

        preferenceRepository.save(pref);
        return UserMapper.toPreferencesResponse(pref);
    }

    public VerificationSummaryResponse getVerificationSummary(UUID userId) {
        UserProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        String message = switch (profile.getVerificationStatus()) {
            case "verified" -> "Your identity has been verified";
            case "pending" -> "Your verification is being reviewed";
            case "rejected" -> "Your verification was rejected";
            default -> "Submit your documents to get verified";
        };

        return new VerificationSummaryResponse(profile.isVerified(), profile.getVerificationStatus(), message);
    }

    public List<UUID> getFavorites(UUID userId) {
        return favoriteRepository.findByUserId(userId).stream()
                .map(FavoriteListing::getListingId)
                .toList();
    }

    @Transactional
    public void addFavorite(UUID userId, UUID listingId) {
        if (!favoriteRepository.existsByUserIdAndListingId(userId, listingId)) {
            FavoriteListing fav = new FavoriteListing();
            fav.setUserId(userId);
            fav.setListingId(listingId);
            favoriteRepository.save(fav);
        }
    }

    @Transactional
    public void removeFavorite(UUID userId, UUID listingId) {
        favoriteRepository.deleteByUserIdAndListingId(userId, listingId);
    }
}
