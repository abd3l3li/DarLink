package com.DarLink.DarLink.Controller;

import com.DarLink.DarLink.dto.*;
import com.DarLink.DarLink.entity.User;
import com.DarLink.DarLink.repository.UserRepository;
import com.DarLink.DarLink.security.JwtService;
import com.DarLink.DarLink.service.TotpService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/2fa")
public class TwoFactorController {

    private final TotpService totpService;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public TwoFactorController(TotpService totpService, UserRepository userRepository, JwtService jwtService) {
        this.totpService = totpService;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    /**
     * Step 1: User requests to setup 2FA (after register or anytime)
     * POST /api/auth/2fa/setup
     * Returns QR code URL and secret
     */
    @PostMapping("/setup")
    public ResponseEntity<Setup2FaResponse> setupTwoFactor(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate new secret
        String secret = totpService.generateSecret();
        user.setTotpSecret(secret);
        user.setTwoFactorVerified(false);
        userRepository.save(user);
        // Generate QR code URL
        String qrCodeUrl = totpService.getQrCodeUrl(email, secret, "DarLink");

        return ResponseEntity.ok(new Setup2FaResponse(qrCodeUrl, secret));
    }

    /**
     * Step 2: User scans QR code in Google Authenticator, enters 6-digit code
     * POST /api/auth/2fa/verify-setup
     * Request body: { "totpCode": "123456" }
     * Response: { "message": "2FA enabled successfully" }
     */
    @PostMapping("/verify-setup")
    public ResponseEntity<?> verifyAndEnableTwoFactor(
            Authentication authentication,
            @RequestBody Verify2FaRequest request) {
        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Get the secret from the setup endpoint (you'll need to temporarily store it)
            // For now, we'll need to modify this flow slightly (see Step 7)

            // Verify the code
            boolean isValid = totpService.verifyCode(request.getTotpCode(), user.getTotpSecret());

            if (!isValid) {
                return ResponseEntity.badRequest().body("Invalid TOTP code");
            }

            // Enable 2FA
            user.setTwoFactorEnabled(true);
            user.setTwoFactorVerified(true);
            userRepository.save(user);

            return ResponseEntity.ok().body(new ApiResponse("2FA enabled successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * Step 3: During login, after password auth, user enters 6-digit code
     * POST /api/auth/2fa/verify-login
     * Request body: { "email": "user@example.com", "totpCode": "123456" }
     * Response: { "token": "jwt_token" }
     */
    @PostMapping("/verify-login")
    public ResponseEntity<?> verifyLoginTwoFactor(@RequestBody LoginWith2FaRequest request) {
        try {
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!user.getTwoFactorEnabled()) {
                return ResponseEntity.badRequest().body("2FA not enabled for this user");
            }

            // Verify the TOTP code
            boolean isValid = totpService.verifyCode(request.getTotpCode(), user.getTotpSecret());

            if (!isValid) {
                return ResponseEntity.badRequest().body("Invalid TOTP code");
            }

            // Set user online status
            user.setOnline(true);
            userRepository.save(user);

            // Generate JWT and return
            String token = jwtService.generateToken(user.getEmail());
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * Disable 2FA for the authenticated user
     * DELETE /api/auth/2fa/disable
     */
    @DeleteMapping("/disable")
    public ResponseEntity<?> disableTwoFactor(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setTwoFactorEnabled(false);
        user.setTotpSecret(null);
        userRepository.save(user);

        return ResponseEntity.ok().body(new ApiResponse("2FA disabled successfully"));
    }
}