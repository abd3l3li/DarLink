package com.DarLink.restAPI.controller;

import java.util.ArrayList;
import java.util.List;
import com.DarLink.restAPI.model.User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    private List<User> users = new ArrayList<>();
    
    @GetMapping("/users")
    public List<User> getAllUsers() {
        System.out.println("Getting all users");
        return users;
    }

    @PostMapping("/add_user")
    public String addUser(@RequestBody User user) {
        System.out.println("Adding user: " + "id" + user.getId() + ", " + user.getName() + ", " + user.getEmail());
        if (users.stream().anyMatch(u -> u.getId() == user.getId())) {
            System.out.println("User with id " + user.getId() + " already exists.");
        } else {
            System.out.println("User with id " + user.getId() + " added successfully.");
            users.add(user);
            return "User added successfully with id: " + user.getId();
        }
        return "User already exists with id: " + user.getId();
    }
}
