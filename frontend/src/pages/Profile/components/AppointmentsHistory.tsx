import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Grid,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  CalendarToday,
  AccessTime,
  Person,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledChip = styled(Chip)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

interface Appointment {
  id: string;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  status: 'completed' | 'scheduled' | 'cancelled';
  notes?: string;
}

const AppointmentsHistory: React.FC = () => {
  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      doctorName: 'Алина Ким',
      specialization: 'Терапевт',
      date: '2023-04-15',
      time: '10:00',
      status: 'completed',
      notes: 'Рекомендовано пройти общий анализ крови, контроль артериального давления',
    },
    {
      id: '2',
      doctorName: 'Руслан Ахметов',
      specialization: 'Кардиолог',
      date: '2023-05-20',
      time: '14:30',
      status: 'scheduled',
      notes: 'Плановый осмотр, контроль ЭКГ',
    },
    {
      id: '3',
      doctorName: 'Мария Петрова',
      specialization: 'Гастроэнтеролог',
      date: '2023-03-10',
      time: '11:15',
      status: 'completed',
      notes: 'Коррекция лечения гастрита, назначены новые препараты',
    },
    {
      id: '4',
      doctorName: 'Дмитрий Соколов',
      specialization: 'Невролог',
      date: '2023-02-28',
      time: '09:30',
      status: 'completed',
      notes: 'Осмотр по поводу остеохондроза, назначен курс массажа',
    },
    {
      id: '5',
      doctorName: 'Елена Иванова',
      specialization: 'Аллерголог',
      date: '2023-04-05',
      time: '13:45',
      status: 'completed',
      notes: 'Сезонное обострение, скорректирована терапия',
    }
  ]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Partial<Appointment>>({});

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, appointment: Appointment) => {
    setAnchorEl(event.currentTarget);
    setSelectedAppointment(appointment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAppointment(null);
  };

  const handleEdit = () => {
    if (selectedAppointment) {
      setEditingAppointment(selectedAppointment);
      setOpenDialog(true);
      handleMenuClose();
    }
  };

  const handleDelete = () => {
    if (selectedAppointment) {
      // Implement delete logic here
      handleMenuClose();
    }
  };

  const handleSave = () => {
    if (editingAppointment.id) {
      // Implement save logic here
      setOpenDialog(false);
      setEditingAppointment({});
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'scheduled':
        return 'primary';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Завершен';
      case 'scheduled':
        return 'Запланирован';
      case 'cancelled':
        return 'Отменен';
      default:
        return status;
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        История приёмов
      </Typography>

      <List>
        {appointments.map((appointment) => (
          <Paper key={appointment.id} sx={{ mb: 2, p: 2 }} elevation={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6">{appointment.doctorName}</Typography>
                    <StyledChip
                      label={getStatusLabel(appointment.status)}
                      color={getStatusColor(appointment.status)}
                      size="small"
                    />
                  </Box>
                }
                secondary={
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarToday sx={{ mr: 1, fontSize: 16 }} />
                        <Typography variant="body2">
                          {appointment.date}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime sx={{ mr: 1, fontSize: 16 }} />
                        <Typography variant="body2">
                          {appointment.time}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Person sx={{ mr: 1, fontSize: 16 }} />
                        <Typography variant="body2">
                          {appointment.specialization}
                        </Typography>
                      </Box>
                      {appointment.notes && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Примечания: {appointment.notes}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="more"
                  onClick={(e) => handleMenuClick(e, appointment)}
                >
                  <MoreVert />
                </IconButton>
              </ListItemSecondaryAction>
            </Box>
          </Paper>
        ))}
      </List>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1 }} /> Редактировать
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <Delete sx={{ mr: 1 }} /> Удалить
        </MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Редактировать запись</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Врач"
            fullWidth
            value={editingAppointment.doctorName || ''}
            onChange={(e) => setEditingAppointment({ ...editingAppointment, doctorName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Специализация"
            fullWidth
            value={editingAppointment.specialization || ''}
            onChange={(e) => setEditingAppointment({ ...editingAppointment, specialization: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Дата"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={editingAppointment.date || ''}
            onChange={(e) => setEditingAppointment({ ...editingAppointment, date: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Время"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={editingAppointment.time || ''}
            onChange={(e) => setEditingAppointment({ ...editingAppointment, time: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Примечания"
            fullWidth
            multiline
            rows={2}
            value={editingAppointment.notes || ''}
            onChange={(e) => setEditingAppointment({ ...editingAppointment, notes: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button onClick={handleSave} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentsHistory; 