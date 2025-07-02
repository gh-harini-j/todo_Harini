package com.todolist.todoapp.service;

import com.todolist.todoapp.dto.TaskDTO;
import com.todolist.todoapp.model.Task;
import com.todolist.todoapp.model.User;
import com.todolist.todoapp.repository.TaskRepository;
import com.todolist.todoapp.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private static final Logger logger = LoggerFactory.getLogger(TaskService.class);

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Task> getAllTasks(String username) {
        User user = userRepository.findByUsernameIgnoreCase(username).orElseThrow();
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            return taskRepository.findAll();
        } else {
            return taskRepository.findByOwnerOrAssignee(user, user);
        }
    }

    public Task createTask(TaskDTO taskDTO, String username) {
        User owner = userRepository.findByUsernameIgnoreCase(taskDTO.getOwner()).orElseThrow(() -> new RuntimeException("Owner not found"));
        User assignee = userRepository.findByUsernameIgnoreCase(taskDTO.getAssignee()).orElseThrow(() -> new RuntimeException("Assignee not found"));

        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setDueDate(taskDTO.getDueDate());
        task.setPriority(taskDTO.getPriority());
        task.setOwner(owner);
        task.setAssignee(assignee);
        task.setCompleted(false);

        return taskRepository.save(task);
    }

    public Task updateTask(Long id, TaskDTO updatedTask, String username) {
        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // Allow if admin, owner, or assignee
        if (!"ADMIN".equalsIgnoreCase(user.getRole()) &&
            (task.getOwner() == null || !task.getOwner().getId().equals(user.getId())) &&
            (task.getAssignee() == null || !task.getAssignee().getId().equals(user.getId()))) {
            throw new RuntimeException("Forbidden");
        }

        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setDueDate(updatedTask.getDueDate());
        task.setCompleted(updatedTask.isCompleted());
        task.setPriority(updatedTask.getPriority());

        // Update assignee if provided (as username string)
        if (updatedTask.getAssignee() != null) {
            User assignee = userRepository.findByUsernameIgnoreCase(updatedTask.getAssignee())
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
            task.setAssignee(assignee);
        }

        // Update owner if provided (as username string)
        if (updatedTask.getOwner() != null) {
            User owner = userRepository.findByUsernameIgnoreCase(updatedTask.getOwner())
                    .orElseThrow(() -> new RuntimeException("Owner not found"));
            task.setOwner(owner);
        }

        return taskRepository.save(task);
    }

    public void deleteTask(Long id, String username) {
        User user = userRepository.findByUsernameIgnoreCase(username).orElseThrow();
        Task task = taskRepository.findById(id).orElseThrow();
        // Allow if admin or owner
        if (!"ADMIN".equalsIgnoreCase(user.getRole()) && !task.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Forbidden");
        }
        taskRepository.delete(task);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<Task> getTasksAssignedToMe(String username) {
        User user = userRepository.findByUsernameIgnoreCase(username).orElseThrow();
        return taskRepository.findByAssignee(user);
    }

    public List<Task> getTasksAssignedByMe(String username) {
        User user = userRepository.findByUsernameIgnoreCase(username).orElseThrow();
        return taskRepository.findByOwnerAndAssigneeNot(user, user);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    // Add other methods as needed
}
