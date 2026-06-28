package com.rentsphere.auth.service;

import com.rentsphere.auth.dto.*;
import com.rentsphere.auth.entity.Role;
import com.rentsphere.auth.entity.User;
import com.rentsphere.auth.enums.RoleName;
import com.rentsphere.auth.mapper.UserMapper;
import com.rentsphere.auth.repository.RoleRepository;
import com.rentsphere.auth.repository.UserRepository;
import com.rentsphere.auth.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        RoleName roleName = RoleName.ROLE_RENTER;
        if (request.getRole() != null && !request.getRole().isBlank()) {
            try {
                roleName = RoleName.valueOf("ROLE_" + request.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid role: " + request.getRole());
            }
            if (roleName == RoleName.ROLE_ADMIN) {
                throw new IllegalArgumentException("Admin registration is not allowed");
            }
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Default role not found"));

        User user = new User();
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        user.setPhone(request.getPhone());
        user.setRoles(Set.of(role));

        userRepository.save(user);

        String token = jwtTokenProvider.generateAccessToken(
                user.getId(), user.getEmail(),
                user.getRoles().stream().map(r -> r.getName().name()).toList()
        );

        return UserMapper.toAuthResponse(user, token, jwtTokenProvider.getAccessTokenMinutes() * 60);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase().trim(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("User not found after authentication"));

        String token = jwtTokenProvider.generateAccessToken(
                user.getId(), user.getEmail(),
                user.getRoles().stream().map(r -> r.getName().name()).toList()
        );

        return UserMapper.toAuthResponse(user, token, jwtTokenProvider.getAccessTokenMinutes() * 60);
    }

    public UserResponse getCurrentUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserMapper.toUserResponse(user);
    }
}
