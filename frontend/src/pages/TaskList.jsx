import React, { useEffect, useState } from 'react';
import api from '../api';
import {
  Button, Snackbar, Alert, LinearProgress, Typography, IconButton, Paper, Stack, ToggleButton, ToggleButtonGroup, Box, Tooltip
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useNavigate } from 'react-router-dom';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const fetchTasks = () => {
    api.get('/tasks')
      .then(response => setTasks(response.data))
      .catch(err => {
        if (err.response && err.response.status === 403) {
          setError('Access forbidden: Please make sure you are logged in and have permission to view tasks.');
        } else {
          setError('Failed to load tasks.');
        }
        console.error(err);
      });
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    fetchTasks();
    setSnackbar({ open: true, message: 'Task deleted successfully!', severity: 'success' });
  };

  const toggleComplete = async (task) => {
    await api.put(`/tasks/${task.id}`, {
      ...task,
      completed: !task.completed,
      owner: task.owner,         // username string
      assignee: task.assignee    // username string
    });
    fetchTasks();
    setSnackbar({
      open: true,
      message: !task.completed ? 'Task marked as complete!' : 'Task marked as incomplete!',
      severity: 'info'
    });
  };

  const togglePriority = async (task) => {
    await api.put(`/tasks/${task.id}`, {
      ...task,
      priority: task.priority === 1 ? 0 : 1,
      owner: task.owner,         // username string
      assignee: task.assignee    // username string
    });
    fetchTasks();
    setSnackbar({
      open: true,
      message: task.priority === 1 ? 'Task unstarred.' : 'Task starred!',
      severity: 'info'
    });
  };

  // Filtering logic
  const filteredTasks = tasks.filter(task => {
    if (filter === 'starred') return task.priority === 1;
    if (filter === 'completed') return task.completed;
    return true;
  });

  // Progress bar calculation
  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length ? (completedCount / tasks.length) * 100 : 0;

  // Helper for due date formatting and overdue check
  function formatDueDate(dueDate) {
    if (!dueDate) return '';
    if (Array.isArray(dueDate) && dueDate.length >= 3) {
      const jsDate = new Date(
        dueDate[0],
        dueDate[1] - 1,
        dueDate[2],
        dueDate[3] || 0,
        dueDate[4] || 0,
        dueDate[5] || 0
      );
      return jsDate.toLocaleString();
    }
    if (typeof dueDate === 'object' && dueDate.year && dueDate.month && dueDate.day) {
      const jsDate = new Date(
        dueDate.year,
        dueDate.month - 1,
        dueDate.day,
        dueDate.hour || 0,
        dueDate.minute || 0,
        dueDate.second || 0
      );
      return jsDate.toLocaleString();
    }
    if (typeof dueDate === 'number') {
      const ms = dueDate < 1e12 ? dueDate * 1000 : dueDate;
      return new Date(ms).toLocaleString();
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
    if (typeof task.dueDate === 'object' && task.dueDate.year) {
      due = new Date(
        task.dueDate.year,
        task.dueDate.month - 1,
        task.dueDate.day,
        task.dueDate.hour || 0,
        task.dueDate.minute || 0,
        task.dueDate.second || 0
      );
    } else if (typeof task.dueDate === 'number') {
      due = new Date(task.dueDate < 1e12 ? task.dueDate * 1000 : task.dueDate);
    } else {
      due = new Date(task.dueDate);
    }
    return due < new Date();
  }

  if (error) return <Alert severity="error">{error}</Alert>;

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
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1976d2' }}>Your Tasks</Typography>
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
        {completedCount} of {tasks.length} tasks completed
      </Typography>
      <Box mb={2}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, val) => val && setFilter(val)}
          aria-label="task filter"
          size="small"
          sx={{
            background: '#e3eafc',
            borderRadius: 2,
            p: 0.5
          }}
        >
          <ToggleButton value="all" aria-label="all tasks" sx={{ fontWeight: 600 }}>All</ToggleButton>
          <ToggleButton value="starred" aria-label="starred tasks" sx={{ fontWeight: 600 }}>Starred</ToggleButton>
          <ToggleButton value="completed" aria-label="completed tasks" sx={{ fontWeight: 600 }}>Completed</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Stack spacing={2}>
        {filteredTasks.length === 0 && (
          <Typography color="text.secondary" align="center">No tasks to display.</Typography>
        )}
        {filteredTasks.map(task => (
          <Paper
            key={task.id}
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: task.completed
                ? 'linear-gradient(90deg, #e0f7fa 60%, #b2ebf2 100%)'
                : (task.priority === 1
                  ? 'linear-gradient(90deg, #fffde7 60%, #fff9c4 100%)'
                  : 'white'),
              opacity: task.completed ? 0.7 : 1,
              borderLeft: task.priority === 1 ? '6px solid #fbc02d' : '6px solid transparent',
              borderRadius: 3,
              boxShadow: 3,
              transition: 'box-shadow 0.2s, transform 0.2s',
              '&:hover': {
                boxShadow: 8,
                transform: 'scale(1.01)'
              }
            }}
            elevation={task.priority === 1 ? 4 : 1}
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
              <Tooltip title={task.priority === 1 ? "Unstar" : "Star"}>
                <IconButton onClick={() => togglePriority(task)} color={task.priority === 1 ? 'warning' : 'default'}>
                  {task.priority === 1 ? <StarIcon sx={{ color: '#fbc02d' }} /> : <StarBorderIcon />}
                </IconButton>
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
