import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from '@mui/icons-material';

interface Test {
  id: string;
  patientId: string;
  patientName: string;
  testType: string;
  testDate: string;
  resultDate: string | null;
  result: string | null;
  status: 'pending' | 'completed' | 'cancelled';
  notes: string;
}

const TestsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [isNewTestDialogOpen, setIsNewTestDialogOpen] = useState(false);
  const [newTest, setNewTest] = useState<Omit<Test, 'id'>>({
    patientId: '',
    patientName: '',
    testType: '',
    testDate: new Date().toISOString().split('T')[0],
    resultDate: null,
    result: null,
    status: 'pending',
    notes: '',
  });

  // Моковые данные анализов для демонстрации
  const tests: Test[] = [
    {
      id: '1',
      patientId: '1',
      patientName: 'Иван Иванов',
      testType: 'Общий анализ крови',
      testDate: '2024-03-15',
      resultDate: '2024-03-17',
      result: 'Все показатели в норме',
      status: 'completed',
      notes: '',
    },
    {
      id: '2',
      patientId: '2',
      patientName: 'Мария Петрова',
      testType: 'Анализ мочи',
      testDate: '2024-03-18',
      resultDate: null,
      result: null,
      status: 'pending',
      notes: 'Ожидается в течение 2 дней',
    },
    {
      id: '3',
      patientId: '3',
      patientName: 'Алексей Сидоров',
      testType: 'Биохимия крови',
      testDate: '2024-03-20',
      resultDate: null,
      result: null,
      status: 'pending',
      notes: '',
    },
    {
      id: '4',
      patientId: '1',
      patientName: 'Иван Иванов',
      testType: 'ЭКГ',
      testDate: '2024-03-10',
      resultDate: '2024-03-12',
      result: 'Синусовый ритм, норма',
      status: 'completed',
      notes: '',
    },
    {
      id: '5',
      patientId: '4',
      patientName: 'Елена Смирнова',
      testType: 'Глюкоза крови',
      testDate: '2024-03-05',
      resultDate: '2024-03-07',
      result: '6.2 ммоль/л (повышено)',
      status: 'completed',
      notes: 'Рекомендован контроль уровня глюкозы',
    },
  ];

  // Моковые данные пациентов
  const patients = [
    { id: '1', name: 'Иван Иванов' },
    { id: '2', name: 'Мария Петрова' },
    { id: '3', name: 'Алексей Сидоров' },
    { id: '4', name: 'Елена Смирнова' },
    { id: '5', name: 'Дмитрий Козлов' },
  ];

  // Типы анализов
  const testTypes = [
    'Общий анализ крови',
    'Биохимия крови',
    'Анализ мочи',
    'Глюкоза крови',
    'ЭКГ',
    'Флюорография',
    'УЗИ',
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleViewResult = (test: Test) => {
    setSelectedTest(test);
    setIsResultDialogOpen(true);
  };

  const handleAddResult = (test: Test) => {
    setSelectedTest({
      ...test,
      resultDate: new Date().toISOString().split('T')[0],
      result: '',
    });
    setIsResultDialogOpen(true);
  };

  const handleSaveResult = () => {
    if (selectedTest) {
      // Здесь будет логика сохранения результатов
      console.log('Сохранение результатов:', selectedTest);
      setIsResultDialogOpen(false);
    }
  };

  const handleNewTestSubmit = () => {
    // Здесь будет логика добавления нового анализа
    console.log('Добавление нового анализа:', newTest);
    setIsNewTestDialogOpen(false);
    
    // Сбросить форму
    setNewTest({
      patientId: '',
      patientName: '',
      testType: '',
      testDate: new Date().toISOString().split('T')[0],
      resultDate: null,
      result: null,
      status: 'pending',
      notes: '',
    });
  };

  const handlePatientChange = (event: SelectChangeEvent) => {
    const patientId = event.target.value;
    const patient = patients.find(p => p.id === patientId);
    
    setNewTest({
      ...newTest,
      patientId,
      patientName: patient ? patient.name : '',
    });
  };

  const filteredTests = tests.filter(test => {
    if (activeTab === 0) return true; // Все анализы
    if (activeTab === 1) return test.status === 'pending'; // Ожидающие результатов
    if (activeTab === 2) return test.status === 'completed'; // Завершенные
    return false;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">
            Управление анализами
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsNewTestDialogOpen(true)}
          >
            Назначить анализ
          </Button>
        </Box>

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Все анализы" />
          <Tab label="Ожидающие результатов" />
          <Tab label="Завершенные" />
        </Tabs>

        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Пациент</TableCell>
                <TableCell>Тип анализа</TableCell>
                <TableCell>Дата назначения</TableCell>
                <TableCell>Дата результата</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTests.length > 0 ? (
                filteredTests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell>{test.patientName}</TableCell>
                    <TableCell>{test.testType}</TableCell>
                    <TableCell>{new Date(test.testDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {test.resultDate 
                        ? new Date(test.resultDate).toLocaleDateString() 
                        : '—'
                      }
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          test.status === 'pending' 
                            ? 'Ожидает результатов' 
                            : test.status === 'completed' 
                              ? 'Завершен' 
                              : 'Отменен'
                        }
                        color={getStatusColor(test.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {test.status === 'completed' ? (
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleViewResult(test)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      ) : (
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleAddResult(test)}
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      Нет данных для отображения
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Диалог просмотра/добавления результатов */}
      <Dialog 
        open={isResultDialogOpen} 
        onClose={() => setIsResultDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedTest?.status === 'completed' 
            ? 'Просмотр результатов анализа' 
            : 'Добавление результатов анализа'
          }
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Пациент"
                value={selectedTest?.patientName || ''}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Тип анализа"
                value={selectedTest?.testType || ''}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Дата назначения"
                value={selectedTest?.testDate || ''}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Дата результата"
                type="date"
                value={selectedTest?.resultDate || ''}
                onChange={(e) => setSelectedTest(prev => 
                  prev ? { ...prev, resultDate: e.target.value } : null
                )}
                InputLabelProps={{ shrink: true }}
                disabled={selectedTest?.status === 'completed'}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Результат"
                multiline
                rows={4}
                value={selectedTest?.result || ''}
                onChange={(e) => setSelectedTest(prev => 
                  prev ? { ...prev, result: e.target.value } : null
                )}
                disabled={selectedTest?.status === 'completed'}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Примечания"
                multiline
                rows={2}
                value={selectedTest?.notes || ''}
                onChange={(e) => setSelectedTest(prev => 
                  prev ? { ...prev, notes: e.target.value } : null
                )}
                disabled={selectedTest?.status === 'completed'}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsResultDialogOpen(false)}>
            {selectedTest?.status === 'completed' ? 'Закрыть' : 'Отмена'}
          </Button>
          {selectedTest?.status !== 'completed' && (
            <Button 
              onClick={handleSaveResult}
              variant="contained" 
              color="primary"
            >
              Сохранить результаты
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Диалог назначения нового анализа */}
      <Dialog
        open={isNewTestDialogOpen}
        onClose={() => setIsNewTestDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Назначение нового анализа</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="patient-select-label">Пациент</InputLabel>
                <Select
                  labelId="patient-select-label"
                  value={newTest.patientId}
                  label="Пациент"
                  onChange={handlePatientChange}
                >
                  {patients.map((patient) => (
                    <MenuItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="test-type-select-label">Тип анализа</InputLabel>
                <Select
                  labelId="test-type-select-label"
                  value={newTest.testType}
                  label="Тип анализа"
                  onChange={(e: SelectChangeEvent) => setNewTest({ ...newTest, testType: e.target.value })}
                >
                  {testTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Дата назначения"
                type="date"
                value={newTest.testDate}
                onChange={(e) => setNewTest({ ...newTest, testDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Примечания"
                multiline
                rows={2}
                value={newTest.notes}
                onChange={(e) => setNewTest({ ...newTest, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsNewTestDialogOpen(false)}>
            Отмена
          </Button>
          <Button
            onClick={handleNewTestSubmit}
            variant="contained"
            color="primary"
            disabled={!newTest.patientId || !newTest.testType}
          >
            Назначить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TestsManagement; 