package com.DarLink.DarLink.Controller;

import com.DarLink.DarLink.dto.UpdateProfileRequest;
import com.DarLink.DarLink.dto.UserResponse;
import com.DarLink.DarLink.entity.User;
import com.DarLink.DarLink.repository.UserRepository;
import com.DarLink.DarLink.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName()).orElseThrow();
    }

    // GET /api/users/me — return current user's profile
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMyProfile() {
        return ResponseEntity.ok(userService.getMyProfile(getCurrentUser()));
    }

    // PATCH /api/users/me — update bio, city, avatarUrl
    @PatchMapping("/me")
    public ResponseEntity<UserResponse> updateMyProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateMyProfile(getCurrentUser(), request));
    }
}
