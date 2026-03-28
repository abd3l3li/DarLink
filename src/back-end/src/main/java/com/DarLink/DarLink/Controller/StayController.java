package com.DarLink.DarLink.Controller;

import com.DarLink.DarLink.dto.CreateStayRequest;
import com.DarLink.DarLink.dto.StayResponse;
import com.DarLink.DarLink.entity.User;
import com.DarLink.DarLink.repository.UserRepository;
import com.DarLink.DarLink.service.StayService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stays")
@RequiredArgsConstructor
public class StayController {

    private final StayService stayService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    @PostMapping("/create")
    public ResponseEntity<StayResponse> createStay(@Valid @RequestBody CreateStayRequest request) {
        User host = getCurrentUser();
        return ResponseEntity.ok(stayService.createStay(request, host));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StayResponse> updateStay(
            @PathVariable Long id,
            @Valid @RequestBody CreateStayRequest request) {
        User currentUser = getCurrentUser();
        return ResponseEntity.ok(stayService.updateStay(id, request, currentUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStay(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        stayService.deleteStay(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<StayResponse>> getStays(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String price,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double maxPrice) {

        if (city != null || maxPrice != null) {
            List<StayResponse> results = (city != null)
                    ? stayService.filterByCity(city)
                    : stayService.getAllStays();

            if (maxPrice != null) {
                results = results.stream()
                        .filter(stay -> stay.getPricePerNight() != null && stay.getPricePerNight() <= maxPrice)
                        .toList();
            }
            return ResponseEntity.ok(results);
        }

        return ResponseEntity.ok(stayService.searchStays(location, type, price));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StayResponse> getStayById(@PathVariable Long id) {
        return ResponseEntity.ok(stayService.getStayById(id));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<StayResponse>> getMyListings() {
        User currentUser = getCurrentUser();
        return ResponseEntity.ok(stayService.getMyListings(currentUser));
    }

    @GetMapping("/page")
    public ResponseEntity<Page<StayResponse>> getStaysPage(
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(stayService.getStaysPage(page));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}