package com.DarLink.DarLink.Controller;

import com.DarLink.DarLink.dto.SlotRequestCreateRequest;
import com.DarLink.DarLink.dto.SlotRequestResponse;
import com.DarLink.DarLink.entity.User;
import com.DarLink.DarLink.repository.UserRepository;
import com.DarLink.DarLink.service.SlotRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/slot-requests")
@RequiredArgsConstructor
public class SlotRequestController {

    private final SlotRequestService slotRequestService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName()).orElseThrow();
    }

    // POST /api/slot-requests — guest creates a booking request
    @PostMapping
    public ResponseEntity<SlotRequestResponse> createRequest(
            @Valid @RequestBody SlotRequestCreateRequest request) {
        return ResponseEntity.ok(slotRequestService.createRequest(request, getCurrentUser()));
    }

    // GET /api/slot-requests/me — guest sees their own requests
    @GetMapping("/me")
    public ResponseEntity<List<SlotRequestResponse>> getMyRequests() {
        return ResponseEntity.ok(slotRequestService.getMyRequests(getCurrentUser()));
    }

    // GET /api/slot-requests/host — host sees requests on their stays
    @GetMapping("/host")
    public ResponseEntity<List<SlotRequestResponse>> getHostRequests() {
        return ResponseEntity.ok(slotRequestService.getHostRequests(getCurrentUser()));
    }

    // PATCH /api/slot-requests/{id}/status — host updates status
    @PatchMapping("/{id}/status")
    public ResponseEntity<SlotRequestResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(slotRequestService.updateStatus(id, status, getCurrentUser()));
    }
}