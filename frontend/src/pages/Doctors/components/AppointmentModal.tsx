import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Tooltip,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Doctor, specialtyLabels } from '../../../data/doctors';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  displayTime: string;
  displayDate: string;
}

interface GroupedSlots {
  [key: string]: TimeSlot[];
}

interface AppointmentModalProps {
  open: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  timeSlots: {
    slots: TimeSlot[];
    slotsByDay: GroupedSlots;
  };
  loading: boolean;
  onSubmit: (timeSlotId: string) => void;
}

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
    cursor: 'not-allowed',
  },
  '&:hover:not(:disabled)': {
    backgroundColor: '#F5FBFD',
    transform: 'scale(1.02)',
  },
}));

const DateTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 120,
  fontWeight: 500,
  color: '#2C3E50',
  '&.Mui-selected': {
    color: '#00A6B4',
  },
}));

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  open,
  onClose,
  doctor,
  timeSlots,
  loading,
  onSubmit,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId);
  };

  const handleDateChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedDate(newValue);
    setSelectedSlot(null);
  };

  const handleSubmit = () => {
    if (selectedSlot) {
      onSubmit(selectedSlot);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    }
  };

  if (!doctor) return null;

  const fullName = [
    doctor.lastName,
    doctor.firstName,
    doctor.patronymic,
  ].filter(Boolean).join(' ');

  const availableDates = Object.keys(timeSlots.slotsByDay);

  // Устанавливаем начальную выбранную дату, если она не задана и есть доступные даты
  if (!selectedDate && availableDates.length > 0) {
    setSelectedDate(availableDates[0]);
  }

  const selectedSlotData = selectedSlot
    ? timeSlots.slots.find(slot => slot.id === selectedSlot)
    : null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
      }}
    >
      <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
        <Typography variant="h6" component="div" sx={{ color: '#1A2D4A' }}>
          Запись на прием
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ mt: 1, color: '#00A6B4', fontWeight: 500 }}
        >
          {fullName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {specialtyLabels[doctor.specialization as keyof typeof specialtyLabels]}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ mt: 2, minHeight: 400 }}>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              minHeight: 300,
            }}
          >
            <CircularProgress sx={{ color: '#00A6B4' }} />
          </Box>
        ) : availableDates.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            На ближайшее время нет доступных слотов для записи. Пожалуйста, попробуйте позже.
          </Alert>
        ) : (
          <>
            <Paper sx={{ mb: 3, borderRadius: 2 }}>
              <Tabs
                value={selectedDate}
                onChange={handleDateChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#00A6B4',
                  },
                }}
              >
                {availableDates.map((date) => {
                  const firstSlot = timeSlots.slotsByDay[date][0];
                  return (
                    <DateTab
                      key={date}
                      label={firstSlot.displayDate.split(' ').slice(0, 2).join(' ')}
                      value={date}
                    />
                  );
                })}
              </Tabs>
            </Paper>

            <Typography variant="subtitle2" sx={{ mb: 2, color: '#2C3E50', display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon sx={{ color: '#00A6B4' }} />
              Доступное время:
            </Typography>

            <Grid container spacing={2}>
              {selectedDate &&
                timeSlots.slotsByDay[selectedDate].map((slot) => (
                  <Grid item xs={6} sm={4} md={3} key={slot.id}>
                    <Tooltip 
                      title={slot.isAvailable ? "Нажмите для выбора" : "Это время уже занято"} 
                      arrow
                    >
                      <span>
                        <TimeSlotButton
                          variant="outlined"
                          className={selectedSlot === slot.id ? 'selected' : ''}
                          disabled={!slot.isAvailable}
                          onClick={() => handleSlotSelect(slot.id)}
                        >
                          {slot.displayTime}
                          {selectedSlot === slot.id && (
                            <CheckCircleIcon sx={{ fontSize: 16 }} />
                          )}
                        </TimeSlotButton>
                      </span>
                    </Tooltip>
                  </Grid>
                ))}
            </Grid>

            {selectedSlotData && (
              <Alert 
                severity="success" 
                sx={{ mt: 2 }}
                icon={<CheckCircleIcon />}
              >
                Вы выбрали время: {selectedSlotData.displayTime} ({selectedSlotData.displayDate})
              </Alert>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            color: '#2C3E50',
            '&:hover': { backgroundColor: '#f5f5f5' },
          }}
        >
          Отмена
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!selectedSlot || loading}
          sx={{
            backgroundColor: '#00A6B4',
            '&:hover': { backgroundColor: '#009CA6' },
          }}
        >
          {showSuccess ? 'Запись создана!' : 'Подтвердить запись'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentModal; 