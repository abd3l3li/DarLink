package com.DarLink.DarLink.Controller;

import com.DarLink.DarLink.dto.FriendRequestCreateRequest;
import com.DarLink.DarLink.dto.FriendStatusResponse;
import com.DarLink.DarLink.entity.User;
import com.DarLink.DarLink.repository.UserRepository;
import com.DarLink.DarLink.service.FriendService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class FriendController {

    private final FriendService friendService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName()).orElseThrow();
    }

    @GetMapping("/api/friends/statuses")
    public ResponseEntity<List<FriendStatusResponse>> getStatuses(@RequestParam(required = false) String userIds) {
        List<Long> ids = parseIds(userIds);
        return ResponseEntity.ok(friendService.getStatuses(getCurrentUser(), ids));
    }

    @PostMapping("/api/friend-requests")
    public ResponseEntity<FriendStatusResponse> createRequest(@Valid @RequestBody FriendRequestCreateRequest request) {
        return ResponseEntity.ok(friendService.createRequest(getCurrentUser(), request.getUserId()));
    }

    @PostMapping("/api/friend-requests/{id}/accept")
    public ResponseEntity<FriendStatusResponse> acceptRequest(@PathVariable Long id) {
        return ResponseEntity.ok(friendService.acceptRequest(getCurrentUser(), id));
    }

    @DeleteMapping("/api/friend-requests/{id}")
    public ResponseEntity<FriendStatusResponse> cancelOrRejectRequest(@PathVariable Long id) {
        return ResponseEntity.ok(friendService.cancelOrRejectRequest(getCurrentUser(), id));
    }

    @DeleteMapping("/api/friends/{userId}")
    public ResponseEntity<FriendStatusResponse> unfriend(@PathVariable Long userId) {
        return ResponseEntity.ok(friendService.unfriend(getCurrentUser(), userId));
    }

    private List<Long> parseIds(String userIds) {
        if (userIds == null || userIds.isBlank()) {
            return List.of();
        }

        return Arrays.stream(userIds.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(Long::valueOf)
                .distinct()
                .toList();
    }
}
