package com.todolist.todoapp.model;

import jakarta.persistence.*;
import java.util.*;

@Entity
@Table(name = "APP_USER") // Avoids reserved word conflict
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String username;
    private String password;
    private String role = "USER";

    @OneToMany(mappedBy = "owner")
    private List<Task> ownedTasks;

    @OneToMany(mappedBy = "assignee")
    private List<Task> assignedTasks;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public List<Task> getOwnedTasks() { return ownedTasks; }
    public void setOwnedTasks(List<Task> ownedTasks) { this.ownedTasks = ownedTasks; }

    public List<Task> getAssignedTasks() { return assignedTasks; }
    public void setAssignedTasks(List<Task> assignedTasks) { this.assignedTasks = assignedTasks; }
}
