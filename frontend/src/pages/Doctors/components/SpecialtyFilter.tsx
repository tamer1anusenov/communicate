import React from 'react';
import { Box, Tabs, Tab, useMediaQuery, useTheme } from '@mui/material';
import { Specialty, specialtyLabels } from '../../../data/doctors';

interface SpecialtyFilterProps {
  selectedSpecialty: Specialty;
  onSpecialtyChange: (specialty: Specialty) => void;
}

const SpecialtyFilter: React.FC<SpecialtyFilterProps> = ({
  selectedSpecialty,
  onSpecialtyChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (_event: React.SyntheticEvent, newValue: Specialty) => {
    onSpecialtyChange(newValue);
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Tabs
        value={selectedSpecialty}
        onChange={handleChange}
        variant={isMobile ? 'scrollable' : 'fullWidth'}
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: '#00A6B4',
          },
          '& .MuiTab-root': {
            color: '#2C3E50',
            '&.Mui-selected': {
              color: '#00A6B4',
            },
          },
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        {Object.entries(specialtyLabels).map(([value, label]) => (
          <Tab
            key={value}
            label={label}
            value={value}
            sx={{
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default SpecialtyFilter; 