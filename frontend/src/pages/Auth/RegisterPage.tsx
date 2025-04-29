import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../store';
import { RootState } from '../../store';
import { register } from '../../store/slices/authSlice';
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

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading, error: authError, user } = useSelector(
    (state: RootState) => state.auth
  );

  const getDashboardPath = (role: string): string => {
    switch (role) {
      case 'admin':
        return '/admin-dashboard';
      case 'doctor':
        return '/doctor-dashboard';
      case 'patient':
        return '/profile';
      default:
        return '/';
    }
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient' as UserRole,
    inn: '',
    phone: '',
    specialization: '', // Only for doctor
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardPath = getDashboardPath(user.role);
      navigate(dashboardPath);
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (newRole: UserRole) => {
    setFormData(prev => ({
      ...prev,
      role: newRole
    }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    const registrationData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      inn: formData.inn,
      phone: formData.phone,
      ...(formData.role === 'doctor' && { specialization: formData.specialization })
    };

    try {
      await dispatch(register(registrationData)).unwrap();
    } catch (err) {
      console.error('Registration failed:', err);
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
            Регистрация
          </Typography>

          {authError && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {authError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="firstName"
              label="Имя"
              id="firstName"
              autoComplete="given-name"
              value={formData.firstName}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="lastName"
              label="Фамилия"
              id="lastName"
              autoComplete="family-name"
              value={formData.lastName}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={formData.email}
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
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Подтвердите пароль"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="inn"
              label="ИНН"
              type="text"
              id="inn"
              value={formData.inn}
              onChange={handleChange}
              disabled={loading}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="phone"
              label="Номер телефона"
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
            />

            <RoleSelector role={formData.role} onRoleChange={handleRoleChange} />

            {formData.role === 'doctor' && (
              <TextField
                margin="normal"
                required
                fullWidth
                select
                name="specialization"
                label="Специализация доктора"
                value={formData.specialization}
                onChange={handleChange}
                disabled={loading}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">Выберите специализацию</option>
                <option value="therapist">Терапевт</option>
                <option value="cardiologist">Кардиолог</option>
                <option value="neurologist">Невролог</option>
                <option value="pediatrician">Педиатр</option>
                <option value="surgeon">Хирург</option>
                <option value="dentist">Стоматолог</option>
                <option value="ophthalmologist">Офтальмолог</option>
                <option value="dermatologist">Дерматолог</option>
                <option value="psychiatrist">Психиатр</option>
                <option value="endocrinologist">Эндокринолог</option>
              </TextField>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Зарегистрироваться'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Уже есть аккаунт?{' '}
                <RouterLink
                  to="/login"
                  style={{ color: 'inherit', textDecoration: 'underline' }}
                >
                  Войти
                </RouterLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;