package com.DarLink.DarLink.Controller;

import com.DarLink.DarLink.dto.PatchMeRequest;
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

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMyProfile() {
        return ResponseEntity.ok(userService.getMyProfile(getCurrentUser()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserProfileById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserProfileById(id));
    }

    // PATCH /api/users/me (protected)
    @PatchMapping("/me")
    public ResponseEntity<UserResponse> patchMyProfile(@Valid @RequestBody PatchMeRequest request) {
        return ResponseEntity.ok(userService.patchMe(getCurrentUser(), request));
    }

    // logout
    @PostMapping("/me/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        try {
            userService.logout(token);
        } catch (Exception e) {
            // respond with message invalid token
            return ResponseEntity.status(401).body("Invalid token");
        }
        // Invalidate the token on the client side as well (e.g., by removing it from localStorage)
        return ResponseEntity.ok("Logged out successfully");
    }
}
