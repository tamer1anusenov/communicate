import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  ButtonBase,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from '@mui/material';
import {
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Note as NoteIcon,
} from '@mui/icons-material';

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
}

interface DaySchedule {
  date: Date;
  appointments: Appointment[];
}

interface AppointmentCalendarProps {
  onAppointmentClick: (appointment: Appointment) => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ onAppointmentClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isAppointmentDetailOpen, setIsAppointmentDetailOpen] = useState(false);

  // Генерация временных слотов с 9:00 до 18:00
  const timeSlots = Array.from({ length: 18 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  // Моковые данные приемов на текущую неделю
  const generateMockAppointments = (date: Date): DaySchedule => {
    const dayOfWeek = date.getDay();
    // Пример: больше приемов в середине недели
    const appointmentsCount = dayOfWeek === 0 || dayOfWeek === 6 
      ? 0  // Выходные
      : Math.floor(Math.random() * 8) + 3;  // 3-10 приемов в будни
    
    const appointments: Appointment[] = [];
    
    // Если выходной, возвращаем пустой массив
    if (appointmentsCount === 0) {
      return { date, appointments };
    }
    
    // Генерация случайных приемов
    const usedTimes = new Set<string>();
    for (let i = 0; i < appointmentsCount; i++) {
      // Выбираем случайный временной слот, который еще не занят
      let timeIndex;
      let time;
      do {
        timeIndex = Math.floor(Math.random() * timeSlots.length);
        time = timeSlots[timeIndex];
      } while (usedTimes.has(time));
      
      usedTimes.add(time);
      
      // Генерация случайного статуса
      const statusOptions: Array<'scheduled' | 'completed' | 'cancelled'> = ['scheduled', 'completed', 'cancelled'];
      const statusWeights = [0.7, 0.2, 0.1]; // 70% запланировано, 20% завершено, 10% отменено
      
      const random = Math.random();
      let statusIndex = 0;
      let cumulativeWeight = statusWeights[0];
      
      while (random > cumulativeWeight && statusIndex < statusWeights.length - 1) {
        statusIndex++;
        cumulativeWeight += statusWeights[statusIndex];
      }
      
      const status = statusOptions[statusIndex];
      
      // Генерация приема
      appointments.push({
        id: `app-${date.toISOString().split('T')[0]}-${time}`,
        patientName: getRandomPatientName(),
        patientId: Math.floor(Math.random() * 100).toString(),
        time,
        status,
        reason: getRandomReason(),
        notes: Math.random() > 0.5 ? 'Дополнительная информация о приеме' : undefined,
      });
    }
    
    // Сортировка по времени
    return {
      date,
      appointments: appointments.sort((a, b) => a.time.localeCompare(b.time)),
    };
  };

  // Функция для генерации случайного имени пациента
  const getRandomPatientName = (): string => {
    const firstNames = ['Иван', 'Александр', 'Сергей', 'Дмитрий', 'Анна', 'Елена', 'Мария', 'Ольга'];
    const lastNames = ['Иванов', 'Петров', 'Сидоров', 'Смирнов', 'Кузнецова', 'Соколова', 'Попова', 'Морозова'];
    
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  };

  // Функция для генерации случайной причины приема
  const getRandomReason = (): string => {
    const reasons = [
      'Плановый осмотр',
      'Консультация',
      'Повторный прием',
      'Боли в груди',
      'Головные боли',
      'Измерение давления',
      'Простуда',
      'Плановая вакцинация',
    ];
    
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  // Получаем текущую неделю (7 дней начиная с понедельника текущей недели)
  const getWeekDays = (): Date[] => {
    const date = new Date(currentDate);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Корректировка для воскресенья
    
    const monday = new Date(date.setDate(diff));
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date;
    });
  };

  // Получаем расписание на неделю
  const weekSchedule: DaySchedule[] = getWeekDays().map(date => generateMockAppointments(date));

  // Обработчики навигации
  const goToPreviousWeek = () => {
    const prevWeek = new Date(currentDate);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setCurrentDate(prevWeek);
  };

  const goToNextWeek = () => {
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentDate(nextWeek);
  };

  // Обработчик клика по приему
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsAppointmentDetailOpen(true);
  };

  // Форматирование даты
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('ru-RU', options);
  };

  // Проверка, является ли дата сегодняшней
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Получение цвета для статуса приема
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'scheduled':
        return '#1976d2'; // синий
      case 'completed':
        return '#2e7d32'; // зеленый
      case 'cancelled':
        return '#d32f2f'; // красный
      default:
        return '#757575'; // серый
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Расписание приемов
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={goToPreviousWeek}>
            <PrevIcon />
          </IconButton>
          <Typography variant="subtitle1" sx={{ mx: 2 }}>
            {`${new Date(weekSchedule[0].date).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}`}
          </Typography>
          <IconButton onClick={goToNextWeek}>
            <NextIcon />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={1}>
        {/* Заголовок с днями недели */}
        {weekSchedule.map((day, index) => (
          <Grid item xs key={index}>
            <Paper 
              sx={{ 
                p: 1, 
                textAlign: 'center',
                bgcolor: isToday(day.date) ? 'primary.light' : 'inherit',
                color: isToday(day.date) ? 'white' : 'inherit',
              }}
            >
              <Typography variant="subtitle2">{formatDate(day.date)}</Typography>
            </Paper>
          </Grid>
        ))}

        {/* Временная шкала слева */}
        <Grid item xs={1} sx={{ mt: 1 }}>
          {timeSlots.map((time, index) => (
            <Box 
              key={time} 
              sx={{ 
                height: 60, 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: '1px solid #e0e0e0',
                ...(index === 0 && { borderTop: '1px solid #e0e0e0' }),
              }}
            >
              <Typography variant="caption">{time}</Typography>
            </Box>
          ))}
        </Grid>

        {/* Сетка приемов */}
        {weekSchedule.map((day, dayIndex) => (
          <Grid item xs key={dayIndex}>
            <Box>
              {timeSlots.map((time, timeIndex) => {
                const appointment = day.appointments.find(a => a.time === time);
                
                return (
                  <Box
                    key={`${dayIndex}-${timeIndex}`}
                    sx={{
                      height: 60,
                      p: 0.5,
                      borderBottom: '1px solid #e0e0e0',
                      ...(timeIndex === 0 && { borderTop: '1px solid #e0e0e0' }),
                      position: 'relative',
                    }}
                  >
                    {appointment && (
                      <ButtonBase
                        sx={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          justifyContent: 'flex-start',
                          p: 0.5,
                          borderRadius: 1,
                          backgroundColor: getStatusColor(appointment.status) + '20', // Добавляем прозрачность
                          border: `1px solid ${getStatusColor(appointment.status)}`,
                          '&:hover': {
                            backgroundColor: getStatusColor(appointment.status) + '40', // Увеличиваем непрозрачность при наведении
                          },
                          position: 'absolute',
                          top: 4,
                          left: 4,
                          right: 4,
                          bottom: 4,
                        }}
                        onClick={() => handleAppointmentClick(appointment)}
                      >
                        <Typography variant="caption" noWrap sx={{ fontWeight: 500 }}>
                          {appointment.patientName}
                        </Typography>
                        <Typography variant="caption" noWrap color="text.secondary">
                          {appointment.reason}
                        </Typography>
                      </ButtonBase>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Диалог с деталями приема */}
      <Dialog 
        open={isAppointmentDetailOpen} 
        onClose={() => setIsAppointmentDetailOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedAppointment && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1 }} />
                Прием пациента: {selectedAppointment.patientName}
                <Chip 
                  label={
                    selectedAppointment.status === 'scheduled' 
                      ? 'Запланирован' 
                      : selectedAppointment.status === 'completed' 
                        ? 'Завершен' 
                        : 'Отменен'
                  }
                  size="small" 
                  color={
                    selectedAppointment.status === 'scheduled' 
                      ? 'primary' 
                      : selectedAppointment.status === 'completed' 
                        ? 'success' 
                        : 'error'
                  }
                  sx={{ ml: 'auto' }}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <TimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {`${weekSchedule.find(day => 
                    day.appointments.some(a => a.id === selectedAppointment.id)
                  )?.date.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })} в ${selectedAppointment.time}`}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Причина посещения:</Typography>
                <Typography variant="body2">{selectedAppointment.reason}</Typography>
              </Box>
              
              {selectedAppointment.notes && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">Примечания:</Typography>
                  <Typography variant="body2">{selectedAppointment.notes}</Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsAppointmentDetailOpen(false)}>Закрыть</Button>
              <Button 
                onClick={() => {
                  onAppointmentClick(selectedAppointment);
                  setIsAppointmentDetailOpen(false);
                }}
                variant="contained" 
                color="primary"
              >
                Подробнее
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AppointmentCalendar; 