package com.DarLink.DarLink.service;

import com.DarLink.DarLink.dto.SlotRequestCreateRequest;
import com.DarLink.DarLink.dto.SlotRequestResponse;
import com.DarLink.DarLink.entity.SlotRequest;
import com.DarLink.DarLink.entity.Stay;
import com.DarLink.DarLink.entity.User;
import com.DarLink.DarLink.repository.SlotRequestRepository;
import com.DarLink.DarLink.repository.StayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class SlotRequestService {

    private static final Set<String> ALLOWED_STATUS =
            Set.of("PENDING", "ACCEPTED", "REJECTED", "CANCELLED");

    private final SlotRequestRepository slotRequestRepository;
    private final StayRepository stayRepository;

    public SlotRequestResponse createRequest(SlotRequestCreateRequest request, User guest) {
        Stay stay = stayRepository.findById(request.getStayId())
                .orElseThrow(() -> new RuntimeException("Stay not found with id: " + request.getStayId()));

        // Guest cannot request their own stay
        if (stay.getHost().getId().equals(guest.getId())) {
            throw new RuntimeException("You cannot request your own stay");
        }

        // Validate date range
        LocalDate today = LocalDate.now();
        if (request.getStartDate().isBefore(today) || request.getEndDate().isBefore(today)) {
            throw new RuntimeException("Dates cannot be in the past");
        }
        if (!request.getEndDate().isAfter(request.getStartDate())) {
            throw new RuntimeException("End date must be after start date");
        }

        SlotRequest slotRequest = new SlotRequest();
        slotRequest.setGuest(guest);
        slotRequest.setStay(stay);
        slotRequest.setStartDate(request.getStartDate());
        slotRequest.setEndDate(request.getEndDate());
        slotRequest.setStatus("PENDING");

        return toResponse(slotRequestRepository.save(slotRequest));
    }

    public List<SlotRequestResponse> getMyRequests(User guest) {
        return slotRequestRepository.findByGuestId(guest.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<SlotRequestResponse> getHostRequests(User host) {
        return slotRequestRepository.findByStayHostId(host.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public SlotRequestResponse updateStatus(Long requestId, String newStatus, User currentUser) {
        SlotRequest slotRequest = slotRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Slot request not found with id: " + requestId));

        // Only host of the stay can update status
        if (!slotRequest.getStay().getHost().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Only the host can update request status");
        }

        if (newStatus == null || newStatus.isBlank()) {
            throw new RuntimeException("Status is required");
        }

        String normalizedStatus = newStatus.trim().toUpperCase();
        if (!ALLOWED_STATUS.contains(normalizedStatus)) {
            throw new RuntimeException("Invalid status. Allowed: PENDING, ACCEPTED, REJECTED, CANCELLED");
        }

        slotRequest.setStatus(normalizedStatus);
        return toResponse(slotRequestRepository.save(slotRequest));
    }

    private SlotRequestResponse toResponse(SlotRequest slotRequest) {
        SlotRequestResponse response = new SlotRequestResponse();
        response.setId(slotRequest.getId());
        response.setStayId(slotRequest.getStay().getId());
        response.setStayName(slotRequest.getStay().getName());
        response.setGuestId(slotRequest.getGuest().getId());
        response.setGuestUsername(slotRequest.getGuest().getUsername());
        response.setStartDate(slotRequest.getStartDate());
        response.setEndDate(slotRequest.getEndDate());
        response.setStatus(slotRequest.getStatus());
        // Not setting createdAt because SlotRequest entity currently has no public getter for it
        return response;
    }
}
