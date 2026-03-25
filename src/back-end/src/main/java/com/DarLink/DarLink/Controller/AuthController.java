package com.DarLink.DarLink.Controller;

import com.DarLink.DarLink.dto.AuthResponse;
import com.DarLink.DarLink.dto.LoginRequest;
import com.DarLink.DarLink.dto.RegisterRequest;
import com.DarLink.DarLink.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import com.DarLink.DarLink.dto.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request){
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            if ("2FA_REQUIRED".equals(e.getMessage())) {
                return ResponseEntity.status(403).body(new ApiResponse("2FA required"));
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
