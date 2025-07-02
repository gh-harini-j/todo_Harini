import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import TaskList from './pages/TaskList';
import TaskForm from './pages/TaskForm';
import Login from './pages/Login';
import Register from './pages/Register';
import RequireAuth from './RequireAuth';
import { AppBar, Toolbar, Typography, Container, Button, Box, Avatar } from '@mui/material';
import { useAuth } from './AuthContext';

export default function App() {
  const { user, logout } = useAuth();

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)',
          boxShadow: 4,
        }}
      >
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
            To Do List
          </Typography>
          {user ? (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/"
                sx={{ mx: 1, fontWeight: 600, letterSpacing: 0.5 }}
              >
                Tasks
              </Button>
              <Button
                color="inherit"
                onClick={logout}
                sx={{ mx: 1, fontWeight: 600, letterSpacing: 0.5 }}
              >
                Logout
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#fff', color: '#1976d2', fontWeight: 700, mr: 1 }}>
                  {user.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>
                  {user}
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                sx={{ mx: 1, fontWeight: 600, letterSpacing: 0.5 }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/register"
                sx={{ mx: 1, fontWeight: 600, letterSpacing: 0.5 }}
              >
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <RequireAuth>
              <TaskList />
            </RequireAuth>
          } />
          <Route path="/new" element={
            <RequireAuth>
              <TaskForm />
            </RequireAuth>
          } />
          <Route path="/edit/:id" element={
            <RequireAuth>
              <TaskForm />
            </RequireAuth>
          } />
        </Routes>
      </Container>
    </>
  );
}
