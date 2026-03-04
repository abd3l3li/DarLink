package com.DarLink.Darlink.service;

import com.DarLink.Darlink.dto.AuthResponse;
import com.DarLink.Darlink.dto.LoginRequest;
import com.DarLink.Darlink.dto.RegisterRequest;
import com.DarLink.Darlink.entity.User;
import com.DarLink.Darlink.repository.UserRepository;
import com.DarLink.Darlink.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        // 1. Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use.");
        }

        // 2. Create the new User and hash the password
        User user = new User(
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()) // 🔒 Scramble the password!
        );

        // 3. Save to database
        userRepository.save(user);

        // 4. Print the ID Card (JWT) and return it
        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest request) {
        // 1. Spring Security checks the password against the database automatically
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // 2. If we get here, the password was correct! Find the user.
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Print a new ID Card (JWT) and return it
        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token);
    }
}