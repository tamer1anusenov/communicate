import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Link,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { register, clearError } from '../../store/slices/authSlice';
import Grid from '@mui/material/Grid'; 

// Define proper types for styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: theme.spacing(4),
}));

const Form = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(3),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
  padding: theme.spacing(1.5),
}));

const FormRow = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const FooterWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'component'
})(({ theme }) => ({
  backgroundColor: '#1a1a1a',
  color: '#fff',
  padding: theme.spacing(6, 0),
  marginTop: 'auto',
}));

// Define form data interface with proper types
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  inn: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: 'PATIENT' | 'DOCTOR';
}

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    inn: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'PATIENT',
  });

  useEffect(() => {
    if (isAuthenticated && location.state?.from) {
      const from = location.state.from?.pathname || '/';
      navigate(from, { replace: true });
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, location.state, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    // Validate INN
    if (formData.inn.length !== 12 || !/^\d+$/.test(formData.inn)) {
      return;
    }
    
    const registrationData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      inn: formData.inn,
      phone: formData.phone,
      password: formData.password,
      role: formData.role.toUpperCase() // Convert role to uppercase
    };
    
    try {
      await dispatch(register(registrationData)).unwrap();
      navigate('/');
    } catch (err) {
      // Error is handled by the reducer
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Container maxWidth="sm">
        <StyledPaper elevation={3}>
          <CircularProgress />
        </StyledPaper>
      </Container>
    );
  }

  // Show already authenticated message
  if (isAuthenticated && !location.state?.from) {
    return (
      <Container maxWidth="sm">
        <StyledPaper elevation={3}>
          <Typography component="h1" variant="h4" gutterBottom>
            Вы уже зарегистрированы
          </Typography>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            На главную
          </Button>
        </StyledPaper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <StyledPaper elevation={3}>
        <Typography component="h1" variant="h4" gutterBottom>
          Регистрация
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" paragraph>
          Заполните форму для создания нового аккаунта
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Имя"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!error}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Фамилия"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!error}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!error}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="ИНН"
                name="inn"
                value={formData.inn}
                onChange={handleChange}
                error={!!error}
                disabled={loading}
                helperText="ИНН должен содержать ровно 12 цифр"
                inputProps={{
                  maxLength: 12,
                  pattern: '[0-9]*'
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Телефон"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!error}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                select
                label="Роль"
                name="role"
                value={formData.role}
                onChange={handleChange}
                error={!!error}
                disabled={loading}
              >
                <MenuItem value="PATIENT">Пациент</MenuItem>
                <MenuItem value="DOCTOR">Врач</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Пароль"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={!!error}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Подтвердите пароль"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!error}
                disabled={loading}
              />
            </Grid>
          </Grid>
          
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Зарегистрироваться'}
          </SubmitButton>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Уже есть аккаунт?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
                disabled={loading}
              >
                Войти
              </Link>
            </Typography>
          </Box>
        </Form>
      </StyledPaper>
    </Container>
  );
};

export default Registration;