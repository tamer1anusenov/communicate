import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import HandshakeIcon from '@mui/icons-material/Handshake';
import { useNavigate } from 'react-router-dom';

/* Стилизованный компонент Paper с эффектом поднятия при наведении */
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

/* Обертка для иконок с круглым фоном */
const IconWrapper = styled(Box)(() => ({
  width: 60,
  height: 60,
  borderRadius: '50%',
  backgroundColor: '#00A6B4',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '16px',
  '& svg': {
    fontSize: 30,
    color: '#fff',
  },
}));

const AboutPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  /* Массив достижений компании с иконками и описаниями */
  const achievements = [
    {
      icon: <LocationOnIcon />,
      title: 'Региональная служба',
      description: 'по всей территории Казахстана',
    },
    {
      icon: <BusinessIcon />,
      title: 'Собственная сеть',
      description: 'медицинских центров',
    },
    {
      icon: <PeopleIcon />,
      title: 'Квалифицированные специалисты',
      description: 'медицинские координаторы и семейные врачи',
    },
    {
      icon: <HandshakeIcon />,
      title: 'Надежные партнеры',
      description: 'крупнейшие страховые компании Казахстана',
    },
  ];

  return (
    <Box sx={{ py: 8, backgroundColor: '#f5f5f5' }}>
      {/* Главный баннер */}
      <Box
        sx={{
          background: `linear-gradient(rgba(0, 166, 180, 0.9), rgba(0, 166, 180, 0.9)), url('/images/medical-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom align="center">
            О нас — Керемет
          </Typography>
          <Typography variant="h5" align="center" sx={{ maxWidth: '800px', mx: 'auto' }}>
            Надежная казахстанская компания, предлагающая высокопрофессиональное медицинское обслуживание
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Основное описание */}
        <Paper elevation={3} sx={{ p: 4, mb: 6 }}>
          <Typography variant="body1" paragraph>
            "Керемет" — это надежная казахстанская компания, которая предлагает своим клиентам высокопрофессиональное медицинское обслуживание и отличный сервис. Мы строим свою работу на принципах уважения, беспристрастности, честности, эффективности, заботы и доверия.
          </Typography>
          <Typography variant="body1">
            Компания осознает свою социальную ответственность, служит интересам общества и государства, выполняет все обязательства перед клиентами и партнерами.
          </Typography>
        </Paper>

        {/* Раздел уникальности */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <LocalHospitalIcon sx={{ fontSize: 40, mr: 2, color: '#00A6B4' }} />
            <Typography variant="h4" component="h2">
              Наша уникальность
            </Typography>
          </Box>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#00A6B4' }}>
              "Керемет" — это единственная в Казахстане компания медицинского ассистанс, которая успешно прошла национальную аккредитацию.
            </Typography>
            <Typography variant="body1" paragraph>
              Сегодня мы внедрили комплексный подход к управлению здоровьем человека:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
              {['Диагностика', 'Лечение', 'Медицинская реабилитация', 'Профилактика'].map((item) => (
                <Paper
                  key={item}
                  sx={{
                    p: 2,
                    backgroundColor: '#00A6B4',
                    color: 'white',
                    minWidth: '200px',
                  }}
                >
                  {item}
                </Paper>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* Раздел услуг */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <MedicalServicesIcon sx={{ fontSize: 40, mr: 2, color: '#00A6B4' }} />
            <Typography variant="h4" component="h2">
              Наши услуги
            </Typography>
          </Box>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="body1" paragraph>
              Мы предлагаем широкий спектр медицинских услуг и инновационных решений, направленных на заботу о вашем здоровье. "Керемет" работает с лучшими медицинскими центрами, специалистами и технологиями для обеспечения высокого качества обслуживания.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/appointment')}
              sx={{ 
                mt: 2, 
                backgroundColor: '#00A6B4',
                '&:hover': {
                  backgroundColor: '#008c99'
                }
              }}
            >
              Записаться на прием
            </Button>
          </Paper>
        </Box>

        {/* Раздел достижений */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <EmojiEventsIcon sx={{ fontSize: 40, mr: 2, color: '#00A6B4' }} />
            <Typography variant="h4" component="h2">
              Наши достижения
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {achievements.map((achievement, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StyledPaper elevation={3}>
                  <IconWrapper>{achievement.icon}</IconWrapper>
                  <Typography variant="h6" gutterBottom>
                    {achievement.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {achievement.description}
                  </Typography>
                </StyledPaper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Раздел миссии и видения */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GroupsIcon sx={{ fontSize: 40, mr: 2, color: '#00A6B4' }} />
                <Typography variant="h5" component="h3">
                  Наша миссия
                </Typography>
              </Box>
              <Typography variant="body1">
                Высокоэффективная бизнес-модель частной медицины в Казахстане.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GroupsIcon sx={{ fontSize: 40, mr: 2, color: '#00A6B4' }} />
                <Typography variant="h5" component="h3">
                  Наше видение
                </Typography>
              </Box>
              <Typography variant="body1" paragraph>
                • Партнерство и интеграция с крупным бизнесом
              </Typography>
              <Typography variant="body1">
                • Инвестиционная привлекательность
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutPage; 