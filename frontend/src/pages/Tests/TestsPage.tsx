import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  InputAdornment,
  Pagination,
  Alert,
  Chip,
  SelectChangeEvent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { useNavigate } from 'react-router-dom';

interface Test {
  id: string;
  name: string;
  date: string;
  status: 'completed' | 'pending';
  result: string;
  doctorComment?: string;
  recommendations?: string;
  details?: string;
}

interface FilterState {
  dateRange: string;
  testType: string;
  status: string;
}

const mockTests: Test[] = [
  {
    id: '1',
    name: 'Общий анализ крови',
    date: '25.03.2025',
    status: 'completed',
    result: 'Нормально',
    doctorComment: 'Ваши результаты в норме, дополнительных действий не требуется.',
    recommendations: 'Нет необходимости в дальнейшем обследовании.',
    details: 'Гемоглобин: 140 г/л\nЭритроциты: 4.5 x 10^12/л\nЛейкоциты: 6.0 x 10^9/л',
  },
  {
    id: '2',
    name: 'Рентген грудной клетки',
    date: '18.03.2025',
    status: 'completed',
    result: 'Без отклонений',
    doctorComment: 'Патологических изменений не выявлено.',
    recommendations: 'Повторный осмотр через год.',
    details: 'Легочные поля без очаговых и инфильтративных изменений.',
  },
  {
    id: '3',
    name: 'Анализ мочи',
    date: '10.02.2025',
    status: 'pending',
    result: '—',
  },
];

const TestsPage: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'all',
    testType: 'all',
    status: 'all',
  });
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [page, setPage] = useState(1);
  const testsPerPage = 10;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const handleFilterChange = (field: keyof FilterState) => (
    event: SelectChangeEvent
  ) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleTestClick = (test: Test) => {
    setSelectedTest(test);
  };

  const handleCloseDialog = () => {
    setSelectedTest(null);
  };

  const filteredTests = mockTests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDateRange = filters.dateRange === 'all' || true; // Добавить логику фильтрации по диапазону дат
    const matchesType = filters.testType === 'all' || true; // Добавить логику фильтрации по типу
    const matchesStatus = filters.status === 'all' || test.status === filters.status;
    return matchesSearch && matchesDateRange && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Завершен';
      case 'pending':
        return 'В ожидании';
      default:
        return status;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Моя история анализов
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Просмотр всех ваших прошлых медицинских тестов и их результатов
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Поиск анализов..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Период</InputLabel>
                  <Select
                    value={filters.dateRange}
                    label="Период"
                    onChange={handleFilterChange('dateRange')}
                  >
                    <MenuItem value="all">Все время</MenuItem>
                    <MenuItem value="3months">Последние 3 месяца</MenuItem>
                    <MenuItem value="6months">Последние 6 месяцев</MenuItem>
                    <MenuItem value="1year">Последний год</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Тип анализа</InputLabel>
                  <Select
                    value={filters.testType}
                    label="Тип анализа"
                    onChange={handleFilterChange('testType')}
                  >
                    <MenuItem value="all">Все типы</MenuItem>
                    <MenuItem value="blood">Анализы крови</MenuItem>
                    <MenuItem value="urine">Анализы мочи</MenuItem>
                    <MenuItem value="imaging">Имиджирование</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Статус</InputLabel>
                  <Select
                    value={filters.status}
                    label="Статус"
                    onChange={handleFilterChange('status')}
                  >
                    <MenuItem value="all">Все</MenuItem>
                    <MenuItem value="completed">Завершенные</MenuItem>
                    <MenuItem value="pending">В ожидании</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {filteredTests.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          Анализы не найдены. Попробуйте изменить параметры поиска.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Название анализа</TableCell>
                <TableCell>Дата</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Результат</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell>{test.name}</TableCell>
                  <TableCell>{test.date}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(test.status)}
                      color={getStatusColor(test.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{test.result}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleTestClick(test)}
                      color="primary"
                      disabled={test.status === 'pending'}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {filteredTests.length > testsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={Math.ceil(filteredTests.length / testsPerPage)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      <Dialog
        open={!!selectedTest}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedTest && (
          <>
            <DialogTitle>
              <Typography variant="h6">{selectedTest.name}</Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Дата: {selectedTest.date}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Результат
                </Typography>
                <Typography variant="body1">{selectedTest.result}</Typography>
              </Box>
              {selectedTest.details && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Подробные результаты
                  </Typography>
                  <Typography
                    variant="body1"
                    component="pre"
                    sx={{ whiteSpace: 'pre-wrap' }}
                  >
                    {selectedTest.details}
                  </Typography>
                </Box>
              )}
              {selectedTest.doctorComment && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Комментарии врача
                  </Typography>
                  <Typography variant="body1">
                    {selectedTest.doctorComment}
                  </Typography>
                </Box>
              )}
              {selectedTest.recommendations && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Рекомендации
                  </Typography>
                  <Typography variant="body1">
                    {selectedTest.recommendations}
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Закрыть</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default TestsPage; 