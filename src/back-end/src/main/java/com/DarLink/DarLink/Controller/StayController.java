package com.DarLink.DarLink.Controller;

import com.DarLink.DarLink.dto.CreateStayRequest;
import com.DarLink.DarLink.dto.StayResponse;
import com.DarLink.DarLink.entity.User;
import com.DarLink.DarLink.repository.UserRepository;
import com.DarLink.DarLink.service.StayService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import java.util.List;

@RestController
@RequestMapping("/api/stays")
@RequiredArgsConstructor
public class StayController {

    private final StayService stayService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName(); // returns email from JWT principal
        return userRepository.findByEmail(email).orElseThrow();
    }

    // POST /api/stays/create — host-only create
    @PostMapping("/create")
    public ResponseEntity<StayResponse> createStay(@Valid @RequestBody CreateStayRequest request) {
        User host = getCurrentUser();
        return ResponseEntity.ok(stayService.createStay(request, host));
    }

    // GET /api/stays — list all, or filter by city/price
    @GetMapping
    public ResponseEntity<List<StayResponse>> getStays(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double maxPrice) {

        if (city != null) return ResponseEntity.ok(stayService.getStaysByCity(city));
        if (maxPrice != null) return ResponseEntity.ok(stayService.getStaysByMaxPrice(maxPrice));
        return ResponseEntity.ok(stayService.getAllStays());
    }

    // GET /api/stays/{id} — get one stay
    @GetMapping("/{id}")
    public ResponseEntity<StayResponse> getStayById(
            @PathVariable Long id) {
        return ResponseEntity.ok(stayService.getStayById(id));
    }

    // PUT /api/stays/{id} — host-only update
    @PutMapping("/{id}")
    public ResponseEntity<StayResponse> updateStay(
            @PathVariable Long id,
            @Valid @RequestBody CreateStayRequest request) {
        User currentUser = getCurrentUser();
        return ResponseEntity.ok(stayService.updateStay(id, request, currentUser));
    }

    // DELETE /api/stays/{id} — host-only delete
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
            @RequestParam(required = false) String price) {
        return ResponseEntity.ok(stayService.searchStays(location, type, price));
    }
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
    @GetMapping("/page")
    public ResponseEntity<Page<StayResponse>> getStaysPage(
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(stayService.getStaysPage(page));
    }
}
