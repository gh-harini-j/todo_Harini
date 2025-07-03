package com.todolist.todoapp.controller;

import com.todolist.todoapp.dto.TaskDTO;
import com.todolist.todoapp.model.Task;
import com.todolist.todoapp.model.Priority;
import com.todolist.todoapp.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public List<TaskDTO> getAllTasks(@AuthenticationPrincipal UserDetails userDetails) {
        return taskService.getAllTasks(userDetails.getUsername())
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Helper to convert TaskDTO to Task
    private Task toEntity(TaskDTO taskDTO, UserDetails userDetails) {
        Task task = new Task();
        task.setId(taskDTO.getId());
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setDueDate(taskDTO.getDueDate());
        task.setCompleted(taskDTO.isCompleted());
        task.setPriority(taskDTO.getPriority());
        return task;
    }

    @PostMapping
    public TaskDTO createTask(@RequestBody TaskDTO taskDTO, @AuthenticationPrincipal UserDetails userDetails) {
        return toDTO(taskService.createTask(taskDTO, userDetails.getUsername()));
    }
    @PutMapping("/{id}")
    public TaskDTO updateTask(@PathVariable Long id, @RequestBody TaskDTO updatedTask, @AuthenticationPrincipal UserDetails userDetails) {
        return toDTO(taskService.updateTask(id, updatedTask, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        taskService.deleteTask(id, userDetails.getUsername());
    }

    // Helper to convert Task to TaskDTO
    private TaskDTO toDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setDueDate(task.getDueDate());
        dto.setCompleted(task.isCompleted());
        dto.setPriority(task.getPriority());
        dto.setOwner(task.getOwner() != null ? task.getOwner().getUsername() : null);
        dto.setAssignee(task.getAssignee() != null ? task.getAssignee().getUsername() : null);
        return dto;
    }

    @GetMapping("/assigned-to-me")
    public List<TaskDTO> getTasksAssignedToMe(@AuthenticationPrincipal UserDetails userDetails) {
        return taskService.getTasksAssignedToMe(userDetails.getUsername())
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @GetMapping("/assigned-by-me")
    public List<TaskDTO> getTasksAssignedByMe(@AuthenticationPrincipal UserDetails userDetails) {
        return taskService.getTasksAssignedByMe(userDetails.getUsername())
                .stream()
                .map(this::toDTO)
                .toList();
    }
}
