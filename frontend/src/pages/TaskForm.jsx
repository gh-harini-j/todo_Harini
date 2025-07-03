import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Stack, Alert } from '@mui/material';
import { useAuth } from '../AuthContext';

export default function TaskForm() {
  const [task, setTask] = useState({ title: '', description: '', dueDate: '', assignee: '', priority: 'LOW' });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    api.get('/auth/users')
      .then(res => {
        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else {
          setUsers([]);
        }
      })
      .catch(() => setUsers([]));
  }, []);

  const handleChange = e => setTask(t => ({ ...t, [e.target.name]: e.target.value }));

  const handleAssigneeChange = e => setTask(t => ({
    ...t,
    assignee: e.target.value
  }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/tasks', {
        ...task,
        owner: user, // username string
        assignee: task.assignee, // username string
        priority: task.priority // string: "LOW", "MEDIUM", "HIGH", "STARRED"
      });
      navigate('/');
    } catch (err) {
      setError('Failed to add task');
    }
  };

  return (
    <Paper
      sx={{
        p: 4,
        maxWidth: 420,
        mx: 'auto',
        mt: 8,
        borderRadius: 4,
        boxShadow: 6,
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f8fafc 100%)'
      }}
    >
      <Typography variant="h5" mb={2} sx={{ fontWeight: 700, color: '#1976d2' }}>
        Add Task
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField label="Title" name="title" value={task.title} onChange={handleChange} required />
          <TextField label="Description" name="description" value={task.description} onChange={handleChange} />
          <TextField
            label="Due Date"
            name="dueDate"
            type="datetime-local"
            value={task.dueDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            label="Priority"
            name="priority"
            value={task.priority}
            onChange={handleChange}
            SelectProps={{ native: true }}
            required
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="STARRED">Starred</option>
          </TextField>
          <TextField
            select
            label="Assign To"
            name="assignee"
            value={task.assignee}
            onChange={e => setTask(t => ({ ...t, assignee: e.target.value }))}
            SelectProps={{ native: true }}
            required
          >
            <option value="">Select User</option>
            {Array.isArray(users) && users.map(u => (
              <option key={u.username} value={u.username}>{u.username}</option>
            ))}
          </TextField>
          <TextField
            label="Owner"
            value={user}
            InputProps={{ readOnly: true }}
          />
          <Button type="submit" variant="contained" sx={{
            background: 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)',
            fontWeight: 600,
            borderRadius: 3
          }}>
            Create
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
