import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ScienceIcon from '@mui/icons-material/Science';
import SearchIcon from '@mui/icons-material/Search';
import welcomeImage from '../../assets/images/welcome.jpg';

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundImage: `url(${welcomeImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  padding: theme.spacing(20, 0),
  marginBottom: theme.spacing(6),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    zIndex: 1,
  },
}));

const ContentWrapper = styled(Box)({
  position: 'relative',
  zIndex: 2,
});

const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  marginTop: theme.spacing(6),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

const QuickAccessButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2, 4),
  borderRadius: '8px',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 500,
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  },
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(1.5),
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.3rem',
  },
}));

const AppointmentButton = styled(QuickAccessButton)({
  backgroundColor: '#00A6B4',
  color: '#FFFFFF',
  '&:hover': {
    backgroundColor: '#009CA6',
  },
});

const TestResultsButton = styled(QuickAccessButton)({
  backgroundColor: '#D0EDF5',
  color: '#1A2D4A',
  '&:hover': {
    backgroundColor: '#E6F4F8',
  },
});

const FindDoctorButton = styled(QuickAccessButton)({
  backgroundColor: '#0079A1',
  color: '#FFFFFF',
  '&:hover': {
    backgroundColor: '#006D91',
  },
});

const InfoCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s',
  backgroundColor: '#F9FAFB',
  border: '1px solid #E6F4F8',
  boxShadow: 'none',
  borderRadius: '12px',
  padding: theme.spacing(3),
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
}));

const CardsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  marginTop: theme.spacing(6),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    '& > *': {
      flex: 1,
      minWidth: 0,
    },
  },
}));

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: '#F9FAFB' }}>
      <HeroSection>
        <Container maxWidth="lg">
          <ContentWrapper sx={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: '800px' }}>
            
            <Box sx={{ maxWidth: 800 }}>
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  color: '#1A2D4A',
                  fontWeight: 500,
                  mb: 3
                }}
              >
                Добро пожаловать в Керемет Диагностический Центр
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#2C3E50',
                  mb: 6,
                  fontWeight: 400,
                  lineHeight: 1.6
                }}
              >
                Ваше здоровье - наш главный приоритет. Мы предоставляем качественные медицинские услуги с использованием современного оборудования.
              </Typography>
              <ActionButtonsContainer sx={{ marginTop: '20%'}}>
                <AppointmentButton
                  variant="contained"
                  startIcon={<CalendarTodayIcon />}
                  onClick={() => navigate('/appointment')}
                >
                  Записаться на прием
                </AppointmentButton>
                <TestResultsButton
                  variant="contained"
                  startIcon={<ScienceIcon />}
                  onClick={() => navigate('/tests')}
                >
                  Посмотреть результаты анализов
                </TestResultsButton>
                <FindDoctorButton
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={() => navigate('/doctors')}
                >
                  Найти врача
                </FindDoctorButton>
              </ActionButtonsContainer>
            </Box>
          </ContentWrapper>
        </Container>
      </HeroSection>

      <Container maxWidth="lg">
        <CardsContainer sx={{ marginLeft: 'auto', marginRight: 'auto' }}>
          <InfoCard>
            <CardContent sx={{ p: 0 }}>
              <Typography variant="h5" gutterBottom sx={{ color: '#1A2D4A', fontWeight: 500 }}>
                О клинике
              </Typography>
              <Typography variant="body1" sx={{ color: '#2C3E50' }}>
                Керемет Диагностический Центр - это современное медицинское учреждение, оснащенное передовым оборудованием и укомплектованное опытными специалистами.
              </Typography>
            </CardContent>
          </InfoCard>
          <InfoCard>
            <CardContent sx={{ p: 0 }}>
              <Typography variant="h5" gutterBottom sx={{ color: '#1A2D4A', fontWeight: 500 }}>
                Наши услуги
              </Typography>
              <Typography variant="body1" sx={{ color: '#2C3E50' }}>
                Мы предоставляем широкий спектр медицинских услуг, включая консультации специалистов, лабораторные исследования, инструментальную диагностику и многое другое.
              </Typography>
            </CardContent>
          </InfoCard>
          <InfoCard>
            <CardContent sx={{ p: 0 }}>
              <Typography variant="h5" gutterBottom sx={{ color: '#1A2D4A', fontWeight: 500 }}>
                Быстрая запись
              </Typography>
              <Typography variant="body1" sx={{ color: '#2C3E50' }}>
                Запишитесь на прием онлайн или по телефону. Мы предлагаем удобное время для посещения и минимальное время ожидания.
              </Typography>
            </CardContent>
          </InfoCard>
        </CardsContainer>
      </Container>
    </Box>
  );
};

export default Home; 