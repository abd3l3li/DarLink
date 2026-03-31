package com.DarLink.DarLink.security;

import com.DarLink.DarLink.entity.User;
import com.DarLink.DarLink.repository.UserRepository;
import com.DarLink.DarLink.service.NotificationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final NotificationService notificationService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        // get user info from Google
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String checkEmail    = oAuth2User.getAttribute("email");
        String checkName     = oAuth2User.getAttribute("name");

        // 42
        // 42 uses different attributes
        if (checkEmail == null) {
            checkEmail = oAuth2User.getAttribute("login") + "@student.1337.ma";
        }
        if (checkName == null) {
            checkName = oAuth2User.getAttribute("login");
        }
        String name = checkName;
        String email = checkEmail;
        String provider = (oAuth2User.getAttribute("login") != null) ? "42" : "Google";
        
        // save user to DB if first time and track if user is new
        boolean isNewUser = !userRepository.existsByEmail(email);
        User user = userRepository.findUserByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUsername(name);
                    newUser.setEmail(email);
                    newUser.setPassword("OAUTH2");
                    return userRepository.save(newUser);
                });

        // generate JWT
        String token = jwtService.generateToken(user.getEmail());

        // set user as online
        user.setOnline(true);
        userRepository.save(user);

        // Send notification for OAuth login
        if (isNewUser) {
            // New user welcome notification
            notificationService.sendNotification(
                    user,
                    "oauth_welcome",
                    "DarLink Team",
                    null,
                    "Welcome to DarLink, " + user.getUsername() + "! You've successfully registered via " + provider + ".",
                    "/profile"
            );
        } else {
            // Existing user login notification
            notificationService.sendNotification(
                    user,
                    "oauth_login",
                    "DarLink Team",
                    null,
                    "Welcome back, " + user.getUsername() + "! (logged in via " + provider + ")",
                    "/"
            );
        }

        // Check if it's a new user or if user has 2FA enabled
        String scheme = "https"; // Force https for the external redirect
        String host = request.getHeader("Host");
        String forwardedHost = request.getHeader("X-Forwarded-Host");
        
        // Final fallback: use what's in the browser URL if possible
        String targetHost = (forwardedHost != null) ? forwardedHost : (host != null ? host : "darlink.com");
        
        // If the host doesn't have the port, add it manually
        if (!targetHost.contains(":")) {
            targetHost += ":1337";
        }
        
        String redirectBase = scheme + "://" + targetHost;
        
        if (isNewUser) {
            // New user, no 2FA by default
            response.sendRedirect(redirectBase + "/auth/callback?token=" + token);
        } else if (Boolean.TRUE.equals(user.getTwoFactorEnabled()) && !Boolean.TRUE.equals(user.getTwoFactorVerified())) {
            // Existing user has 2FA enabled but not verified, redirect to setup
            response.sendRedirect(redirectBase + "/auth/callback?token=" + token + "&setup2fa=true&email=" + user.getEmail());
        } else if (Boolean.TRUE.equals(user.getTwoFactorEnabled())) {
            // Existing user with 2FA enabled and verified, redirect to 2FA verification
            response.sendRedirect(redirectBase + "/auth/callback?token=" + token + "&require2fa=true&email=" + user.getEmail());
        } else {
            // No 2FA, normal login
            response.sendRedirect(redirectBase + "/auth/callback?token=" + token);
        }
    }
}