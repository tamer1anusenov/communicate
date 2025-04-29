import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/Home/Home';
import DoctorsPage from './pages/Doctors/DoctorsPage';
import TestsPage from './pages/Tests/TestsPage';
import ProfilePage from './pages/Profile/ProfilePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import AppointmentPage from './pages/Appointment/AppointmentPage';
import ContactsPage from './pages/Contacts/ContactsPage';
import AboutPage from './pages/About/AboutPage';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import DoctorsManagement from './pages/AdminDashboard/DoctorsManagement';
import AppointmentsManagement from './pages/AdminDashboard/AppointmentsManagement';
import TestsManagement from './pages/AdminDashboard/TestsManagement';
import DoctorDashboard from './pages/DoctorDashboard/DoctorDashboard';
import PatientSelection from './pages/DoctorDashboard/PatientSelection';
import DoctorTestsManagement from './pages/DoctorDashboard/TestsManagement';
import PatientMedicalRecord from './pages/DoctorDashboard/components/PatientMedicalRecord';
import { Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/doctors" element={<DoctorsPage />} />
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected Routes */}
      <Route
        path="/tests"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <TestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointment"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <AppointmentPage />
          </ProtectedRoute>
        }
      />
      
      {/* Role-specific Dashboards */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Admin routes */}
      <Route
        path="/admin-dashboard/doctors"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DoctorsManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard/appointments"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppointmentsManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard/tests"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <TestsManagement />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/doctor-dashboard"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Doctor routes */}
      <Route
        path="/doctor-dashboard/patient-selection"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <PatientSelection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor-dashboard/tests"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorTestsManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor-dashboard/medical-record/:patientId"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            {/* Temporary PatientMedicalRecord component as a standalone page */}
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <PatientMedicalRecordContainer />
            </Container>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

// Контейнер для медицинской карты пациента как отдельной страницы
const PatientMedicalRecordContainer: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [patient, setPatient] = useState({
    id: patientId || '',
    name: 'Загрузка...',
    conditions: [] as any[],
    prescriptions: [] as any[],
    testResults: [] as any[],
  });

  // Эффект для загрузки данных пациента
  useEffect(() => {
    // Симуляция запроса данных
    setTimeout(() => {
      if (patientId === '1') {
        setPatient({
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
          ],
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
          ],
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
          ],
        });
      } else {
        // Дефолтные данные для других пациентов
        setPatient({
          id: patientId || '',
          name: `Пациент №${patientId}`,
          conditions: [],
          prescriptions: [],
          testResults: [],
        });
      }
    }, 500);
  }, [patientId]);

  const handleUpdateCondition = (condition: any) => {
    console.log('Update condition:', condition);
  };

  const handleAddCondition = (condition: any) => {
    console.log('Add condition:', condition);
  };

  const handleDeleteCondition = (id: string) => {
    console.log('Delete condition:', id);
  };

  const handleUpdatePrescription = (prescription: any) => {
    console.log('Update prescription:', prescription);
  };

  const handleAddPrescription = (prescription: any) => {
    console.log('Add prescription:', prescription);
  };

  const handleDeletePrescription = (id: string) => {
    console.log('Delete prescription:', id);
  };

  return (
    <PatientMedicalRecord
      patientId={patient.id}
      patientName={patient.name}
      conditions={patient.conditions}
      prescriptions={patient.prescriptions}
      testResults={patient.testResults}
      onUpdateCondition={handleUpdateCondition}
      onAddCondition={handleAddCondition}
      onDeleteCondition={handleDeleteCondition}
      onUpdatePrescription={handleUpdatePrescription}
      onAddPrescription={handleAddPrescription}
      onDeletePrescription={handleDeletePrescription}
    />
  );
};

export default AppRoutes; 