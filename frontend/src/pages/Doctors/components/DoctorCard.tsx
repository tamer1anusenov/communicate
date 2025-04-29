import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Avatar,
  Skeleton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Doctor, specialtyLabels } from '../../../data/doctors';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  minHeight: '450px',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

// Circle styled component for images
const CircleImage = styled('img')({
  width: '200px',
  height: '200px',
  objectFit: 'cover',
  borderRadius: '50%',
  border: '2px solid #00A6B4',
});

// Rectangle styled component for images
const RectangleImage = styled('img')({
  width: '200px',
  height: 'auto',
  objectFit: 'cover',
  borderRadius: '50%',
  border: '2px solid #00A6B4',
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: '200px',
  height: 'auto',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  backgroundColor: '#E6F4F8',
  color: '#00A6B4',
  fontSize: '3rem',
}));

const AppointmentButton = styled(Button)(({ theme }) => ({
  marginTop: 'auto',
  backgroundColor: '#00A6B4',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#009CA6',
  },
  padding: theme.spacing(1, 3),
}));

interface DoctorCardProps {
  doctor: Doctor;
  onSelect: () => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onSelect }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getInitials = () => {
    return `${doctor.firstName.charAt(0)}${doctor.lastName.charAt(0)}`;
  };

  const fullName = [
    doctor.lastName,
    doctor.firstName,
    doctor.patronymic,
  ].filter(Boolean).join(' ');

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <StyledCard>
      <CardContent sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        p: 4,
        alignItems: 'center' 
      }}>
        <Box sx={{ 
          position: 'relative', 
          width: 200,
          height: 200,
          margin: '0 auto', 
          mb: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {doctor.image && !imageError ? (
            <>
              {!imageLoaded && (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={700}
                  sx={{ position: 'absolute', top: 0, left: 0, borderRadius: '8px' }}
                />
              )}
              <CircleImage
                src={doctor.image}
                alt={fullName}
                style={{ display: imageLoaded ? 'block' : 'none' }}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </>
          ) : (
            <StyledAvatar>{getInitials()}</StyledAvatar>
          )}
        </Box>
        
        <Typography
          variant="h6"
          component="h3"
          sx={{
            textAlign: 'center',
            mb: 1,
            color: '#1A2D4A',
            fontWeight: 600,
            fontSize: '1.25rem'
          }}
        >
          {fullName}
        </Typography>

        <Typography
          variant="subtitle1"
          color="primary"
          sx={{
            textAlign: 'center',
            mb: 2,
            color: '#00A6B4',
            fontWeight: 500,
            fontSize: '1.1rem'
          }}
        >
          {specialtyLabels[doctor.specialization as keyof typeof specialtyLabels]}
        </Typography>

        <Box sx={{ mb: 2, width: '100%' }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1, fontWeight: 500, fontSize: '1rem' }}
          >
            Стаж: {doctor.experience}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: '0.95rem' }}
          >
            {doctor.description}
          </Typography>
        </Box>

        <AppointmentButton
          variant="contained"
          fullWidth
          onClick={onSelect}
          sx={{ mt: 'auto', py: 1.5 }}
        >
          Записаться на прием
        </AppointmentButton>
      </CardContent>
    </StyledCard>
  );
};

export default DoctorCard;