package com.todolist.todoapp.controller;

import com.todolist.todoapp.dto.UserDTO;
import com.todolist.todoapp.model.User;
import com.todolist.todoapp.security.JwtUtil;
import com.todolist.todoapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, String> body) {
        User user = userService.registerUser(body.get("username").trim(), body.get("password"));
        String token = jwtUtil.generateToken(user.getUsername());
        return Map.of("token", token, "username", user.getUsername());
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        String username = body.get("username").trim();
        String password = body.get("password");
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );
            User user = userService.getByUsername(username);
            String token = jwtUtil.generateToken(user.getUsername());
            return Map.of("token", token, "username", user.getUsername());
        } catch (AuthenticationException e) {
            throw new RuntimeException("Invalid username or password");
        }
    }

    @PostMapping("/admin/create-user")
    @PreAuthorize("hasRole('ADMIN')")
    public User createUserByAdmin(@RequestBody Map<String, String> body) {
        String username = body.get("username").trim();
        String password = body.get("password");
        String role = body.getOrDefault("role", "USER");
        return userService.createUserByAdmin(username, password, role);
    }

    @GetMapping("/users")
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers().stream().map(UserDTO::new).toList();
    }
}