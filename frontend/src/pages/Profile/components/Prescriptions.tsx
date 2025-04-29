import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Grid,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  LocalPharmacy,
  CalendarToday,
  Description,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledChip = styled(Chip)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  doctorName: string;
  status: 'active' | 'completed' | 'cancelled';
  instructions?: string;
}

const Prescriptions: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: '1',
      medication: 'Амоксициллин',
      dosage: '500 мг',
      frequency: '3 раза в день',
      startDate: '2023-04-15',
      endDate: '2023-04-22',
      doctorName: 'Алина Ким',
      status: 'completed',
      instructions: 'Принимать после еды',
    },
    {
      id: '2',
      medication: 'Лозартан',
      dosage: '50 мг',
      frequency: '1 раз в день',
      startDate: '2023-05-01',
      endDate: '2023-08-01',
      doctorName: 'Руслан Ахметов',
      status: 'active',
    },
  ]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<Partial<Prescription>>({});

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, prescription: Prescription) => {
    setAnchorEl(event.currentTarget);
    setSelectedPrescription(prescription);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPrescription(null);
  };

  const handleEdit = () => {
    if (selectedPrescription) {
      setEditingPrescription(selectedPrescription);
      setOpenDialog(true);
      handleMenuClose();
    }
  };

  const handleDelete = () => {
    if (selectedPrescription) {
      setPrescriptions(prescriptions.filter(p => p.id !== selectedPrescription.id));
      handleMenuClose();
    }
  };

  const handleSave = () => {
    if (editingPrescription.id) {
      setPrescriptions(prescriptions.map(p => 
        p.id === editingPrescription.id ? { ...p, ...editingPrescription } : p
      ));
      setOpenDialog(false);
      setEditingPrescription({});
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активен';
      case 'completed':
        return 'Завершен';
      case 'cancelled':
        return 'Отменен';
      default:
        return status;
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Рецепты
      </Typography>

      <List>
        {prescriptions.map((prescription) => (
          <Paper key={prescription.id} sx={{ mb: 2, p: 2 }} elevation={2}>
            <ListItem>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6">{prescription.medication}</Typography>
                    <StyledChip
                      label={getStatusLabel(prescription.status)}
                      color={getStatusColor(prescription.status)}
                      size="small"
                    />
                  </Box>
                }
                secondary={
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocalPharmacy sx={{ mr: 1, fontSize: 16 }} />
                        <Typography variant="body2">
                          Дозировка: {prescription.dosage}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Description sx={{ mr: 1, fontSize: 16 }} />
                        <Typography variant="body2">
                          Прием: {prescription.frequency}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarToday sx={{ mr: 1, fontSize: 16 }} />
                        <Typography variant="body2">
                          {prescription.startDate} - {prescription.endDate}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Врач: {prescription.doctorName}
                      </Typography>
                      {prescription.instructions && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Инструкции: {prescription.instructions}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="more"
                  onClick={(e) => handleMenuClick(e, prescription)}
                >
                  <MoreVert />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </Paper>
        ))}
      </List>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1 }} /> Редактировать
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <Delete sx={{ mr: 1 }} /> Удалить
        </MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Редактировать рецепт</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Лекарство"
            fullWidth
            value={editingPrescription.medication || ''}
            onChange={(e) => setEditingPrescription({ ...editingPrescription, medication: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Дозировка"
            fullWidth
            value={editingPrescription.dosage || ''}
            onChange={(e) => setEditingPrescription({ ...editingPrescription, dosage: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Частота приема"
            fullWidth
            value={editingPrescription.frequency || ''}
            onChange={(e) => setEditingPrescription({ ...editingPrescription, frequency: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Дата начала"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={editingPrescription.startDate || ''}
            onChange={(e) => setEditingPrescription({ ...editingPrescription, startDate: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Дата окончания"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={editingPrescription.endDate || ''}
            onChange={(e) => setEditingPrescription({ ...editingPrescription, endDate: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Инструкции"
            fullWidth
            multiline
            rows={2}
            value={editingPrescription.instructions || ''}
            onChange={(e) => setEditingPrescription({ ...editingPrescription, instructions: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button onClick={handleSave} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Prescriptions; 