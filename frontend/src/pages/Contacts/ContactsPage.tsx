import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Link,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import YandexMap from '../../components/YandexMap/YandexMap';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Координаты Алматы (замените на реальные координаты клиники)
  const clinicCoordinates: [number, number] = [43.238949, 76.889709];

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь обычно отправляются данные формы на бэкенд
    console.log('Form submitted:', formData);
    setSnackbar({
      open: true,
      message: 'Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.',
      severity: 'success',
    });
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Контакты
      </Typography>

      <Grid container spacing={4}>
        {/* Контактная информация */}
        <Grid item xs={12} md={6} sx={{ height: '60%' }}>
          <Paper elevation={3} sx={{ p: 3, height: '60%' }}>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOnIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="h6">Адрес</Typography>
              </Box>
              <Typography variant="body1" sx={{ ml: 4 }}>
                Алматы, ул. Примерная, 123
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTimeIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="h6">Часы работы</Typography>
              </Box>
              <Box sx={{ ml: 4 }}>
                <Typography variant="body1">Понедельник — Пятница: 9:00 — 18:00</Typography>
                <Typography variant="body1">Суббота: 9:00 — 14:00</Typography>
                <Typography variant="body1">Воскресенье: выходной</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhoneIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="h6">Телефон</Typography>
              </Box>
              <Link
                href="tel:+77771234567"
                variant="body1"
                sx={{ ml: 4, display: 'block', textDecoration: 'none' }}
              >
                +7 (777) 123-45-67
              </Link>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="h6">Email</Typography>
              </Box>
              <Link
                href="mailto:info@keremet.kz"
                variant="body1"
                sx={{ ml: 4, display: 'block', textDecoration: 'none' }}
              >
                info@keremet.kz
              </Link>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Социальные сети
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, ml: 4 }}>
                <IconButton color="primary" href="https://instagram.com" target="_blank">
                  <InstagramIcon />
                </IconButton>
                <IconButton color="primary" href="https://facebook.com" target="_blank">
                  <FacebookIcon />
                </IconButton>
                <IconButton color="primary" href="https://wa.me/77771234567" target="_blank">
                  <WhatsAppIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Карта и контактная форма */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Карта
            </Typography>
            <YandexMap 
              center={clinicCoordinates}
              zoom={15}
              height="300px"
            />
          </Paper>

          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Форма обратной связи
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Имя"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Тема сообщения"
                    name="subject"
                    value={formData.subject}
                    onChange={handleFormChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Сообщение"
                    name="message"
                    multiline
                    rows={4}
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                  >
                    Отправить
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContactsPage; 