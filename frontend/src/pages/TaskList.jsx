import React, { useEffect, useState } from 'react';
import api from '../api';
import {
  Button, Snackbar, Alert, Typography, IconButton, Paper, Stack, Box, Tooltip, MenuItem, Select, LinearProgress
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const PRIORITY_COLORS = {
  LOW: '#43a047',
  MEDIUM: '#fb8c00',
  HIGH: '#e53935'
};

export default function TaskList() {
  const [assignedToMe, setAssignedToMe] = useState([]);
  const [assignedByMe, setAssignedByMe] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    api.get('/auth/users')
      .then(res => {
        const currentUser = res.data.find(u => u.username === user);
        // Debug: log what you get
        console.log('Current user:', currentUser);
        if (currentUser && String(currentUser.role).toUpperCase() === 'ADMIN') {
          setIsAdmin(true);
          fetchAllTasks();
        } else {
          setIsAdmin(false);
          fetchAssigned();
        }
      })
      .catch(() => setIsAdmin(false));
  }, [user]);

  const fetchAllTasks = () => {
    api.get('/tasks')
      .then(res => setAllTasks(res.data))
      .catch(() => setAllTasks([]));
  };

  const fetchAssigned = () => {
    api.get('/tasks/assigned-to-me').then(res => setAssignedToMe(res.data)).catch(() => setAssignedToMe([]));
    api.get('/tasks/assigned-by-me').then(res => setAssignedByMe(res.data)).catch(() => setAssignedByMe([]));
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    isAdmin ? fetchAllTasks() : fetchAssigned();
    setSnackbar({ open: true, message: 'Task deleted successfully!', severity: 'success' });
  };

  const toggleComplete = async (task) => {
    await api.put(`/tasks/${task.id}`, {
      ...task,
      completed: !task.completed,
      owner: task.owner,
      assignee: task.assignee
    });
    isAdmin ? fetchAllTasks() : fetchAssigned();
    setSnackbar({
      open: true,
      message: !task.completed ? 'Task marked as complete!' : 'Task marked as incomplete!',
      severity: 'info'
    });
  };

  const handlePriorityChange = async (task, newPriority) => {
    await api.put(`/tasks/${task.id}`, {
      ...task,
      priority: newPriority,
      owner: task.owner,
      assignee: task.assignee
    });
    isAdmin ? fetchAllTasks() : fetchAssigned();
    setSnackbar({
      open: true,
      message: `Priority changed to ${newPriority}`,
      severity: 'info'
    });
  };

  function formatDueDate(dueDate) {
    if (!dueDate) return '';
    if (Array.isArray(dueDate) && dueDate.length >= 3) {
      const [year, month, day, hour = 0, minute = 0, second = 0] = dueDate;
      const jsDate = new Date(year, month - 1, day, hour, minute, second);
      return jsDate.toLocaleString();
    }
    const parsed = Date.parse(dueDate);
    if (!isNaN(parsed)) {
      return new Date(parsed).toLocaleString();
    }
    return dueDate;
  }

  function isOverdue(task) {
    if (!task.dueDate || task.completed) return false;
    let due;
    if (Array.isArray(task.dueDate) && task.dueDate.length >= 3) {
      const [year, month, day, hour = 0, minute = 0, second = 0] = task.dueDate;
      due = new Date(year, month - 1, day, hour, minute, second);
    } else {
      due = new Date(task.dueDate);
    }
    return due < new Date();
  }

  if (error) return <Alert severity="error">{error}</Alert>;
  if (isAdmin === null) return null; // Wait for role check

  // For progress bar and summary
  const tasksForProgress = isAdmin
    ? allTasks
    : [...new Map([...assignedToMe, ...assignedByMe].map(t => [t.id, t])).values()];
  const completedCount = tasksForProgress.filter(t => t.completed).length;
  const progress = tasksForProgress.length ? (completedCount / tasksForProgress.length) * 100 : 0;

  const renderTasks = tasks => (
    <Stack spacing={2}>
      {tasks.length === 0 && <Typography color="text.secondary" align="center">No tasks to display.</Typography>}
      {tasks.map(task => (
        <Paper
          key={task.id}
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: task.completed
              ? 'linear-gradient(90deg, #e0f7fa 60%, #b2ebf2 100%)'
              : 'white',
            opacity: task.completed ? 0.7 : 1,
            borderLeft: `6px solid ${PRIORITY_COLORS[task.priority] || '#bdbdbd'}`,
            borderRadius: 3,
            boxShadow: 3,
            transition: 'box-shadow 0.2s, transform 0.2s',
            '&:hover': {
              boxShadow: 8,
              transform: 'scale(1.01)'
            }
          }}
          elevation={2}
        >
          <div style={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? '#616161' : '#212121',
                fontWeight: 600
              }}
            >
              {task.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {task.description}
            </Typography>
            {task.dueDate && (
              <Typography
                variant="caption"
                sx={{
                  color: isOverdue(task) ? '#d32f2f' : '#1976d2',
                  fontWeight: isOverdue(task) ? 700 : 500
                }}
              >
                Due: {formatDueDate(task.dueDate)}
                {isOverdue(task) && !task.completed && ' (Overdue)'}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Owner: {task.owner}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Assigned To: {task.assignee}
            </Typography>
          </div>
          <div>
            <Tooltip title="Change Priority" placement="top">
              <Select
                value={task.priority}
                onChange={e => handlePriorityChange(task, e.target.value)}
                size="small"
                sx={{
                  minWidth: 100,
                  mr: 1,
                  background: PRIORITY_COLORS[task.priority] + '22',
                  borderRadius: 2,
                  fontWeight: 600
                }}
              >
                <MenuItem value="LOW" sx={{ color: PRIORITY_COLORS.LOW }}>Low</MenuItem>
                <MenuItem value="MEDIUM" sx={{ color: PRIORITY_COLORS.MEDIUM }}>Medium</MenuItem>
                <MenuItem value="HIGH" sx={{ color: PRIORITY_COLORS.HIGH }}>High</MenuItem>
              </Select>
            </Tooltip>
            <Tooltip title={task.completed ? "Mark as incomplete" : "Mark as complete"}>
              <IconButton onClick={() => toggleComplete(task)} color={task.completed ? 'success' : 'default'}>
                {task.completed
                  ? <CheckCircleIcon sx={{ color: '#43a047' }} />
                  : <RadioButtonUncheckedIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                onClick={() => deleteTask(task.id)}
                color="error"
                variant="outlined"
                size="small"
                sx={{
                  ml: 1,
                  borderRadius: 2,
                  fontWeight: 600,
                  borderColor: '#e57373',
                  color: '#d32f2f',
                  '&:hover': {
                    background: '#ffebee',
                    borderColor: '#d32f2f'
                  }
                }}
              >
                Delete
              </Button>
            </Tooltip>
          </div>
        </Paper>
      ))}
    </Stack>
  );

  return (
    <Paper
      sx={{
        p: 3,
        maxWidth: 700,
        mx: 'auto',
        mt: 8,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e3f2fd 100%)',
        borderRadius: 4,
        boxShadow: 6
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1976d2' }}>
          {isAdmin ? 'All Tasks' : 'Your Tasks'}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/new')}
          sx={{
            borderRadius: 3,
            boxShadow: 2,
            fontWeight: 600,
            background: 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)'
          }}
        >
          Add Task
        </Button>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          mb: 2,
          height: 12,
          borderRadius: 5,
          background: '#e3eafc',
          '& .MuiLinearProgress-bar': {
            background: 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)'
          }
        }}
      />
      <Typography variant="body2" mb={2} sx={{ color: '#1976d2', fontWeight: 500 }}>
        {completedCount} of {tasksForProgress.length} tasks completed
      </Typography>
      <Box sx={{ mt: 2 }}>
        {isAdmin === true ? (
          renderTasks(allTasks)
        ) : (
          <>
            <Typography variant="h6" sx={{ mb: 1 }}>Assigned To Me</Typography>
            {renderTasks(assignedToMe)}
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Assigned By Me</Typography>
            {renderTasks(assignedByMe)}
          </>
        )}
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Paper>
  );
}
