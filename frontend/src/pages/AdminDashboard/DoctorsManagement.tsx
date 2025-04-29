import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

// Интерфейс для данных о враче
interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  appointmentsCount: number;
  status: 'active' | 'vacation' | 'sick-leave';
  contactInfo: string;
}

const DoctorsManagement: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: '1',
      name: 'Иванов Иван Иванович',
      specialization: 'Терапевт',
      experience: '10 лет',
      appointmentsCount: 45,
      status: 'active',
      contactInfo: '+7 (XXX) XXX-XX-XX',
    },
    {
      id: '2',
      name: 'Петрова Мария Александровна',
      specialization: 'Кардиолог',
      experience: '15 лет',
      appointmentsCount: 32,
      status: 'active',
      contactInfo: '+7 (XXX) XXX-XX-XX',
    },
    {
      id: '3',
      name: 'Сидоров Алексей Петрович',
      specialization: 'Невролог',
      experience: '8 лет',
      appointmentsCount: 28,
      status: 'vacation',
      contactInfo: '+7 (XXX) XXX-XX-XX',
    },
    {
      id: '4',
      name: 'Кузнецова Елена Сергеевна',
      specialization: 'Эндокринолог',
      experience: '12 лет',
      appointmentsCount: 30,
      status: 'active',
      contactInfo: '+7 (XXX) XXX-XX-XX',
    },
    {
      id: '5',
      name: 'Козлов Дмитрий Александрович',
      specialization: 'Хирург',
      experience: '20 лет',
      appointmentsCount: 15,
      status: 'sick-leave',
      contactInfo: '+7 (XXX) XXX-XX-XX',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState<Omit<Doctor, 'id' | 'appointmentsCount'>>({
    name: '',
    specialization: '',
    experience: '',
    status: 'active',
    contactInfo: '',
  });

  // Список специализаций
  const specializations = [
    'Терапевт',
    'Кардиолог',
    'Невролог',
    'Эндокринолог',
    'Хирург',
    'Офтальмолог',
    'Отоларинголог',
    'Гастроэнтеролог',
    'Дерматолог',
    'Педиатр',
  ];

  // Обработчик поиска
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Фильтрация врачей по поисковому запросу
  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Обработчики для диалогов
  const handleEditClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedDoctor) {
      setDoctors(prevDoctors =>
        prevDoctors.map(doctor =>
          doctor.id === selectedDoctor.id ? selectedDoctor : doctor
        )
      );
      setIsEditDialogOpen(false);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedDoctor) {
      setDoctors(prevDoctors =>
        prevDoctors.filter(doctor => doctor.id !== selectedDoctor.id)
      );
      setIsDeleteDialogOpen(false);
    }
  };

  const handleAddDoctor = () => {
    const newId = (Math.max(...doctors.map(d => parseInt(d.id))) + 1).toString();
    
    setDoctors(prevDoctors => [
      ...prevDoctors,
      {
        id: newId,
        ...newDoctor,
        appointmentsCount: 0,
      }
    ]);
    
    setIsAddDialogOpen(false);
    setNewDoctor({
      name: '',
      specialization: '',
      experience: '',
      status: 'active',
      contactInfo: '',
    });
  };

  // Получение цвета статуса
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'vacation':
        return 'warning';
      case 'sick-leave':
        return 'error';
      default:
        return 'default';
    }
  };

  // Получение текста статуса
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активен';
      case 'vacation':
        return 'Отпуск';
      case 'sick-leave':
        return 'Больничный';
      default:
        return 'Неизвестно';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">
            Управление врачами
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsAddDialogOpen(true)}
          >
            Добавить врача
          </Button>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Поиск по имени или специализации"
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
                <IconButton onClick={() => setSearchQuery('')} edge="end">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Имя</TableCell>
                <TableCell>Специализация</TableCell>
                <TableCell>Опыт</TableCell>
                <TableCell>Кол-во приемов</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell>{doctor.name}</TableCell>
                    <TableCell>{doctor.specialization}</TableCell>
                    <TableCell>{doctor.experience}</TableCell>
                    <TableCell>{doctor.appointmentsCount}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(doctor.status)}
                        color={getStatusColor(doctor.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditClick(doctor)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(doctor)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      Не найдено врачей по вашему запросу
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Диалог редактирования врача */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Редактирование информации о враче</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ФИО"
                value={selectedDoctor?.name || ''}
                onChange={(e) => setSelectedDoctor(prev => 
                  prev ? { ...prev, name: e.target.value } : null
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Специализация</InputLabel>
                <Select
                  value={selectedDoctor?.specialization || ''}
                  label="Специализация"
                  onChange={(e: SelectChangeEvent) => setSelectedDoctor(prev => 
                    prev ? { ...prev, specialization: e.target.value } : null
                  )}
                >
                  {specializations.map((spec) => (
                    <MenuItem key={spec} value={spec}>
                      {spec}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Опыт работы"
                value={selectedDoctor?.experience || ''}
                onChange={(e) => setSelectedDoctor(prev => 
                  prev ? { ...prev, experience: e.target.value } : null
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Статус</InputLabel>
                <Select
                  value={selectedDoctor?.status || 'active'}
                  label="Статус"
                  onChange={(e: SelectChangeEvent) => setSelectedDoctor(prev => 
                    prev ? { ...prev, status: e.target.value as Doctor['status'] } : null
                  )}
                >
                  <MenuItem value="active">Активен</MenuItem>
                  <MenuItem value="vacation">Отпуск</MenuItem>
                  <MenuItem value="sick-leave">Больничный</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Контактная информация"
                value={selectedDoctor?.contactInfo || ''}
                onChange={(e) => setSelectedDoctor(prev => 
                  prev ? { ...prev, contactInfo: e.target.value } : null
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы действительно хотите удалить врача "{selectedDoctor?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог добавления врача */}
      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Добавление нового врача</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ФИО"
                value={newDoctor.name}
                onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Специализация</InputLabel>
                <Select
                  value={newDoctor.specialization}
                  label="Специализация"
                  onChange={(e: SelectChangeEvent) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                >
                  {specializations.map((spec) => (
                    <MenuItem key={spec} value={spec}>
                      {spec}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Опыт работы"
                value={newDoctor.experience}
                onChange={(e) => setNewDoctor({ ...newDoctor, experience: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Статус</InputLabel>
                <Select
                  value={newDoctor.status}
                  label="Статус"
                  onChange={(e: SelectChangeEvent) => setNewDoctor({ ...newDoctor, status: e.target.value as Doctor['status'] })}
                >
                  <MenuItem value="active">Активен</MenuItem>
                  <MenuItem value="vacation">Отпуск</MenuItem>
                  <MenuItem value="sick-leave">Больничный</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Контактная информация"
                value={newDoctor.contactInfo}
                onChange={(e) => setNewDoctor({ ...newDoctor, contactInfo: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>Отмена</Button>
          <Button 
            onClick={handleAddDoctor} 
            variant="contained" 
            color="primary"
            disabled={!newDoctor.name || !newDoctor.specialization || !newDoctor.experience}
          >
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DoctorsManagement; 