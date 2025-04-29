import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';

export type UserRole = 'admin' | 'doctor' | 'patient';

interface RoleSelectorProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0, 1),
    border: 0,
    '&.Mui-disabled': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

const RoleSelector: React.FC<RoleSelectorProps> = ({ role, onRoleChange }) => {
  const handleRoleChange = (
    event: React.MouseEvent<HTMLElement>,
    newRole: UserRole | null
  ) => {
    if (newRole !== null) {
      onRoleChange(newRole);
    }
  };

  return (
    <Box sx={{ mb: 3, textAlign: 'center' }}>
      <Typography variant="subtitle1" gutterBottom>
        Выберите роль
      </Typography>
      <StyledToggleButtonGroup
        value={role}
        exclusive
        onChange={handleRoleChange}
        aria-label="role selection"
      >
        <ToggleButton value="doctor" aria-label="doctor role">
          <LocalHospitalIcon sx={{ mr: 1 }} />
          Доктор
        </ToggleButton>
        <ToggleButton value="patient" aria-label="patient role">
          <PersonIcon sx={{ mr: 1 }} />
          Пациент
        </ToggleButton>
      </StyledToggleButtonGroup>
    </Box>
  );
};

export default RoleSelector; 