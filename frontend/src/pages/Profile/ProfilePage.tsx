import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  MedicalServices,
  CalendarToday,
  Science,
  LocalPharmacy,
  Person,
  Notifications,
  Edit as EditIcon,
} from '@mui/icons-material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import MedicalRecord from './components/MedicalRecord';
import AppointmentsHistory from './components/AppointmentsHistory';
import Prescriptions from './components/Prescriptions';
import TestsPage from '../Tests/TestsPage';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  patronymic: string;
  email: string;
  phone: string;
  birthDate: string;
  inn: string;
}

const ProfilePage: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    patronymic: user.patronymic || '',
    email: user.email || '',
    phone: user.phone || '',
    birthDate: '1990-01-01', // Non-editable
    inn: '123456789012', // Non-editable
  });

  const menuItems = [
    { id: 'dashboard', label: 'Главная', icon: <Person /> },
    { id: 'medical-record', label: 'Медицинская карта', icon: <MedicalServices /> },
    { id: 'appointments', label: 'История приёмов', icon: <CalendarToday /> },
    { id: 'tests', label: 'Анализы', icon: <Science /> },
    { id: 'prescriptions', label: 'Рецепты', icon: <LocalPharmacy /> },
  ];

  const handleEditDialogOpen = () => {
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleSavePersonalInfo = () => {
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify({
      ...user,
      ...personalInfo
    }));
    handleEditDialogClose();
  };

  const renderPersonalInfo = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Личная информация</Typography>
        <IconButton onClick={handleEditDialogOpen} color="primary">
          <EditIcon />
        </IconButton>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="text.secondary">
            ФИО
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {`${personalInfo.lastName} ${personalInfo.firstName} ${personalInfo.patronymic}`}
          </Typography>

          <Typography variant="subtitle2" color="text.secondary">
            Email
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {personalInfo.email}
          </Typography>

          <Typography variant="subtitle2" color="text.secondary">
            Телефон
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {personalInfo.phone}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Дата рождения
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {personalInfo.birthDate}
          </Typography>

          <Typography variant="subtitle2" color="text.secondary">
            ИИН
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {personalInfo.inn}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderEditDialog = () => (
    <Dialog open={isEditDialogOpen} onClose={handleEditDialogClose} maxWidth="sm" fullWidth>
      <DialogTitle>Редактировать личную информацию</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Фамилия"
              value={personalInfo.lastName}
              onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Имя"
              value={personalInfo.firstName}
              onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Отчество"
              value={personalInfo.patronymic}
              onChange={(e) => setPersonalInfo({ ...personalInfo, patronymic: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={personalInfo.email}
              onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Телефон"
              value={personalInfo.phone}
              onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Дата рождения"
              value={personalInfo.birthDate}
              disabled
              helperText="Дата рождения не может быть изменена"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="ИИН"
              value={personalInfo.inn}
              disabled
              helperText="ИИН не может быть изменен"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleEditDialogClose}>Отмена</Button>
        <Button onClick={handleSavePersonalInfo} variant="contained">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderContent = () => {
    switch (selectedSection) {
      case 'dashboard':
        return (
          <>
            {renderPersonalInfo()}
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Ближайшие приёмы
                  </Typography>
                  <Calendar
                    onChange={(value) => {
                      if (value instanceof Date) {
                        setSelectedDate(value);
                      }
                    }}
                    value={selectedDate}
                    locale="ru-RU"
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Уведомления
                  </Typography>
                  {/* Add notifications content here */}
                </Paper>
              </Grid>
            </Grid>
          </>
        );
      case 'medical-record':
        return <MedicalRecord />;
      case 'appointments':
        return <AppointmentsHistory />;
      case 'tests':
        return <TestsPage />;
      case 'prescriptions':
        return <Prescriptions />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  margin: '0 auto',
                  mb: 2,
                  bgcolor: '#00A6B4',
                }}
              >
                {personalInfo.firstName.charAt(0)}
                {personalInfo.lastName.charAt(0)}
              </Avatar>
              <Typography variant="h6">
                {personalInfo.firstName} {personalInfo.lastName}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              {menuItems.map((item) => (
                <ListItem
                  button
                  key={item.id}
                  selected={selectedSection === item.id}
                  onClick={() => setSelectedSection(item.id)}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    '&.Mui-selected': {
                      backgroundColor: '#E6F4F8',
                      '&:hover': {
                        backgroundColor: '#E6F4F8',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: '#00A6B4' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
          {renderContent()}
        </Grid>
      </Grid>
      {renderEditDialog()}
    </Container>
  );
};

export default ProfilePage; 