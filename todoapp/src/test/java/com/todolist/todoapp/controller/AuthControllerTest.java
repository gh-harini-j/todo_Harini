package com.todolist.todoapp.controller;

import com.todolist.todoapp.model.User;
import com.todolist.todoapp.security.JwtUtil;
import com.todolist.todoapp.service.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @Mock
    private UserService userService;
    @Mock
    private JwtUtil jwtUtil;
    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthController authController;

    @Test
    void register_shouldReturnTokenAndUsername() {
        MockitoAnnotations.openMocks(this);
        User user = new User();
        user.setUsername("testuser");
        user.setPassword("pass");
        when(userService.registerUser("testuser", "pass")).thenReturn(user);
        when(jwtUtil.generateToken("testuser")).thenReturn("token123");

        Map<String, Object> result = authController.register(Map.of("username", "testuser", "password", "pass"));
        assertEquals("testuser", result.get("username"));
        assertEquals("token123", result.get("token"));
    }

    @Test
    void login_shouldReturnTokenAndUsername() {
        MockitoAnnotations.openMocks(this);
        User user = new User();
        user.setUsername("testuser");
        when(userService.getByUsername("testuser")).thenReturn(user);
        when(jwtUtil.generateToken("testuser")).thenReturn("token123");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenReturn(mock(org.springframework.security.core.Authentication.class));

        Map<String, Object> result = authController.login(Map.of("username", "testuser", "password", "pass"));
        assertEquals("testuser", result.get("username"));
        assertEquals("token123", result.get("token"));
    }
}
