package com.DarLink.DarLink.security;

import com.DarLink.DarLink.entity.User;
import com.DarLink.DarLink.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Find the user in your database using the email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // 2. Translate your custom User into Spring Security's built-in User object
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(), // This is the hashed password from the DB
                Collections.emptyList() // Roles/Authorities go here (we leave it empty for now)
        );
    }
}