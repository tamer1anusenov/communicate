import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface MedicalCondition {
  id: string;
  name: string;
  diagnosisDate: string;
  status: 'active' | 'resolved' | 'chronic';
  treatment: string;
  notes: string;
}

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  notes: string;
}

interface TestResult {
  id: string;
  name: string;
  date: string;
  result: string;
  normalRange: string;
  status: 'normal' | 'abnormal';
}

interface PatientMedicalRecordProps {
  patientId: string;
  patientName: string;
  conditions: MedicalCondition[];
  prescriptions: Prescription[];
  testResults: TestResult[];
  onUpdateCondition: (condition: MedicalCondition) => void;
  onAddCondition: (condition: Omit<MedicalCondition, 'id'>) => void;
  onDeleteCondition: (id: string) => void;
  onUpdatePrescription: (prescription: Prescription) => void;
  onAddPrescription: (prescription: Omit<Prescription, 'id'>) => void;
  onDeletePrescription: (id: string) => void;
}

const PatientMedicalRecord: React.FC<PatientMedicalRecordProps> = ({
  patientId,
  patientName,
  conditions,
  prescriptions,
  testResults,
  onUpdateCondition,
  onAddCondition,
  onDeleteCondition,
  onUpdatePrescription,
  onAddPrescription,
  onDeletePrescription,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isAddConditionDialogOpen, setIsAddConditionDialogOpen] = useState(false);
  const [isAddPrescriptionDialogOpen, setIsAddPrescriptionDialogOpen] = useState(false);
  const [newCondition, setNewCondition] = useState<Omit<MedicalCondition, 'id'>>({
    name: '',
    diagnosisDate: '',
    status: 'active',
    treatment: '',
    notes: '',
  });
  const [newPrescription, setNewPrescription] = useState<Omit<Prescription, 'id'>>({
    medication: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
    notes: '',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAddCondition = () => {
    onAddCondition(newCondition);
    setIsAddConditionDialogOpen(false);
    setNewCondition({
      name: '',
      diagnosisDate: '',
      status: 'active',
      treatment: '',
      notes: '',
    });
  };

  const handleAddPrescription = () => {
    onAddPrescription(newPrescription);
    setIsAddPrescriptionDialogOpen(false);
    setNewPrescription({
      medication: '',
      dosage: '',
      frequency: '',
      startDate: '',
      endDate: '',
      notes: '',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'error';
      case 'resolved':
        return 'success';
      case 'chronic':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Медицинская карта пациента
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {patientName} (ID: {patientId})
        </Typography>
      </Paper>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Заболевания" />
          <Tab label="Назначения" />
          <Tab label="Результаты анализов" />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <Box>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsAddConditionDialogOpen(true)}
            >
              Добавить заболевание
            </Button>
          </Box>
          <List>
            {conditions.map((condition, index) => (
              <React.Fragment key={condition.id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1">{condition.name}</Typography>
                        <Chip
                          label={condition.status}
                          color={getStatusColor(condition.status)}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2">
                          Дата диагноза: {condition.diagnosisDate}
                        </Typography>
                        <Typography variant="body2">
                          Лечение: {condition.treatment}
                        </Typography>
                        {condition.notes && (
                          <Typography variant="body2" color="text.secondary">
                            Примечания: {condition.notes}
                          </Typography>
                        )}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => {/* Implement edit */}}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => onDeleteCondition(condition.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < conditions.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsAddPrescriptionDialogOpen(true)}
            >
              Добавить назначение
            </Button>
          </Box>
          <List>
            {prescriptions.map((prescription, index) => (
              <React.Fragment key={prescription.id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">
                        {prescription.medication} - {prescription.dosage}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2">
                          Частота: {prescription.frequency}
                        </Typography>
                        <Typography variant="body2">
                          Период: {prescription.startDate} - {prescription.endDate}
                        </Typography>
                        {prescription.notes && (
                          <Typography variant="body2" color="text.secondary">
                            Примечания: {prescription.notes}
                          </Typography>
                        )}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => {/* Implement edit */}}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => onDeletePrescription(prescription.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < prescriptions.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <List>
            {testResults.map((test, index) => (
              <React.Fragment key={test.id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1">{test.name}</Typography>
                        <Chip
                          label={test.status}
                          color={test.status === 'normal' ? 'success' : 'error'}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2">
                          Дата: {test.date}
                        </Typography>
                        <Typography variant="body2">
                          Результат: {test.result}
                        </Typography>
                        <Typography variant="body2">
                          Нормальный диапазон: {test.normalRange}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < testResults.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}

      <Dialog
        open={isAddConditionDialogOpen}
        onClose={() => setIsAddConditionDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Добавить заболевание</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Название заболевания"
                value={newCondition.name}
                onChange={(e) => setNewCondition({ ...newCondition, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Дата диагноза"
                type="date"
                value={newCondition.diagnosisDate}
                onChange={(e) => setNewCondition({ ...newCondition, diagnosisDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Статус"
                value={newCondition.status}
                onChange={(e) => setNewCondition({ ...newCondition, status: e.target.value as MedicalCondition['status'] })}
              >
                <MenuItem value="active">Активное</MenuItem>
                <MenuItem value="resolved">Вылечено</MenuItem>
                <MenuItem value="chronic">Хроническое</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Лечение"
                multiline
                rows={2}
                value={newCondition.treatment}
                onChange={(e) => setNewCondition({ ...newCondition, treatment: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Примечания"
                multiline
                rows={2}
                value={newCondition.notes}
                onChange={(e) => setNewCondition({ ...newCondition, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddConditionDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleAddCondition} variant="contained" color="primary">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isAddPrescriptionDialogOpen}
        onClose={() => setIsAddPrescriptionDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Добавить назначение</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Лекарство"
                value={newPrescription.medication}
                onChange={(e) => setNewPrescription({ ...newPrescription, medication: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Дозировка"
                value={newPrescription.dosage}
                onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Частота приема"
                value={newPrescription.frequency}
                onChange={(e) => setNewPrescription({ ...newPrescription, frequency: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Дата начала"
                type="date"
                value={newPrescription.startDate}
                onChange={(e) => setNewPrescription({ ...newPrescription, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Дата окончания"
                type="date"
                value={newPrescription.endDate}
                onChange={(e) => setNewPrescription({ ...newPrescription, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Примечания"
                multiline
                rows={2}
                value={newPrescription.notes}
                onChange={(e) => setNewPrescription({ ...newPrescription, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddPrescriptionDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleAddPrescription} variant="contained" color="primary">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientMedicalRecord; 