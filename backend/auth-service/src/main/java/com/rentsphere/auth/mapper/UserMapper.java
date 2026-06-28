package com.rentsphere.auth.mapper;

import com.rentsphere.auth.dto.AuthResponse;
import com.rentsphere.auth.dto.UserResponse;
import com.rentsphere.auth.entity.User;

import java.util.List;

public class UserMapper {

    public static UserResponse toUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setPhone(user.getPhone());
        response.setEnabled(user.isEnabled());
        response.setRoles(user.getRoles().stream()
                .map(r -> r.getName().name())
                .toList());
        return response;
    }

    public static AuthResponse toAuthResponse(User user, String accessToken, long expiresIn) {
        List<String> roles = user.getRoles().stream()
                .map(r -> r.getName().name())
                .toList();

        return new AuthResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                roles,
                accessToken,
                expiresIn
        );
    }
}
