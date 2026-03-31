package com.DarLink.DarLink.service;

import com.DarLink.DarLink.dto.PatchMeRequest;
import com.DarLink.DarLink.dto.UpdateProfileRequest;
import com.DarLink.DarLink.dto.UserResponse;
import com.DarLink.DarLink.entity.User;
import com.DarLink.DarLink.exception.UserAlreadyExistsException;
import com.DarLink.DarLink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.DarLink.DarLink.security.JwtService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TotpService totpService;
    private final NotificationService notificationService;

    public void registerUser(User user) {
        if (userRepository.existsUserByUsername(user.getUsername())) {
            throw new UserAlreadyExistsException("Username already taken");
        }
        if (userRepository.existsUserByEmail(user.getEmail())) {
            throw new UserAlreadyExistsException("Email already registered");
        }
        userRepository.save(user);
    }

    private boolean isOauthUser(User user) {
        return "OAUTH2".equals(user.getPassword());
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findUserByUsername(username);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getMyProfile(User currentUser) {
        return toResponse(currentUser);
    }

    public UserResponse getUserProfileById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return toResponse(user);
    }

    // old endpoint compatibility
    public UserResponse updateMyProfile(User currentUser, UpdateProfileRequest request) {
        currentUser.setBio(request.getBio());
        currentUser.setCity(request.getCity());
        currentUser.setAvatarUrl(request.getAvatarUrl());

        User savedUser = userRepository.save(currentUser);
        return toResponse(savedUser);
    }

    // NEW: simple PATCH /api/users/me (replace provided fields only)
    public UserResponse patchMe(User currentUser, PatchMeRequest request) {
        String newEmail = null;

        if (request.getAvatarUrl() != null) {
            currentUser.setAvatarUrl(normalizeNullable(request.getAvatarUrl()));
        }

        if (request.getUsername() != null) {
            currentUser.setUsername(request.getUsername().trim());
        }

        if (request.getEmail() != null) {
            String requestedEmail = request.getEmail().trim().toLowerCase();

            // OAuth accounts keep provider-owned email; ignore incoming email patch.
            if (!isOauthUser(currentUser) && !requestedEmail.equals(currentUser.getEmail())) {
                newEmail = requestedEmail;
                currentUser.setEmail(newEmail);
            }
        }

        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        if (request.getTwoFactorEnabled() != null) {
            if (Boolean.TRUE.equals(request.getTwoFactorEnabled())) {
                currentUser.setTwoFactorEnabled(true);
                if (currentUser.getTotpSecret() == null || currentUser.getTotpSecret().isBlank()) {
                    currentUser.setTotpSecret(totpService.generateSecret());
                }
                currentUser.setTwoFactorVerified(false);
            } else {
                currentUser.setTwoFactorEnabled(false);
                currentUser.setTwoFactorVerified(false);
                currentUser.setTotpSecret(null);
            }
        }
        notificationService.sendNotification(
                currentUser,
                "profile_update",
                "DarLink Team",
                null,
                "Your profile was updated successfully.",
                "/profile"
        );
        try {
            User savedUser = userRepository.save(currentUser);
            UserResponse response = toResponse(savedUser);

            // Refresh token only when local-account email is actually changed.
            if (newEmail != null) {
                String newToken = jwtService.generateToken(newEmail);
                response.setToken(newToken);
            }

            return response;
        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username or email already exists");
        }
    }
    public UserResponse toResponse(User user) {
        UserResponse res = new UserResponse();
        res.setId(user.getId());
        res.setUsername(user.getUsername());
        res.setEmail(user.getEmail());
        res.setBio(user.getBio());
        res.setCity(user.getCity());
        res.setAvatarUrl(user.getAvatarUrl());
        res.setTwoFactorEnabled(user.getTwoFactorEnabled());
        res.setTwoFactorVerified(user.getTwoFactorVerified());
        res.setCreatedAt(user.getCreatedAt());
        return res;
    }

    private String normalizeNullable(String value) {
        String v = value == null ? null : value.trim();
        if (v == null || v.isEmpty()) return null;
        return v;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName()).orElseThrow();
    }

    public void logout(String token) {
        User user = getCurrentUser();
        user.setOnline(false);
        userRepository.save(user);
    }
}
