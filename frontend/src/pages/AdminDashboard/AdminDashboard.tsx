import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Tabs,
  Tab,
  CardActions,
} from '@mui/material';
import {
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
  Event as EventIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Science as ScienceIcon,
  AccountBox as UserIcon,
  MedicalInformation as MedicalIcon,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAction = (type: string, action: 'edit' | 'delete' | 'add') => {
    // Implement action handling
    console.log(`${type} - Action: ${action}`);
  };

  // Навигация на соответствующие страницы
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" component="h1">
                Панель администратора
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Управление медицинским центром "Керемет"
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Всего пользователей
              </Typography>
              <Typography variant="h4" component="div">
                250
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <HospitalIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Врачи
              </Typography>
              <Typography variant="h4" component="div">
                15
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Приемы сегодня
              </Typography>
              <Typography variant="h4" component="div">
                45
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Management Section */}
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Управление системой
          </Typography>
        </Grid>

        {/* Карточки разделов управления */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <UserIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                <Typography variant="h6" align="center" gutterBottom>
                  Пользователи
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary">
                  Управление аккаунтами пациентов
                </Typography>
              </Box>
            </CardContent>
            <CardActions>
              <Button 
                fullWidth 
                variant="contained" 
                onClick={() => handleNavigate('/admin-dashboard/users')}
              >
                Перейти
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <HospitalIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                <Typography variant="h6" align="center" gutterBottom>
                  Врачи
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary">
                  Управление врачами и специалистами
                </Typography>
              </Box>
            </CardContent>
            <CardActions>
              <Button 
                fullWidth 
                variant="contained" 
                onClick={() => handleNavigate('/admin-dashboard/doctors')}
              >
                Перейти
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <EventIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                <Typography variant="h6" align="center" gutterBottom>
                  Приемы
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary">
                  Управление записями на прием
                </Typography>
              </Box>
            </CardContent>
            <CardActions>
              <Button 
                fullWidth 
                variant="contained" 
                onClick={() => handleNavigate('/admin-dashboard/appointments')}
              >
                Перейти
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ScienceIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                <Typography variant="h6" align="center" gutterBottom>
                  Анализы
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary">
                  Управление тестами и анализами
                </Typography>
              </Box>
            </CardContent>
            <CardActions>
              <Button 
                fullWidth 
                variant="contained" 
                onClick={() => handleNavigate('/admin-dashboard/tests')}
              >
                Перейти
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Системная информация */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Системная информация
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Последнее обновление системы:
                </Typography>
                <Typography variant="body1">
                  15 апреля 2024, 10:30
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Версия системы:
                </Typography>
                <Typography variant="body1">
                  1.0.0
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="text.secondary">
                  Статус системы:
                </Typography>
                <Typography variant="body1" sx={{ color: 'success.main' }}>
                  Работает нормально
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard; 