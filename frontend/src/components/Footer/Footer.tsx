import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const FooterWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: '#1A2D4A',
  color: '#fff',
  padding: theme.spacing(6, 0),
  marginTop: 'auto', // Это важно для прикрепления футера к низу
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: '#fff',
  textDecoration: 'none',
  '&:hover': {
    color: '#00A6B4',
    textDecoration: 'none',
  },
}));

const ContactItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1),
    color: '#00A6B4',
  },
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  color: '#fff',
  '&:hover': {
    color: '#00A6B4',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const Footer: React.FC = () => {
  return (
    <FooterWrapper component="footer">
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
              О нас
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: '#fff' }}>
              Керемет - ведущая клиника в Казахстане, предоставляющая качественные медицинские услуги с использованием современного оборудования и инновационных методов лечения.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Link 
                href="https://www.facebook.com/keremetclinik" 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ textDecoration: 'none' }}
              >
                <SocialButton aria-label="facebook">
                  <FacebookIcon />
                </SocialButton>
              </Link>
              <Link 
                href="https://www.instagram.com/keremet_clinik?igsh=OGJ4MGpnYmVpdzVh" 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ textDecoration: 'none' }}
              >
                <SocialButton aria-label="instagram">
                  <InstagramIcon />
                </SocialButton>
              </Link>
              <Link 
                href="https://wa.me/77071234567" 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ textDecoration: 'none' }}
              >
                <SocialButton aria-label="whatsapp">
                  <WhatsAppIcon />
                </SocialButton>
              </Link>
              <Link 
                href="https://t.me/madyyyyyi" 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ textDecoration: 'none' }}
              >
                <SocialButton aria-label="telegram">
                  <TelegramIcon />
                </SocialButton>
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
              Контакты
            </Typography>
            <ContactItem>
              <LocationOnIcon />
              <Typography variant="body2" sx={{ color: '#fff' }}>
                ул. Абая 150, Алматы, Казахстан
              </Typography>
            </ContactItem>
            <ContactItem>
              <PhoneIcon />
              <Typography variant="body2">
                <FooterLink href="tel:+77777777777">
                  +7 (777) 777-77-77
                </FooterLink>
              </Typography>
            </ContactItem>
            <ContactItem>
              <EmailIcon />
              <Typography variant="body2">
                <FooterLink href="mailto:info@keremet.kz">
                  info@keremet.kz
                </FooterLink>
              </Typography>
            </ContactItem>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
              Часы работы
            </Typography>
            <Typography variant="body2" gutterBottom sx={{ color: '#fff' }}>
              Понедельник - Пятница: 8:00 - 20:00
            </Typography>
            <Typography variant="body2" gutterBottom sx={{ color: '#fff' }}>
              Суббота: 9:00 - 18:00
            </Typography>
            <Typography variant="body2" sx={{ color: '#fff' }}>
              Воскресенье: 9:00 - 15:00
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ 
          mt: 4, 
          pt: 3, 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center' 
        }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            © {new Date().getFullYear()} Керемет. Все права защищены.
          </Typography>
        </Box>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;