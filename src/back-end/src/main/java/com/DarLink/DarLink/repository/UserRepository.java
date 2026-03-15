package com.DarLink.DarLink.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.DarLink.DarLink.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Custom query method: Spring automatically writes the SQL for this!
    Optional<User> findByEmail(String email);

    // Another useful one for checking duplicates during registration
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

    Optional<User> findUserByUsername(String username);

    boolean existsUserByEmail(String email);

    boolean existsUserByUsername(String username);

    Optional<User> findUserByEmail(String email);
}