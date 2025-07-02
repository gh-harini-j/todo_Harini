package com.todolist.todoapp.dto;

import com.todolist.todoapp.model.User;

public class UserDTO {
    private String username;

    public UserDTO(User user) {
        this.username = user.getUsername();
    }

    public String getUsername() {
        return username;
    }
}