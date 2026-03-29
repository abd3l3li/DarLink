package com.DarLink.DarLink.security;

import com.DarLink.DarLink.entity.User;
import com.DarLink.DarLink.repository.UserRepository;
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
        // save user to DB if first time
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

        // send token to frontend
        // response.setContentType("application/json");
        // response.getWriter().write("{\"token\":\"" + token + "\"}");
        /// ///////////////
        // set user as online
        user.setOnline(true);
        userRepository.save(user);
        response.sendRedirect("https://localhost:1337/auth/callback?token=" + token);
    }
}