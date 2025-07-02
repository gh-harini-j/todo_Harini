import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { TextField, Button, Paper, Typography, Stack, Alert } from '@mui/material';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      // Remove .toLowerCase()
      const cleanUsername = form.username.trim();
      const res = await api.post('/auth/login', { ...form, username: cleanUsername });
      login(res.data.username, res.data.token);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
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
        Login
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField label="Username" name="username" value={form.username} onChange={handleChange} required />
          <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
          <Button type="submit" variant="contained" sx={{
            background: 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)',
            fontWeight: 600,
            borderRadius: 3
          }}>
            Login
          </Button>
        </Stack>
      </form>
      <Button onClick={() => navigate('/register')} sx={{ mt: 2, color: '#1976d2', fontWeight: 600 }}>
        Don't have an account? Register
      </Button>
    </Paper>
  );
}