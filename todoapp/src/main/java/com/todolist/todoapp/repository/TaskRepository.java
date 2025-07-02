package com.todolist.todoapp.repository;

import com.todolist.todoapp.model.Task;
import com.todolist.todoapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByOwnerOrAssignee(User owner, User assignee);
    List<Task> findByAssignee(User assignee);
    List<Task> findByOwnerAndAssigneeNot(User owner, User assignee);
}
