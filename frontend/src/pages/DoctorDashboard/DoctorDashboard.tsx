import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Event as EventIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  LocalHospital as LocalHospitalIcon,
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import AppointmentsManager from './components/AppointmentsManager';
import PatientMedicalRecord from './components/PatientMedicalRecord';
import AppointmentCalendar from './components/AppointmentCalendar';

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
}

interface MedicalCondition {
  id: string;
  name: string;
  diagnosisDate: string;
  status: 'active' | 'resolved' | 'chronic';
  treatment: string;
  notes: string;
}

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  notes: string;
}

interface TestResult {
  id: string;
  name: string;
  date: string;
  result: string;
  normalRange: string;
  status: 'normal' | 'abnormal';
}

const DoctorDashboard: React.FC = () => {
  const location = useLocation();
  const defaultTab = location.state?.tab !== undefined ? location.state.tab : 0;
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      patientName: 'Иван Иванов',
      date: '2024-03-20',
      time: '10:00',
      status: 'scheduled',
      reason: 'Плановый осмотр',
    },
    {
      id: '2',
      patientName: 'Мария Петрова',
      date: '2024-03-20',
      time: '11:30',
      status: 'scheduled',
      reason: 'Консультация',
    },
    {
      id: '3',
      patientName: 'Алексей Сидоров',
      date: '2024-03-21',
      time: '09:00',
      status: 'scheduled',
      reason: 'Повторный прием',
    },
  ]);

  const [selectedPatient] = useState({
    id: '1',
    name: 'Иван Иванов',
    conditions: [
      {
        id: '1',
        name: 'Гипертония',
        diagnosisDate: '2023-01-15',
        status: 'chronic',
        treatment: 'Прием препаратов для контроля давления',
        notes: 'Требуется регулярный мониторинг',
      },
      {
        id: '2',
        name: 'Сахарный диабет 2 типа',
        diagnosisDate: '2023-06-20',
        status: 'active',
        treatment: 'Диета, инсулин',
        notes: 'Хороший контроль уровня сахара',
      },
    ] as MedicalCondition[],
    prescriptions: [
      {
        id: '1',
        medication: 'Эналаприл',
        dosage: '10 мг',
        frequency: '1 раз в день',
        startDate: '2023-01-15',
        endDate: '2024-01-15',
        notes: 'Принимать утром',
      },
      {
        id: '2',
        medication: 'Метформин',
        dosage: '850 мг',
        frequency: '2 раза в день',
        startDate: '2023-06-20',
        endDate: '2024-06-20',
        notes: 'Принимать во время еды',
      },
    ] as Prescription[],
    testResults: [
      {
        id: '1',
        name: 'Общий анализ крови',
        date: '2024-03-15',
        result: 'В пределах нормы',
        normalRange: 'Все показатели в норме',
        status: 'normal',
      },
      {
        id: '2',
        name: 'Глюкоза в крови',
        date: '2024-03-15',
        result: '6.2 ммоль/л',
        normalRange: '3.3-5.5 ммоль/л',
        status: 'abnormal',
      },
    ] as TestResult[],
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleUpdateAppointment = (appointment: Appointment) => {
    // Implement appointment update logic
    console.log('Update appointment:', appointment);
  };

  const handleDeleteAppointment = (id: string) => {
    // Implement appointment delete logic
    console.log('Delete appointment:', id);
  };

  const handleUpdateCondition = (condition: MedicalCondition) => {
    // Implement condition update logic
    console.log('Update condition:', condition);
  };

  const handleAddCondition = (condition: Omit<MedicalCondition, 'id'>) => {
    // Implement condition add logic
    console.log('Add condition:', condition);
  };

  const handleDeleteCondition = (id: string) => {
    // Implement condition delete logic
    console.log('Delete condition:', id);
  };

  const handleUpdatePrescription = (prescription: Prescription) => {
    // Implement prescription update logic
    console.log('Update prescription:', prescription);
  };

  const handleAddPrescription = (prescription: Omit<Prescription, 'id'>) => {
    // Implement prescription add logic
    console.log('Add prescription:', prescription);
  };

  const handleDeletePrescription = (id: string) => {
    // Implement prescription delete logic
    console.log('Delete prescription:', id);
  };

  const handleAppointmentClick = (appointment: any) => {
    console.log('Appointment clicked:', appointment);
    // Здесь можно показать детали приема или перейти на страницу с деталями
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
            <LocalHospitalIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" component="h1">
                Добро пожаловать, Аскар
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Панель управления врача
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Сегодняшние приемы
              </Typography>
              <Typography variant="h4" component="div">
                {appointments.filter(apt => apt.date === '2024-03-20').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Всего пациентов
              </Typography>
              <Typography variant="h4" component="div">
                150
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Завершенные приемы
              </Typography>
              <Typography variant="h4" component="div">
                45
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab label="Приемы" />
              <Tab label="Календарь" />
              <Tab label="Медицинская карта" />
            </Tabs>

            {activeTab === 0 && (
              <AppointmentsManager
                appointments={appointments}
                onUpdateAppointment={handleUpdateAppointment}
                onDeleteAppointment={handleDeleteAppointment}
              />
            )}

            {activeTab === 1 && (
              <AppointmentCalendar onAppointmentClick={handleAppointmentClick} />
            )}

            {activeTab === 2 && (
              <PatientMedicalRecord
                patientId={selectedPatient.id}
                patientName={selectedPatient.name}
                conditions={selectedPatient.conditions}
                prescriptions={selectedPatient.prescriptions}
                testResults={selectedPatient.testResults}
                onUpdateCondition={handleUpdateCondition}
                onAddCondition={handleAddCondition}
                onDeleteCondition={handleDeleteCondition}
                onUpdatePrescription={handleUpdatePrescription}
                onAddPrescription={handleAddPrescription}
                onDeletePrescription={handleDeletePrescription}
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DoctorDashboard; 