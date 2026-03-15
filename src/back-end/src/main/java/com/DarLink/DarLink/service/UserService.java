package com.DarLink.DarLink.service;

import com.DarLink.DarLink.dto.UpdateProfileRequest;
import com.DarLink.DarLink.dto.UserResponse;
import com.DarLink.DarLink.entity.User;
import com.DarLink.DarLink.exception.UserAlreadyExistsException;
import com.DarLink.DarLink.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public void registerUser(User user) {
        if (userRepository.existsUserByUsername(user.getUsername())) {
            throw new UserAlreadyExistsException("Username already taken");
        }
        if (userRepository.existsUserByEmail(user.getEmail())) {
            throw new UserAlreadyExistsException("Email already registered");
        }
        userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findUserByUsername(username);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getMyProfile(User currentUser) {
        return toResponse(currentUser);
    }

    public UserResponse updateMyProfile(User currentUser, UpdateProfileRequest request) {
        currentUser.setBio(request.getBio());
        currentUser.setCity(request.getCity());
        currentUser.setAvatarUrl(request.getAvatarUrl());

        User savedUser = userRepository.save(currentUser);
        return toResponse(savedUser);
    }

    public UserResponse toResponse(User user) {
        UserResponse res = new UserResponse();
        res.setId(user.getId());
        res.setUsername(user.getUsername());
        res.setEmail(user.getEmail());
        res.setBio(user.getBio());
        res.setCity(user.getCity());
        res.setAvatarUrl(user.getAvatarUrl());
        res.setCreatedAt(user.getCreatedAt());
        return res;
    }
}
