package com.rentsphere.user.mapper;

import com.rentsphere.user.dto.PreferencesResponse;
import com.rentsphere.user.dto.ProfileResponse;
import com.rentsphere.user.dto.PublicProfileResponse;
import com.rentsphere.user.entity.UserPreference;
import com.rentsphere.user.entity.UserProfile;

import java.time.LocalDate;

public class UserMapper {

    public static ProfileResponse toProfileResponse(UserProfile profile) {
        ProfileResponse response = new ProfileResponse();
        response.setId(profile.getId());
        response.setUserId(profile.getUserId());
        response.setEmail(profile.getEmail());
        response.setFullName(profile.getFullName());
        response.setPhone(profile.getPhone());
        response.setBio(profile.getBio());
        response.setAvatarUrl(profile.getAvatarUrl());
        response.setCity(profile.getCity());
        response.setArea(profile.getArea());
        response.setDateOfBirth(profile.getDateOfBirth());
        response.setPreferredLanguage(profile.getPreferredLanguage());
        response.setRenter(profile.isRenter());
        response.setLandlord(profile.isLandlord());
        response.setVerified(profile.isVerified());
        response.setVerificationStatus(profile.getVerificationStatus());
        response.setCreatedAt(profile.getCreatedAt());
        response.setUpdatedAt(profile.getUpdatedAt());
        return response;
    }

    public static PublicProfileResponse toPublicProfileResponse(UserProfile profile) {
        PublicProfileResponse response = new PublicProfileResponse();
        response.setUserId(profile.getUserId());
        response.setFullName(profile.getFullName());
        response.setAvatarUrl(profile.getAvatarUrl());
        response.setCity(profile.getCity());
        response.setVerified(profile.isVerified());
        response.setMemberSince(profile.getCreatedAt() != null
                ? profile.getCreatedAt().toLocalDate()
                : LocalDate.now());
        return response;
    }

    public static PreferencesResponse toPreferencesResponse(UserPreference pref) {
        PreferencesResponse response = new PreferencesResponse();
        response.setId(pref.getId());
        response.setUserId(pref.getUserId());
        response.setMinPrice(pref.getMinPrice());
        response.setMaxPrice(pref.getMaxPrice());
        response.setPreferredBedrooms(pref.getPreferredBedrooms());
        response.setPreferredBathrooms(pref.getPreferredBathrooms());
        response.setPropertyType(pref.getPropertyType());
        response.setFurnished(pref.getFurnished());
        response.setNotificationEmail(pref.isNotificationEmail());
        response.setNotificationPush(pref.isNotificationPush());
        response.setNotificationSms(pref.isNotificationSms());
        response.setCreatedAt(pref.getCreatedAt());
        response.setUpdatedAt(pref.getUpdatedAt());
        return response;
    }
}
