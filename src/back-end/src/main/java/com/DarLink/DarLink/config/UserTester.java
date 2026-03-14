package com.DarLink.DarLink.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.DarLink.DarLink.entity.User;
import com.DarLink.DarLink.repository.UserRepository;

@Component
public class UserTester implements CommandLineRunner {

    private final UserRepository userRepository;

    // Inject the Repository we created
    public UserTester(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        System.out.println("\n===========================================");
        System.out.println("🧪 STARTING USER ENTITY TEST");
        System.out.println("===========================================");

        String testEmail = "tester@darlink.com";

        // 1. Clean up previous runs (so we don't get "Duplicate Entry" errors)
        if (userRepository.existsByEmail(testEmail)) {
            System.out.println("🧹 Cleaning up old test data...");
            User oldUser = userRepository.findByEmail(testEmail).get();
            userRepository.delete(oldUser);
        }

        // 2. Create a new User Object in Java memory
        User newUser = new User("TestUser", testEmail, "superSecretPass");
        newUser.setBio("I am a generated test user!");
        newUser.setCity("Casablanca");

        // 3. SAVE it to the Database (The moment of truth!)
        System.out.println("💾 Saving User to Database...");
        userRepository.save(newUser);

        // 4. RETRIEVE it back to prove it's there
        System.out.println("🔍 Searching Database for user...");
        User foundUser = userRepository.findByEmail(testEmail).orElse(null);

        if (foundUser != null) {
            System.out.println("✅ SUCCESS! Record found.");
            System.out.println("   👤 ID: " + foundUser.getId());
            System.out.println("   👤 Email: " + foundUser.getEmail());
            System.out.println("   👤 Username: " + foundUser.getUsername());
            System.out.println("   👤 Created At: " + foundUser.getCreatedAt());
            System.out.println("   👤 Bio: " + foundUser.getBio());
        } else {
            System.out.println("❌ FAILED. User was not found in DB.");
        }

        System.out.println("===========================================\n");
    }
}