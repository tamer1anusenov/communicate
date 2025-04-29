import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../store';
import { RootState } from '../../store';
import { login } from '../../store/slices/authSlice';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';

import RoleSelector, { UserRole } from '../../components/RoleSelector/RoleSelector';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading, error: authError, user } = useSelector(
    (state: RootState) => state.auth
  );

  const [role, setRole] = useState<UserRole>('patient');
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    passcode: '' // Only for admin
  });

  // We'll handle navigation only in the submit handler

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setFormData({ identifier: '', password: '', passcode: '' });
  };

  // Always redirect to home page after login
  const getRedirectPath = (): string => {
    return '/';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form data
    if (role === 'admin' && (!formData.passcode || !formData.password)) {
      return;
    } else if (role !== 'admin' && (!formData.identifier || !formData.password)) {
      return;
    }
    
    // Create login data object based on role
    let loginData;
    if (role === 'admin') {
      loginData = {
        passcode: formData.passcode,
        password: formData.password,
        role
      };
    } else {
      loginData = {
        identifier: formData.identifier,
        password: formData.password,
        role
      };
    }
    
    // Dispatch login action with properly formatted data
    try {
      console.log('Attempting login with data:', loginData);
      const result = await dispatch(login(loginData)).unwrap();
      console.log('Login response:', result);
      if (result && result.token && result.user) {
        // Store authentication info in localStorage for Header component
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', result.user.role);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Redirect to home page
        const homePath = getRedirectPath();
        console.log(`Login successful, redirecting to ${homePath}`);
        navigate(homePath);
      }
    } catch (error) {
      // Error is already handled by the auth slice
      console.error('Login failed:', error);
      // Stay on login page on error
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Вход в систему
          </Typography>

          <RoleSelector role={role} onRoleChange={handleRoleChange} />

          {authError && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {authError === 'Invalid credentials' ? 'Неверный email или пароль' : authError}
            </Alert>
          )}


          <form style={{ width: '100%', marginTop: 1 }} onSubmit={handleSubmit}>
            {role === 'admin' ? (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="passcode"
                  label="Admin Passcode"
                  name="passcode"
                  autoFocus
                  value={formData.passcode}
                  onChange={handleChange}
                  disabled={loading}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Пароль"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
              </>
            ) : (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="identifier"
                  label="Email или ИНН"
                  name="identifier"
                  autoComplete="email"
                  autoFocus
                  value={formData.identifier}
                  onChange={handleChange}
                  disabled={loading}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Пароль"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
              </>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Войти'}
            </Button>
          </form>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Нет аккаунта?{' '}
              <RouterLink
                to="/register"
                style={{ color: 'inherit', textDecoration: 'underline' }}
              >
                Зарегистрироваться
              </RouterLink>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;