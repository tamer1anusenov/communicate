import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Person as PersonIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Patient {
  id: string;
  name: string;
  birthDate: string;
  lastVisit: string;
}

const PatientSelection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // Моковые данные пациентов для демонстрации
  const patients: Patient[] = [
    {
      id: '1',
      name: 'Иван Иванов',
      birthDate: '1985-05-15',
      lastVisit: '2024-03-15',
    },
    {
      id: '2',
      name: 'Мария Петрова',
      birthDate: '1990-10-20',
      lastVisit: '2024-03-18',
    },
    {
      id: '3',
      name: 'Алексей Сидоров',
      birthDate: '1978-07-30',
      lastVisit: '2024-03-20',
    },
    {
      id: '4',
      name: 'Елена Смирнова',
      birthDate: '1982-12-10',
      lastVisit: '2024-03-10',
    },
    {
      id: '5',
      name: 'Дмитрий Козлов',
      birthDate: '1975-03-25',
      lastVisit: '2024-03-05',
    },
  ];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePatientSelect = (patientId: string) => {
    navigate(`/doctor-dashboard/medical-record/${patientId}`);
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Выбор пациента
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Выберите пациента для просмотра медицинской карты
        </Typography>
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Поиск пациента по имени"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton onClick={handleClearSearch} edge="end">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <List>
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient, index) => (
              <React.Fragment key={patient.id}>
                <ListItem 
                  button
                  onClick={() => handlePatientSelect(patient.id)}
                  sx={{
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={patient.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {calculateAge(patient.birthDate)} лет
                        </Typography>
                        {` — Последний визит: ${new Date(patient.lastVisit).toLocaleDateString()}`}
                      </>
                    }
                  />
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePatientSelect(patient.id);
                    }}
                  >
                    Мед. карта
                  </Button>
                </ListItem>
                {index < filteredPatients.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography color="text.secondary">
                По вашему запросу не найдено пациентов
              </Typography>
            </Box>
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default PatientSelection; 