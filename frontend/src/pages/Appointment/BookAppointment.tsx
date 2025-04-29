import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  CircularProgress,
  SelectChangeEvent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import { format, isToday, isTomorrow, addDays } from 'date-fns';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import { doctors, appointments } from '../../services/api';

// Doctor interface
interface Doctor {
  id: string;
  user: {
    firstName: string;
    lastName: string;
  };
  specialization: string;
}

// Time slot interface
interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  doctorId: string;
  formattedStartTime?: string;
  formattedEndTime?: string;
}

// Specialization enum
enum Specialization {
  THERAPIST = 'THERAPIST',
  CARDIOLOGIST = 'CARDIOLOGIST',
  NEUROLOGIST = 'NEUROLOGIST',
  PEDIATRICIAN = 'PEDIATRICIAN',
  SURGEON = 'SURGEON',
  DENTIST = 'DENTIST',
  OPHTHALMOLOGIST = 'OPHTHALMOLOGIST',
  DERMATOLOGIST = 'DERMATOLOGIST',
  PSYCHIATRIST = 'PSYCHIATRIST',
  ENDOCRINOLOGIST = 'ENDOCRINOLOGIST',
}

const BookAppointment: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const patientId = user?.id;

  // State for doctors and time slots
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [slotsByHour, setSlotsByHour] = useState<Record<string, TimeSlot[]>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // State for filters
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // State for booking dialog
  const [showBookingDialog, setShowBookingDialog] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [notes, setNotes] = useState<string>('');

  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch time slots when doctor or date changes
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableTimeSlots();
    }
  }, [selectedDoctor, selectedDate]);

  // Fetch doctors from API
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await doctors.getAll();
      setDoctorsList(data);
      
      // If specialization is selected, filter doctors
      if (selectedSpecialization) {
        const filteredDoctors = data.filter(
          (doctor: Doctor) => doctor.specialization === selectedSpecialization
        );
        setDoctorsList(filteredDoctors);
      }
    } catch (err) {
      setError('Error fetching doctors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available time slots from API
  const fetchAvailableTimeSlots = async () => {
    if (!selectedDoctor || !selectedDate) return;

    try {
      setLoading(true);
      // Format date as YYYY-MM-DD for the API
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const data = await doctors.getAvailableSlots(selectedDoctor, formattedDate);
      
      if (data.success) {
        setTimeSlots(data.slots);
        setSlotsByHour(data.slotsByHour || {});
      } else {
        setTimeSlots([]);
        setSlotsByHour({});
        setError(data.message || 'No available time slots found');
      }
    } catch (err) {
      setError('Error fetching available time slots');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Book an appointment
  const bookAppointment = async () => {
    if (!selectedSlot || !patientId || !selectedDoctor) {
      setError('Cannot book appointment. Missing required information.');
      return;
    }

    try {
      setLoading(true);
      
      const appointmentData = {
        patientId,
        doctorId: selectedDoctor,
        timeSlotId: selectedSlot.id,
        notes
      };
      
      const response = await appointments.book(appointmentData);
      
      if (response.success) {
        setSuccess('Appointment booked successfully');
        setShowBookingDialog(false);
        setNotes('');
        
        // Refresh available time slots
        fetchAvailableTimeSlots();
      } else {
        throw new Error(response.message || 'Failed to book appointment');
      }
    } catch (err: any) {
      setError(err.message || 'Error booking appointment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle doctor filter change
  const handleDoctorChange = (event: SelectChangeEvent) => {
    setSelectedDoctor(event.target.value as string);
  };

  // Handle specialization filter change
  const handleSpecializationChange = (event: SelectChangeEvent) => {
    const specialization = event.target.value as string;
    setSelectedSpecialization(specialization);
    setSelectedDoctor(''); // Reset selected doctor when specialization changes
    
    // Filter doctors by specialization
    if (specialization) {
      fetchDoctorsBySpecialization(specialization);
    } else {
      fetchDoctors(); // Fetch all doctors if no specialization is selected
    }
  };

  // Fetch doctors by specialization
  const fetchDoctorsBySpecialization = async (specialization: string) => {
    try {
      setLoading(true);
      const data = await doctors.getBySpecialization(specialization);
      setDoctorsList(data);
    } catch (err) {
      setError('Error fetching doctors by specialization');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle date change
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  // Handle slot selection
  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setShowBookingDialog(true);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setShowBookingDialog(false);
    setSelectedSlot(null);
    setNotes('');
  };

  // Handle notes change
  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.target.value);
  };

  // Handle alert close
  const handleAlertClose = () => {
    setError(null);
    setSuccess(null);
  };

  // Format date for display
  const formatDateForDisplay = (date: Date | null): string => {
    if (!date) return '';
    
    if (isToday(date)) {
      return 'Сегодня';
    } else if (isTomorrow(date)) {
      return 'Завтра';
    } else {
      return format(date, 'dd MMMM yyyy', { locale: ru });
    }
  };

  // Render time slots grouped by hour
  const renderTimeSlots = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      );
    }

    if (!selectedDoctor || !selectedDate) {
      return (
        <Typography variant="body1" color="textSecondary" align="center" my={4}>
          Выберите врача и дату для просмотра доступных слотов
        </Typography>
      );
    }

    if (timeSlots.length === 0) {
      return (
        <Typography variant="body1" color="textSecondary" align="center" my={4}>
          Нет доступных слотов на выбранную дату
        </Typography>
      );
    }

    // If we have slots grouped by hour, render them that way
    if (Object.keys(slotsByHour).length > 0) {
      return (
        <Box>
          {Object.entries(slotsByHour).map(([hour, slots]) => (
            <Box key={hour} mb={3}>
              <Typography variant="h6" gutterBottom>
                {hour}:00
              </Typography>
              <Grid container spacing={2}>
                {slots.map((slot) => (
                  <Grid item xs={6} sm={4} md={3} key={slot.id}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { boxShadow: 3 }
                      }}
                      onClick={() => handleSlotSelect(slot)}
                    >
                      <CardContent>
                        <Typography variant="h6" align="center">
                          {slot.formattedStartTime} - {slot.formattedEndTime}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Box>
      );
    }

    // Otherwise, render slots in a simple grid
    return (
      <Grid container spacing={2}>
        {timeSlots.map((slot) => {
          const startTime = new Date(slot.startTime);
          const endTime = new Date(slot.endTime);
          const formattedStart = format(startTime, 'HH:mm');
          const formattedEnd = format(endTime, 'HH:mm');
          
          return (
            <Grid item xs={6} sm={4} md={3} key={slot.id}>
              <Card 
                variant="outlined" 
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 3 }
                }}
                onClick={() => handleSlotSelect(slot)}
              >
                <CardContent>
                  <Typography variant="h6" align="center">
                    {formattedStart} - {formattedEnd}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Запись на прием
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Specialization filter */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="specialization-label">Специализация</InputLabel>
              <Select
                labelId="specialization-label"
                id="specialization"
                value={selectedSpecialization}
                label="Специализация"
                onChange={handleSpecializationChange}
              >
                <MenuItem value="">Все специализации</MenuItem>
                {Object.values(Specialization).map((spec) => (
                  <MenuItem key={spec} value={spec}>
                    {spec}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Doctor filter */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="doctor-label">Врач</InputLabel>
              <Select
                labelId="doctor-label"
                id="doctor"
                value={selectedDoctor}
                label="Врач"
                onChange={handleDoctorChange}
                disabled={doctorsList.length === 0}
              >
                <MenuItem value="">Выберите врача</MenuItem>
                {doctorsList.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    {doctor.user.firstName} {doctor.user.lastName} - {doctor.specialization}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Date picker */}
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
              <DatePicker
                label="Дата"
                value={selectedDate}
                onChange={handleDateChange}
                disablePast
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Time slots */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Доступные слоты на {formatDateForDisplay(selectedDate)}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {renderTimeSlots()}
      </Paper>
      
      {/* Booking confirmation dialog */}
      <Dialog open={showBookingDialog} onClose={handleDialogClose}>
        <DialogTitle>Подтверждение записи</DialogTitle>
        <DialogContent>
          {selectedSlot && selectedDoctor && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Врач: {doctorsList.find(d => d.id === selectedDoctor)?.user.firstName} {doctorsList.find(d => d.id === selectedDoctor)?.user.lastName}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Дата: {formatDateForDisplay(selectedDate)}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <AccessTimeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Время: {selectedSlot.formattedStartTime || format(new Date(selectedSlot.startTime), 'HH:mm')} - {selectedSlot.formattedEndTime || format(new Date(selectedSlot.endTime), 'HH:mm')}
                </Typography>
              </Box>
              
              <TextField
                autoFocus
                margin="dense"
                id="notes"
                label="Комментарий к записи"
                type="text"
                fullWidth
                multiline
                rows={4}
                value={notes}
                onChange={handleNotesChange}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Отмена</Button>
          <Button 
            onClick={bookAppointment} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Записаться'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success/Error alerts */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar open={!!success} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BookAppointment;
