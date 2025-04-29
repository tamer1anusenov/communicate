import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
}

interface AppointmentsManagerProps {
  appointments: Appointment[];
  onUpdateAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (id: string) => void;
}

const AppointmentsManager: React.FC<AppointmentsManagerProps> = ({
  appointments,
  onUpdateAppointment,
  onDeleteAppointment,
}) => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleEditClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsEditDialogOpen(true);
  };

  const handleStatusChange = (appointment: Appointment, newStatus: 'scheduled' | 'completed' | 'cancelled') => {
    onUpdateAppointment({ ...appointment, status: newStatus });
  };

  const handleSaveEdit = () => {
    if (selectedAppointment) {
      onUpdateAppointment(selectedAppointment);
      setIsEditDialogOpen(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredAppointments = appointments.filter(apt => 
    filterStatus === 'all' ? true : apt.status === filterStatus
  );

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Управление приемами</Typography>
        <TextField
          select
          label="Фильтр по статусу"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">Все приемы</MenuItem>
          <MenuItem value="scheduled">Запланированные</MenuItem>
          <MenuItem value="completed">Завершенные</MenuItem>
          <MenuItem value="cancelled">Отмененные</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Пациент</TableCell>
              <TableCell>Дата</TableCell>
              <TableCell>Время</TableCell>
              <TableCell>Причина</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAppointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.patientName}</TableCell>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>{appointment.reason}</TableCell>
                <TableCell>
                  <Chip
                    label={appointment.status}
                    color={getStatusColor(appointment.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleEditClick(appointment)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleStatusChange(appointment, 'completed')}
                    sx={{ mr: 1 }}
                    color="success"
                  >
                    <CheckCircleIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleStatusChange(appointment, 'cancelled')}
                    sx={{ mr: 1 }}
                    color="error"
                  >
                    <CancelIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDeleteAppointment(appointment.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Редактирование приема</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Пациент"
                value={selectedAppointment?.patientName || ''}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Дата"
                value={selectedAppointment?.date || ''}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Время"
                value={selectedAppointment?.time || ''}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Причина"
                value={selectedAppointment?.reason || ''}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Заметки"
                multiline
                rows={4}
                value={selectedAppointment?.notes || ''}
                onChange={(e) => setSelectedAppointment(prev => 
                  prev ? { ...prev, notes: e.target.value } : null
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
    </Box>
  );
};

export default AppointmentsManager; 