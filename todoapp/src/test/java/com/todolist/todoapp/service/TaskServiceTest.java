package com.todolist.todoapp.service;

import com.todolist.todoapp.dto.TaskDTO;
import com.todolist.todoapp.model.Priority;
import com.todolist.todoapp.model.Task;
import com.todolist.todoapp.model.User;
import com.todolist.todoapp.repository.TaskRepository;
import com.todolist.todoapp.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskService taskService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createTask_shouldSaveTask() {
        User owner = new User();
        owner.setId(1L);
        owner.setUsername("owner");
        owner.setRole("USER");

        User assignee = new User();
        assignee.setId(2L);
        assignee.setUsername("assignee");
        assignee.setRole("USER");

        TaskDTO dto = new TaskDTO();
        dto.setTitle("Test Task");
        dto.setDescription("Test Desc");
        dto.setDueDate(LocalDateTime.now());
        dto.setPriority(Priority.HIGH);
        dto.setOwner("owner");
        dto.setAssignee("assignee");

        when(userRepository.findByUsernameIgnoreCase("owner")).thenReturn(Optional.of(owner));
        when(userRepository.findByUsernameIgnoreCase("assignee")).thenReturn(Optional.of(assignee));
        when(taskRepository.save(any(Task.class))).thenAnswer(i -> i.getArguments()[0]);

        Task saved = taskService.createTask(dto, "owner");

        assertEquals("Test Task", saved.getTitle());
        assertEquals(Priority.HIGH, saved.getPriority());
        assertEquals(owner, saved.getOwner());
        assertEquals(assignee, saved.getAssignee());
        assertFalse(saved.isCompleted());
    }

    @Test
    void createTask_shouldThrowIfAssignToAdmin() {
        User owner = new User();
        owner.setId(1L);
        owner.setUsername("owner");
        owner.setRole("USER");

        User admin = new User();
        admin.setId(2L);
        admin.setUsername("admin");
        admin.setRole("ADMIN");

        TaskDTO dto = new TaskDTO();
        dto.setTitle("Test Task");
        dto.setOwner("owner");
        dto.setAssignee("admin");

        when(userRepository.findByUsernameIgnoreCase("owner")).thenReturn(Optional.of(owner));
        when(userRepository.findByUsernameIgnoreCase("admin")).thenReturn(Optional.of(admin));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            taskService.createTask(dto, "owner");
        });
        assertTrue(ex.getMessage().contains("Cannot assign tasks to admin"));
    }
}
