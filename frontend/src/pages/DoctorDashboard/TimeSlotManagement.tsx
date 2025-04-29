import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
  Tabs,
  Tab,
  Tooltip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import BlockIcon from '@mui/icons-material/Block';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { format, addDays, isToday, isTomorrow, startOfWeek, addWeeks } from 'date-fns';
import { doctors, appointments } from '../../services/api';

// Time slot interface
interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'BOOKED' | 'UNAVAILABLE';
  doctorId: string;
  formattedStartTime?: string;
  formattedEndTime?: string;
}

// Appointment interface
interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  timeSlotId: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  timeSlot: TimeSlot;
}

// User interface to extend the Redux state
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  doctorId?: string; // Optional doctorId for doctor users
  patientId?: string; // Optional patientId for patient users
}

const TimeSlotManagement: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const doctorId = (user as User)?.doctorId || user?.id || '';

  // State for time slots and appointments
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [doctorAppointments, setDoctorAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // State for date selection
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [tabValue, setTabValue] = useState<number>(0);

  // State for slot status update
  const [showStatusDialog, setShowStatusDialog] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [newStatus, setNewStatus] = useState<'AVAILABLE' | 'UNAVAILABLE'>('UNAVAILABLE');

  // Fetch time slots and appointments on component mount and when date changes
  useEffect(() => {
    if (doctorId) {
      fetchTimeSlots();
      fetchAppointments();
    }
  }, [doctorId, selectedDate]);

  // Fetch time slots from API
  const fetchTimeSlots = async () => {
    try {
      setLoading(true);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const data = await doctors.getAvailableSlots(doctorId, formattedDate);
      
      if (data.success) {
        setTimeSlots(data.slots);
      } else {
        // If no slots exist yet, generate them
        await generateTimeSlotsForDate();
      }
    } catch (err) {
      setError('Error fetching time slots');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctor's appointments
  const fetchAppointments = async () => {
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const data = await appointments.getMyAppointments(doctorId, 'DOCTOR');
      
      // Filter appointments for the selected date
      const filteredAppointments = data.filter((appointment: Appointment) => {
        const appointmentDate = new Date(appointment.timeSlot.startTime).toISOString().split('T')[0];
        return appointmentDate === formattedDate;
      });
      
      setDoctorAppointments(filteredAppointments);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  // Generate time slots for the selected date
  const generateTimeSlotsForDate = async () => {
    try {
      setLoading(true);
      const response = await doctors.generateTimeSlots(doctorId, 1);
      
      if (response.message) {
        setSuccess('Time slots generated successfully');
        fetchTimeSlots(); // Refresh the time slots
      } else {
        setError('Failed to generate time slots');
      }
    } catch (err) {
      setError('Error generating time slots');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Generate time slots for the next 7 days
  const generateTimeSlotsForWeek = async () => {
    try {
      setLoading(true);
      const response = await doctors.generateTimeSlots(doctorId, 7);
      
      if (response.message) {
        setSuccess('Time slots generated for the next 7 days');
        fetchTimeSlots(); // Refresh the time slots
      } else {
        setError('Failed to generate time slots');
      }
    } catch (err) {
      setError('Error generating time slots');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update time slot status
  const updateTimeSlotStatus = async () => {
    if (!selectedSlot) return;

    try {
      setLoading(true);
      const response = await doctors.updateSlotStatus(selectedSlot.id, newStatus);
      
      if (response.message) {
        setSuccess(`Time slot marked as ${newStatus.toLowerCase()}`);
        setShowStatusDialog(false);
        fetchTimeSlots(); // Refresh the time slots
      } else {
        setError('Failed to update time slot status');
      }
    } catch (err) {
      setError('Error updating time slot status');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Open status update dialog
  const handleStatusClick = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setNewStatus(slot.status === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE');
    setShowStatusDialog(true);
  };

  // Handle date change
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    
    // Calculate the new date based on tab index
    let newDate;
    switch (newValue) {
      case 0: // Today
        newDate = new Date();
        break;
      case 1: // Tomorrow
        newDate = addDays(new Date(), 1);
        break;
      case 2: // This Week
        newDate = currentWeekStart;
        break;
      case 3: // Next Week
        newDate = addWeeks(currentWeekStart, 1);
        break;
      default:
        newDate = new Date();
    }
    
    setSelectedDate(newDate);
  };

  // Navigate to previous day
  const handlePreviousDay = () => {
    setSelectedDate(prevDate => addDays(prevDate, -1));
  };

  // Navigate to next day
  const handleNextDay = () => {
    setSelectedDate(prevDate => addDays(prevDate, 1));
  };

  // Format date for display
  const formatDateForDisplay = (date: Date): string => {
    if (isToday(date)) {
      return 'Today';
    } else if (isTomorrow(date)) {
      return 'Tomorrow';
    } else {
      return format(date, 'EEEE, MMMM d, yyyy');
    }
  };

  // Get status chip color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'success';
      case 'BOOKED':
        return 'primary';
      case 'UNAVAILABLE':
        return 'error';
      default:
        return 'default';
    }
  };

  // Group time slots by time period (morning/afternoon)
  const groupedTimeSlots = {
    morning: timeSlots.filter(slot => {
      const slotTime = new Date(slot.startTime).getHours();
      return slotTime >= 8 && slotTime < 12;
    }),
    afternoon: timeSlots.filter(slot => {
      const slotTime = new Date(slot.startTime).getHours();
      return slotTime >= 14 && slotTime < 18;
    })
  };

  // Render time slots table
  const renderTimeSlots = (slots: TimeSlot[]) => {
    if (slots.length === 0) {
      return (
        <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
          No time slots available for this period
        </Typography>
      );
    }

    return (
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slots.map((slot) => {
              const appointment = doctorAppointments.find(app => app.timeSlotId === slot.id);
              const startTime = new Date(slot.startTime);
              const endTime = new Date(slot.endTime);
              
              return (
                <TableRow key={slot.id}>
                  <TableCell>{format(startTime, 'HH:mm')}</TableCell>
                  <TableCell>{format(endTime, 'HH:mm')}</TableCell>
                  <TableCell>
                    <Chip 
                      label={slot.status} 
                      color={getStatusColor(slot.status) as any} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    {appointment ? appointment.patientName : '-'}
                  </TableCell>
                  <TableCell>
                    {slot.status === 'BOOKED' ? (
                      <Tooltip title="This slot is booked and cannot be modified">
                        <span>
                          <IconButton disabled>
                            <EventBusyIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    ) : (
                      <Tooltip title={slot.status === 'AVAILABLE' ? 'Mark as unavailable' : 'Mark as available'}>
                        <IconButton 
                          color={slot.status === 'AVAILABLE' ? 'error' : 'success'} 
                          onClick={() => handleStatusClick(slot)}
                        >
                          {slot.status === 'AVAILABLE' ? <BlockIcon /> : <EventAvailableIcon />}
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Time Slot Management
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  sx={{ width: 200, mr: 2 }}
                />
              </LocalizationProvider>
              <Button 
                variant="outlined" 
                onClick={handlePreviousDay}
                sx={{ mr: 1 }}
              >
                Previous Day
              </Button>
              <Button 
                variant="outlined" 
                onClick={handleNextDay}
              >
                Next Day
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<CalendarMonthIcon />}
              onClick={generateTimeSlotsForWeek}
              sx={{ mr: 2 }}
              disabled={loading}
            >
              Generate Week Schedule
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={generateTimeSlotsForDate}
              disabled={loading}
            >
              Refresh Schedule
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{ mb: 2 }}
      >
        <Tab label="Today" />
        <Tab label="Tomorrow" />
        <Tab label="This Week" />
        <Tab label="Next Week" />
      </Tabs>
      
      <Typography variant="h5" gutterBottom>
        Schedule for {formatDateForDisplay(selectedDate)}
      </Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Morning Session (8:00 AM - 12:00 PM)
              </Typography>
              {renderTimeSlots(groupedTimeSlots.morning)}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Afternoon Session (2:00 PM - 6:00 PM)
              </Typography>
              {renderTimeSlots(groupedTimeSlots.afternoon)}
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onClose={() => setShowStatusDialog(false)}>
        <DialogTitle>
          Update Time Slot Status
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to mark this time slot as {newStatus.toLowerCase()}?
          </Typography>
          {selectedSlot && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Date:</strong> {format(new Date(selectedSlot.startTime), 'MMMM d, yyyy')}
              </Typography>
              <Typography variant="body2">
                <strong>Time:</strong> {format(new Date(selectedSlot.startTime), 'HH:mm')} - {format(new Date(selectedSlot.endTime), 'HH:mm')}
              </Typography>
              <Typography variant="body2">
                <strong>Current Status:</strong> {selectedSlot.status}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStatusDialog(false)}>Cancel</Button>
          <Button
            onClick={updateTimeSlotStatus}
            variant="contained"
            color={newStatus === 'AVAILABLE' ? 'success' : 'error'}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : `Mark as ${newStatus.toLowerCase()}`}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Alerts */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(null)}>
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TimeSlotManagement;
