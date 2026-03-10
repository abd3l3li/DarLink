package com.DarLink.DarLink.config;

import com.DarLink.DarLink.security.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. Disable CSRF (Safe to do for stateless REST APIs using JWTs)
                .csrf(csrf -> csrf.disable());

//                // 2. Disable Sessions (We will use JWT tokens instead of memory)
//                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//
//                // 3. Setup Route Permissions (Who is allowed where)
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/api/auth/**").permitAll() // Anyone can register or log in
//                        .anyRequest().authenticated() // Everything else requires a valid token!
//                )
//
//                // 4. Allow frames so the H2 console displays correctly in your browser
//                .headers(headers -> headers.frameOptions(frame -> frame.disable()));
//
        return http.build();
    }

    // 5. Set the Password Hashing Algorithm (BCrypt)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 6. Expose the Authentication Manager (Needed by AuthService to verify logins)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}