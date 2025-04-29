import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  Container,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  CircularProgress,
  Snackbar,
  SelectChangeEvent,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { format, addDays, isSameDay } from 'date-fns';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

const steps = ['Выбор специалиста', 'Выбор врача', 'Выбор времени'];

const StyledCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
}));

const TimeSlotButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  transition: 'all 0.2s ease-in-out',
  '&.selected': {
    backgroundColor: '#E6F4F8',
    borderColor: '#00A6B4',
    color: '#00A6B4',
    transform: 'scale(1.02)',
    boxShadow: '0 2px 8px rgba(0,166,180,0.2)',
  },
  '&:disabled': {
    backgroundColor: '#f5f5f5',
    borderColor: theme.palette.divider,
    color: theme.palette.text.disabled,
  },
  '&:hover:not(:disabled)': {
    backgroundColor: '#F5FBFD',
    transform: 'scale(1.02)',
  },
}));

// Doctor interface
interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  image?: string;
}

// Time slot interface
interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  status: SlotStatus;
  formattedStartTime: string; // HH:MM format
  formattedEndTime: string; // HH:MM format
  doctorId: string;
}

// API response interfaces
interface TimeSlotResponse {
  success: boolean;
  date: string;
  slots: TimeSlot[];
  slotsByHour: Record<string, TimeSlot[]>;
  total: number;
  message?: string;
}

interface AppointmentResponse {
  success: boolean;
  message: string;
  appointment?: any;
}

// Time slot status enum
enum SlotStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  UNAVAILABLE = 'UNAVAILABLE'
}

// Specialization enum
enum Specialty {
  THERAPIST = 'THERAPIST',
  CARDIOLOGIST = 'CARDIOLOGIST',
  NEUROLOGIST = 'NEUROLOGIST',
  PEDIATRICIAN = 'PEDIATRICIAN',
  SURGEON = 'SURGEON'
}

// Specialty labels
const specialtyLabels: Record<Specialty, string> = {
  THERAPIST: 'Терапевт',
  CARDIOLOGIST: 'Кардиолог',
  NEUROLOGIST: 'Невролог',
  PEDIATRICIAN: 'Педиатр',
  SURGEON: 'Хирург'
}

const AppointmentPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  // For testing purposes - in a real app, this would come from the authenticated user
  const patientId = '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p';

  // Component state
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [slotsByHour, setSlotsByHour] = useState<Record<string, TimeSlot[]>>({});
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Generate dates for the next 7 days (excluding weekends)
  const availableDates = Array.from({ length: 14 }).map((_, index) => {
    const date = addDays(new Date(), index);
    return { date, disabled: date.getDay() === 0 || date.getDay() === 6 }; // 0 = Sunday, 6 = Saturday
  }).filter(item => !item.disabled).slice(0, 7); // Take first 7 non-weekend days

  // Filtered doctors based on specialty and search term
  const filteredDoctors = doctors.filter(doctor => {
    // Log each doctor to see what's coming from the API
    console.log('Filtering doctor:', doctor);
    
    // More flexible specialty matching
    const matchesSpecialty = !selectedSpecialty || 
      doctor.specialization === selectedSpecialty ||
      doctor.specialization.toUpperCase() === selectedSpecialty;
    
    // More flexible search matching
    const matchesSearch = true;
    
    return matchesSpecialty && matchesSearch;
  });

  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch time slots when doctor and date changes
  useEffect(() => {
    if (selectedDoctorId && selectedDate) {
      fetchAvailableTimeSlots();
    }
  }, [selectedDoctorId, selectedDate]);

  // Fetch doctors from the API
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      
      // Use the test endpoint since we have database schema issues
      const response = await axios.get(`${API_URL}/api/doctors`);
      console.log('Doctors API response:', response.data);
      
      if (response.data) {
        setDoctors(response.data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Failed to load doctors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch available time slots for the selected doctor and date
  const fetchAvailableTimeSlots = async () => {
    if (!selectedDoctorId || !selectedDate) return;
  
    try {
      setLoading(true);
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const { data } = await axios.get<TimeSlotResponse>(
        `${API_URL}/api/time-slots/available/${selectedDoctorId}?date=${formattedDate}`
      );
  
      console.log('Time slots API response:', data);
  
      if (!data.success) {
        setError(data.message || 'No slots found');
        return;
      }
  
      // 1) actually grab the slots array
      const slots = data.slots;
  
      // 2) put it into state
      setTimeSlots(slots);
  
      // 3) group by hour
      const grouped: Record<string, TimeSlot[]> = {};
      slots.forEach(slot => {
        const hour = new Date(slot.startTime).getHours().toString();
        if (!grouped[hour]) grouped[hour] = [];
        grouped[hour].push(slot);
      });
      setSlotsByHour(grouped);
  
    } catch (err) {
      console.error('Error fetching time slots:', err);
      setError('Failed to load time slots');
    } finally {
      setLoading(false);
    }
  };
  

  // Book an appointment
  const bookAppointment = async () => {
    if (!selectedSlot || !selectedDoctorId) {
      setError('Cannot book appointment. Missing required information.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Use the real API endpoint instead of the test one
      const response = await axios.post(
        `${API_URL}/api/appointments`,
        {
          patientId,
          doctorId: selectedDoctorId,
          timeSlotId: selectedSlot.id,
          notes: notes || ''
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : undefined
          }
        }
      );

      console.log('Appointment booking response:', response.data);

      // Show success message
      setSuccess('Appointment booked successfully!');
      
      // Reset form after success
      setTimeout(() => {
        setActiveStep(0);
        setSelectedSpecialty('');
        setSelectedDoctorId('');
        setSelectedDate(new Date());
        setSelectedSlot(null);
        setTimeSlots([]);
        setSlotsByHour({});
        setSuccess(null);
      }, 3000);
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      setError(error.response?.data?.message || 'Failed to book appointment. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSpecialtySelect = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    setSelectedDoctorId(''); // Clear previous doctor selection
    setSelectedSlot(null);   // Clear previous slot selection
    setTimeSlots([]);        // Clear previous slots
    handleNext();
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    console.log('Selected doctor id:', doctor.id); // should log 'd1', 'd2', …
    setSelectedDoctorId(doctor.id);
    setSelectedSlot(null);   // Clear previous slot selection
    setTimeSlots([]);       // Clear previous slots
    handleNext();
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setSelectedSlot(null); // Clear selected slot when date changes
    }
  };

  const handleConfirm = () => {
    bookAppointment();
  };

  const renderSpecialtySelection = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Выберите специализацию врача
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(specialtyLabels).map(([key, label]) => (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <StyledCard 
              onClick={() => handleSpecialtySelect(key as Specialty)}
              sx={{ height: '100%' }}
            >
              <CardContent>
                <Typography variant="h6" component="div">
                  {label}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderDoctorSelection = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Выберите врача
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Поиск врача по имени или специализации"
        InputProps={{
          startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
        }}
        sx={{ mb: 3 }}
      />
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ p: 2 }}>
          {error}
        </Typography>
      ) : doctors.length === 0 ? (
        <Typography color="text.secondary" sx={{ p: 2 }}>
          Нет доступных врачей. Пожалуйста, попробуйте позже.
        </Typography>
      ) : filteredDoctors.length > 0 ? (
        <Grid container spacing={3}>
          {filteredDoctors.map((doctor) => (
            <Grid item xs={12} sm={6} md={4} key={doctor.id || `doctor-${Math.random()}`}>
              <StyledCard onClick={() => handleDoctorSelect(doctor)}>
                {doctor.image && (
                  <CardMedia
                    component="img"
                    height="100%"
                    image={doctor.image}
                    alt={`${doctor.firstName || ''} ${doctor.lastName || ''}`}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" component="div">
                    {doctor.lastName || ''} {doctor.firstName || ''}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {doctor.specialization ? 
                      (specialtyLabels[doctor.specialization.toUpperCase() as keyof typeof specialtyLabels] || doctor.specialization) : 
                      'Специализация не указана'}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography color="text.secondary" sx={{ p: 2 }}>
          Не найдено врачей по заданным критериям
        </Typography>
      )}
    </Box>
  );

  const renderTimeSelection = () => {
    // Find the selected doctor object
    const selectedDoctor = doctors.find(doc => doc.id === selectedDoctorId);

    // Prevent rendering if no doctor is selected
    if (!selectedDoctorId) {
      return (
        <Box>
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            Пожалуйста, выберите врача для отображения доступных временных слотов.
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Выберите удобное время
        </Typography>
        {/* Selected doctor info */}
        {selectedDoctor && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1">
              Врач: {selectedDoctor.lastName} {selectedDoctor.firstName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {specialtyLabels[selectedDoctor.specialization as keyof typeof specialtyLabels]}
            </Typography>
          </Paper>
        )}

        {/* Date selection */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Выберите дату:
          </Typography>
          <Grid container spacing={2}>
            {availableDates.map((dateObj, index) => (
              <Grid item key={index}>
                <Button
                  variant={isSameDay(selectedDate || new Date(), dateObj.date) ? "contained" : "outlined"}
                  onClick={() => handleDateChange(dateObj.date)}
                  sx={{ px: 2, py: 1 }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" display="block">
                      {format(dateObj.date, 'EEE', { locale: ru })}
                    </Typography>
                    <Typography variant="subtitle2">
                      {format(dateObj.date, 'd MMM', { locale: ru })}
                    </Typography>
                  </Box>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Time slots selection */}
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Доступное время:
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : Object.keys(slotsByHour).length > 0 ? (
            <Box>
              {Object.entries(slotsByHour).sort().map(([hour, slots]) => (
                <Box key={hour} sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {hour}:00
                  </Typography>
                  <Grid container spacing={2}>
                    {slots.map((slot) => (
                      <Grid item xs={6} sm={4} md={3} key={slot.id}>
                        <TimeSlotButton
                          variant="outlined"
                          className={selectedSlot?.id === slot.id ? 'selected' : ''}
                          disabled={slot.status !== SlotStatus.AVAILABLE}
                          onClick={() => handleTimeSlotSelect(slot)}
                        >
                          <AccessTimeIcon fontSize="small" />
                          {slot.formattedStartTime}
                        </TimeSlotButton>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary">
              Нет доступных временных слотов на выбранную дату. Пожалуйста, выберите другую дату.
            </Typography>
          )}
        </Box>

        {/* Appointment notes */}
        {selectedSlot && selectedDoctor && (
          <Box sx={{ mt: 4 }}>
            <Paper sx={{ p: 3, borderLeft: 4, borderColor: 'primary.main' }}>
              <Typography variant="subtitle1" gutterBottom>
                Детали записи:
              </Typography>
              <Typography variant="body2">
                <strong>Врач:</strong> {selectedDoctor.lastName} {selectedDoctor.firstName}
              </Typography>
              <Typography variant="body2">
                <strong>Дата:</strong> {format(selectedDate || new Date(), 'd MMMM yyyy', { locale: ru })}
              </Typography>
              <Typography variant="body2">
                <strong>Время:</strong> {selectedSlot.formattedStartTime}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Примечания к приему"
                variant="outlined"
                placeholder="Укажите причину визита или другую важную информацию"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                InputProps={{
                  startAdornment: <EventNoteIcon sx={{ color: 'text.secondary', mr: 1, mt: 1 }} />,
                }}
                sx={{ mt: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleConfirm}
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Записаться на прием'}
              </Button>
            </Paper>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Запись на прием
      </Typography>
      
      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {/* Error message */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Success message */}
      {success && (
        <Alert severity="success" sx={{ width: '100%', mb: 3 }}>
          {success}
        </Alert>
      )}
      
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
      
      {/* Content based on active step */}
      <Paper sx={{ p: 3 }}>
        {activeStep === 0 && renderSpecialtySelection()}
        {activeStep === 1 && renderDoctorSelection()}
        {activeStep === 2 && renderTimeSelection()}
        
        {/* Navigation buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            variant="outlined"
          >
            Назад
          </Button>
          
          {activeStep === 2 && selectedSlot && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirm}
              disabled={loading}
              sx={{
                backgroundColor: '#00A6B4',
                '&:hover': { backgroundColor: '#009CA6' },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Записаться на прием'}
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default AppointmentPage;