import React, { useState, useEffect } from 'react';
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  InputAdornment,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Event as EventIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Notes as NotesIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { appointments, doctors as doctorsApi } from '../../services/api';

// Appointment interface
interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  timeSlotId: string;
  timeSlot: {
    id: string;
    startTime: string;
    endTime: string;
    status: 'AVAILABLE' | 'BOOKED' | 'UNAVAILABLE';
    doctorId: string;
  };
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  patientContact?: string;
  patientEmail?: string;
}

// Doctor interface
interface Doctor {
  id: string;
  user: {
    firstName: string;
    lastName: string;
  };
  specialization: string;
}

const AppointmentsManagement: React.FC = () => {
  // State for appointments and filters
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>([]);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [doctorFilter, setDoctorFilter] = useState<string>('all');
  const [startDateFilter, setStartDateFilter] = useState<Date | null>(null);
  const [endDateFilter, setEndDateFilter] = useState<Date | null>(null);

  // State for dialogs
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<'SCHEDULED' | 'COMPLETED' | 'CANCELLED'>('SCHEDULED');
  const [appointmentNotes, setAppointmentNotes] = useState('');

  // Fetch appointments and doctors on component mount
  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  // Fetch all appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointments.getAllAppointments();
      setAppointmentsList(data);
    } catch (err) {
      setError('Error fetching appointments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all doctors
  const fetchDoctors = async () => {
    try {
      const data = await doctorsApi.getAll();
      setDoctorsList(data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  // Handle search change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
  };

  // Handle doctor filter change
  const handleDoctorFilterChange = (event: SelectChangeEvent) => {
    setDoctorFilter(event.target.value);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDoctorFilter('all');
    setStartDateFilter(null);
    setEndDateFilter(null);
  };

  // Filter appointments based on search query, status, doctor, and date
  const filteredAppointments = appointmentsList.filter(appointment => {
    // Filter by search query
    const searchMatch = 
      appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (appointment.notes && appointment.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    // Filter by status
    const statusMatch = statusFilter === 'all' || appointment.status === statusFilter;

    // Filter by doctor
    const doctorMatch = doctorFilter === 'all' || appointment.doctorId === doctorFilter;

    // Filter by date range
    let dateMatch = true;
    if (startDateFilter) {
      const appointmentDate = new Date(appointment.timeSlot.startTime);
      dateMatch = appointmentDate >= startDateFilter;
    }
    if (endDateFilter && dateMatch) {
      const appointmentDate = new Date(appointment.timeSlot.startTime);
      dateMatch = appointmentDate <= endDateFilter;
    }

    return searchMatch && statusMatch && doctorMatch && dateMatch;
  });

  // Handle view appointment details
  const handleViewClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsViewDialogOpen(true);
  };

  // Handle update appointment status
  const handleStatusClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewStatus(appointment.status);
    setIsStatusDialogOpen(true);
  };

  // Handle delete appointment
  const handleDeleteClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDeleteDialogOpen(true);
  };

  // Handle add/edit notes
  const handleNotesClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setAppointmentNotes(appointment.notes || '');
    setIsNotesDialogOpen(true);
  };

  // Update appointment status
  const handleUpdateStatus = async () => {
    if (!selectedAppointment || !newStatus) return;

    try {
      setLoading(true);
      await appointments.updateStatus(selectedAppointment.id, newStatus);
      
      // Update local state
      setAppointmentsList(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment.id === selectedAppointment.id
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );

      setSuccess(`Appointment status updated to ${newStatus}`);
      setIsStatusDialogOpen(false);
    } catch (err) {
      setError('Error updating appointment status');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete appointment
  const handleDeleteConfirm = async () => {
    if (!selectedAppointment) return;

    try {
      setLoading(true);
      await appointments.delete(selectedAppointment.id);
      
      // Update local state
      setAppointmentsList(prevAppointments =>
        prevAppointments.filter(appointment => appointment.id !== selectedAppointment.id)
      );

      setSuccess('Appointment deleted successfully');
      setIsDeleteDialogOpen(false);
    } catch (err) {
      setError('Error deleting appointment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Save appointment notes
  const handleSaveNotes = async () => {
    if (!selectedAppointment) return;

    try {
      setLoading(true);
      await appointments.addNotes(selectedAppointment.id, appointmentNotes);
      
      // Update local state
      setAppointmentsList(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment.id === selectedAppointment.id
            ? { ...appointment, notes: appointmentNotes }
            : appointment
        )
      );

      setSuccess('Appointment notes updated successfully');
      setIsNotesDialogOpen(false);
    } catch (err) {
      setError('Error updating appointment notes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get status chip color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'primary';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  // Format date for display
  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Appointments Management
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchQuery('')} edge="end">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
              placeholder="Search by patient, doctor, or notes"
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Doctor</InputLabel>
              <Select
                value={doctorFilter}
                label="Doctor"
                onChange={handleDoctorFilterChange}
              >
                <MenuItem value="all">All Doctors</MenuItem>
                {doctorsList.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    {doctor.user.firstName} {doctor.user.lastName} ({doctor.specialization})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="From Date"
                value={startDateFilter}
                onChange={(date) => setStartDateFilter(date)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="To Date"
                value={endDateFilter}
                onChange={(date) => setEndDateFilter(date)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
            <Button
              variant="contained"
              sx={{ ml: 2 }}
              onClick={fetchAppointments}
              startIcon={loading ? <CircularProgress size={20} /> : <EventIcon />}
              disabled={loading}
            >
              Refresh Appointments
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Appointments Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && !appointmentsList.length ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredAppointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No appointments found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.patientName}</TableCell>
                    <TableCell>
                      {appointment.doctorName}
                      <Typography variant="caption" display="block" color="textSecondary">
                        {appointment.doctorSpecialization}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {appointment.timeSlot ? (
                        <>
                          {formatDateTime(appointment.timeSlot.startTime)}
                          <Typography variant="caption" display="block" color="textSecondary">
                            to {formatDateTime(appointment.timeSlot.endTime)}
                          </Typography>
                        </>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={appointment.status}
                        color={getStatusColor(appointment.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton onClick={() => handleViewClick(appointment)} size="small">
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Update Status">
                        <IconButton onClick={() => handleStatusClick(appointment)} size="small">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Add/Edit Notes">
                        <IconButton onClick={() => handleNotesClick(appointment)} size="small">
                          <NotesIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Appointment">
                        <IconButton onClick={() => handleDeleteClick(appointment)} size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* View Appointment Dialog */}
      <Dialog open={isViewDialogOpen} onClose={() => setIsViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Appointment Details</DialogTitle>
        <DialogContent dividers>
          {selectedAppointment && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Patient Information</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1"><strong>Name:</strong> {selectedAppointment.patientName}</Typography>
                    {selectedAppointment.patientContact && (
                      <Typography variant="body1"><strong>Contact:</strong> {selectedAppointment.patientContact}</Typography>
                    )}
                    {selectedAppointment.patientEmail && (
                      <Typography variant="body1"><strong>Email:</strong> {selectedAppointment.patientEmail}</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Doctor Information</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1"><strong>Name:</strong> {selectedAppointment.doctorName}</Typography>
                    <Typography variant="body1"><strong>Specialization:</strong> {selectedAppointment.doctorSpecialization}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Appointment Information</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body1">
                          <strong>Date & Time:</strong> {selectedAppointment.timeSlot && formatDateTime(selectedAppointment.timeSlot.startTime)}
                        </Typography>
                        <Typography variant="body1">
                          <strong>End Time:</strong> {selectedAppointment.timeSlot && formatDateTime(selectedAppointment.timeSlot.endTime)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body1">
                          <strong>Status:</strong> 
                          <Chip
                            label={selectedAppointment.status}
                            color={getStatusColor(selectedAppointment.status) as any}
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        </Typography>
                        <Typography variant="body1">
                          <strong>Appointment ID:</strong> {selectedAppointment.id}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Notes</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1">
                      {selectedAppointment.notes || 'No notes available for this appointment.'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          {selectedAppointment && (
            <>
              <Button 
                onClick={() => {
                  setIsViewDialogOpen(false);
                  handleStatusClick(selectedAppointment);
                }}
                color="primary"
              >
                Update Status
              </Button>
              <Button 
                onClick={() => {
                  setIsViewDialogOpen(false);
                  handleNotesClick(selectedAppointment);
                }}
                color="primary"
              >
                Edit Notes
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onClose={() => setIsStatusDialogOpen(false)}>
        <DialogTitle>Update Appointment Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              label="Status"
              onChange={(e) => setNewStatus(e.target.value as 'SCHEDULED' | 'COMPLETED' | 'CANCELLED')}
            >
              <MenuItem value="SCHEDULED">Scheduled</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsStatusDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateStatus} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Appointment Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Delete Appointment</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this appointment? This action cannot be undone.</Typography>
          {selectedAppointment && (
            <Box sx={{ mt: 2 }}>
              <Typography><strong>Patient:</strong> {selectedAppointment.patientName}</Typography>
              <Typography><strong>Doctor:</strong> {selectedAppointment.doctorName}</Typography>
              <Typography>
                <strong>Date & Time:</strong> 
                {selectedAppointment.timeSlot && formatDateTime(selectedAppointment.timeSlot.startTime)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Notes Dialog */}
      <Dialog open={isNotesDialogOpen} onClose={() => setIsNotesDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Appointment Notes</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Notes"
            fullWidth
            multiline
            rows={6}
            value={appointmentNotes}
            onChange={(e) => setAppointmentNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsNotesDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveNotes} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Notes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbars for notifications */}
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
    </Container>
  );
};

export default AppointmentsManagement;