import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import DoctorsPage from './pages/Doctors/DoctorsPage';
import AppointmentPage from './pages/Appointment/AppointmentPage';
import TestsPage from './pages/Tests/TestsPage';
import ContactsPage from './pages/Contacts/ContactsPage';
import AboutPage from './pages/About/AboutPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ProfilePage from './pages/Profile/ProfilePage';
import { Box } from '@mui/material';

const AppContent: React.FC = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <Router>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        <Header />
        <Box sx={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/appointment" element={<AppointmentPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route 
              path="/profile" 
              element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/tests" 
              element={isLoggedIn ? <TestsPage /> : <Navigate to="/login" />} 
            />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
};

export default AppContent; 