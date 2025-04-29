import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Alert,
  Box,
  CircularProgress,
} from '@mui/material';
import { doctors, Doctor, Specialty } from '../../data/doctors';
import DoctorCard from './components/DoctorCard';
import SpecialtyFilter from './components/SpecialtyFilter';
import AppointmentModal from './components/AppointmentModal';

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

interface TimeSlots {
  slots: TimeSlot[];
  slotsByDay: GroupedSlots;
}

const DoctorsPage: React.FC = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty>('ALL');
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlots>({ slots: [], slotsByDay: {} });
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Фильтрация врачей на основе выбранной специальности
    setLoading(true);
    setError(null);
    
    try {
      const filtered = selectedSpecialty === 'ALL'
        ? doctors
        : doctors.filter(doctor => doctor.specialization === selectedSpecialty);
      
      setFilteredDoctors(filtered);
    } catch (err) {
      setError('Произошла ошибка при фильтрации списка врачей');
      console.error('Error filtering doctors:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedSpecialty]);

  const fetchTimeSlots = async (doctorId: string) => {
    try {
      setLoadingTimeSlots(true);
      // Пока что генерируем тестовые временные слоты
      const mockTimeSlots = generateMockTimeSlots();
      setTimeSlots(mockTimeSlots);
    } catch (err) {
      console.error('Error fetching time slots:', err);
      setTimeSlots({ slots: [], slotsByDay: {} });
      setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке доступных слотов');
    } finally {
      setLoadingTimeSlots(false);
    }
  };

  const generateMockTimeSlots = (): TimeSlots => {
    const slots: TimeSlot[] = [];
    const slotsByDay: GroupedSlots = {};
    const today = new Date();
    const days = ['Сегодня', 'Завтра', 'Послезавтра'];
    const times = [
      '09:00', '10:00', '11:00', '12:00', '13:00',
      '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    days.forEach((day, dayIndex) => {
      const date = new Date(today);
      date.setDate(date.getDate() + dayIndex);
      const dateKey = date.toISOString().split('T')[0];
      const displayDate = `${day}, ${date.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'long' 
      })}`;
      
      const daySlots: TimeSlot[] = times.map((time, index) => {
        const slotId = `${dateKey}-${time}`;
        return {
          id: slotId,
          startTime: time,
          endTime: `${parseInt(time.split(':')[0]) + 1}:00`,
          isAvailable: Math.random() > 0.3, // 70% chance of being available
          displayTime: time,
          displayDate: displayDate
        };
      });

      slots.push(...daySlots);
      slotsByDay[dateKey] = daySlots;
    });

    return { slots, slotsByDay };
  };

  const handleSpecialtyChange = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
  };

  const handleDoctorSelect = async (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    await fetchTimeSlots(doctor.id);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedDoctor(null);
    setTimeSlots({ slots: [], slotsByDay: {} });
  };

  const handleAppointmentSubmit = async (timeSlotId: string) => {
    if (!selectedDoctor) return;

    try {
      // Пока что просто показываем сообщение об успехе
      setError('Запись успешно создана');
      handleModalClose();
    } catch (err) {
      console.error('Error creating appointment:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка при создании записи');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ mb: 4, color: '#1A2D4A', textAlign: 'center' }}
      >
        Наши специалисты
      </Typography>

      <SpecialtyFilter
        selectedSpecialty={selectedSpecialty}
        onSpecialtyChange={handleSpecialtyChange}
      />

      {error && (
        <Alert
          severity={error.includes('успешно') ? 'success' : 'error'}
          sx={{ mt: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          <CircularProgress sx={{ color: '#00A6B4' }} />
        </Box>
      ) : filteredDoctors.length === 0 ? (
        <Typography
          variant="h6"
          sx={{ textAlign: 'center', color: '#2C3E50', my: 4 }}
        >
          По выбранной специальности врачей не найдено
        </Typography>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {filteredDoctors.map((doctor) => (
            <Grid item xs={12} sm={6} md={4} key={doctor.id}>
              <DoctorCard
                doctor={doctor}
                onSelect={() => handleDoctorSelect(doctor)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <AppointmentModal
        open={modalOpen}
        onClose={handleModalClose}
        doctor={selectedDoctor}
        timeSlots={timeSlots}
        loading={loadingTimeSlots}
        onSubmit={handleAppointmentSubmit}
      />
    </Container>
  );
};

export default DoctorsPage; 