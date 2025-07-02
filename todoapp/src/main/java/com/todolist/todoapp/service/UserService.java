package com.todolist.todoapp.service;

import com.todolist.todoapp.model.User;
import com.todolist.todoapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(String username, String password) {
        String cleanUsername = username.trim(); // Remove .toLowerCase()
        if (userRepository.findByUsernameIgnoreCase(cleanUsername).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        User user = new User();
        user.setUsername(cleanUsername);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("USER");
        return userRepository.save(user);
    }

    public User getByUsername(String username) {
        return userRepository.findByUsernameIgnoreCase(username.trim()).orElse(null); // Remove .toLowerCase()
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUserByAdmin(String username, String password, String role) {
        String cleanUsername = username.trim();
        if (userRepository.findByUsernameIgnoreCase(cleanUsername).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        User user = new User();
        user.setUsername(cleanUsername);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        return userRepository.save(user);
    }
}