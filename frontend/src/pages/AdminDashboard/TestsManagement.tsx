import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  InputAdornment,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Science as ScienceIcon,
} from '@mui/icons-material';

// Интерфейс для данных о типе анализа
interface TestType {
  id: string;
  name: string;
  description: string;
  normalRange: string;
  price: number;
  preparationRequired: boolean;
  preparationDescription?: string;
  category: 'blood' | 'urine' | 'imaging' | 'other';
  availability: boolean;
}

const TestsManagement: React.FC = () => {
  // Моковые данные о типах анализов
  const [testTypes, setTestTypes] = useState<TestType[]>([
    {
      id: '1',
      name: 'Общий анализ крови',
      description: 'Полный гематологический анализ для оценки общего состояния здоровья',
      normalRange: 'Эритроциты: 4.0-5.0, Лейкоциты: 4.0-9.0, Гемоглобин: 120-160',
      price: 2500,
      preparationRequired: true,
      preparationDescription: 'Сдавать натощак, за 8 часов до анализа не принимать пищу',
      category: 'blood',
      availability: true,
    },
    {
      id: '2',
      name: 'Биохимический анализ крови',
      description: 'Анализ для оценки функции печени, почек и метаболических процессов',
      normalRange: 'АЛТ: 0-40, АСТ: 0-40, Глюкоза: 3.3-5.5',
      price: 4500,
      preparationRequired: true,
      preparationDescription: 'Сдавать натощак, за 12 часов до анализа не принимать пищу',
      category: 'blood',
      availability: true,
    },
    {
      id: '3',
      name: 'Анализ мочи',
      description: 'Общий анализ мочи для выявления заболеваний мочевыводящих путей',
      normalRange: 'pH: 5.0-7.0, Белок: отсутствует, Глюкоза: отсутствует',
      price: 1800,
      preparationRequired: false,
      category: 'urine',
      availability: true,
    },
    {
      id: '4',
      name: 'УЗИ брюшной полости',
      description: 'Ультразвуковое исследование органов брюшной полости',
      normalRange: 'Нормальная структура и размеры органов',
      price: 7000,
      preparationRequired: true,
      preparationDescription: 'Не принимать пищу за 8 часов до исследования',
      category: 'imaging',
      availability: true,
    },
    {
      id: '5',
      name: 'ЭКГ',
      description: 'Электрокардиограмма для оценки работы сердца',
      normalRange: 'Нормальный ритм и проводимость',
      price: 3000,
      preparationRequired: false,
      category: 'other',
      availability: true,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedTest, setSelectedTest] = useState<TestType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTest, setNewTest] = useState<Omit<TestType, 'id'>>({
    name: '',
    description: '',
    normalRange: '',
    price: 0,
    preparationRequired: false,
    category: 'blood',
    availability: true,
  });

  // Обработчик поиска
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Обработчик изменения фильтра категории
  const handleCategoryFilterChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
  };

  // Фильтрация типов анализов
  const filteredTestTypes = testTypes.filter(test => {
    // Фильтр по поисковому запросу
    const searchMatch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Фильтр по категории
    const categoryMatch = categoryFilter === 'all' || test.category === categoryFilter;

    return searchMatch && categoryMatch;
  });

  // Обработчики для диалогов
  const handleEditClick = (test: TestType) => {
    setSelectedTest(test);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (test: TestType) => {
    setSelectedTest(test);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedTest) {
      setTestTypes(prevTestTypes =>
        prevTestTypes.map(test =>
          test.id === selectedTest.id ? selectedTest : test
        )
      );
      setIsEditDialogOpen(false);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedTest) {
      setTestTypes(prevTestTypes =>
        prevTestTypes.filter(test => test.id !== selectedTest.id)
      );
      setIsDeleteDialogOpen(false);
    }
  };

  const handleAddTest = () => {
    const newId = (Math.max(...testTypes.map(t => parseInt(t.id))) + 1).toString();
    
    setTestTypes(prevTestTypes => [
      ...prevTestTypes,
      {
        id: newId,
        ...newTest,
      }
    ]);
    
    setIsAddDialogOpen(false);
    setNewTest({
      name: '',
      description: '',
      normalRange: '',
      price: 0,
      preparationRequired: false,
      category: 'blood',
      availability: true,
    });
  };

  // Получение текста категории
  const getCategoryText = (category: string) => {
    switch (category) {
      case 'blood':
        return 'Анализы крови';
      case 'urine':
        return 'Анализы мочи';
      case 'imaging':
        return 'Визуализация';
      case 'other':
        return 'Другое';
      default:
        return 'Неизвестно';
    }
  };

  // Получение цвета категории
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'blood':
        return 'error';
      case 'urine':
        return 'warning';
      case 'imaging':
        return 'info';
      case 'other':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">
            Управление анализами и тестами
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsAddDialogOpen(true)}
          >
            Добавить тип анализа
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Поиск по названию или описанию"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchQuery('')} edge="end">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Категория</InputLabel>
            <Select
              value={categoryFilter}
              label="Категория"
              onChange={handleCategoryFilterChange}
            >
              <MenuItem value="all">Все категории</MenuItem>
              <MenuItem value="blood">Анализы крови</MenuItem>
              <MenuItem value="urine">Анализы мочи</MenuItem>
              <MenuItem value="imaging">Визуализация</MenuItem>
              <MenuItem value="other">Другое</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>Категория</TableCell>
                <TableCell>Цена (тг)</TableCell>
                <TableCell>Подготовка</TableCell>
                <TableCell>Доступность</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTestTypes.length > 0 ? (
                filteredTestTypes.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell>
                      <Typography variant="body1">{test.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{test.description}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getCategoryText(test.category)}
                        color={getCategoryColor(test.category)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{test.price.toLocaleString()} тг</TableCell>
                    <TableCell>
                      {test.preparationRequired ? (
                        <Chip label="Требуется" color="warning" size="small" />
                      ) : (
                        <Chip label="Не требуется" color="success" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      {test.availability ? (
                        <Chip label="Доступен" color="success" size="small" />
                      ) : (
                        <Chip label="Недоступен" color="error" size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditClick(test)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(test)}
                      >
                        <DeleteIcon />
                      </IconButton>
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

      {/* Диалог редактирования типа анализа */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Редактирование типа анализа</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Название"
                value={selectedTest?.name || ''}
                onChange={(e) => setSelectedTest(prev => 
                  prev ? { ...prev, name: e.target.value } : null
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Описание"
                multiline
                rows={2}
                value={selectedTest?.description || ''}
                onChange={(e) => setSelectedTest(prev => 
                  prev ? { ...prev, description: e.target.value } : null
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Нормальные значения"
                multiline
                rows={2}
                value={selectedTest?.normalRange || ''}
                onChange={(e) => setSelectedTest(prev => 
                  prev ? { ...prev, normalRange: e.target.value } : null
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Цена (тг)"
                type="number"
                value={selectedTest?.price || 0}
                onChange={(e) => setSelectedTest(prev => 
                  prev ? { ...prev, price: Number(e.target.value) } : null
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Категория</InputLabel>
                <Select
                  value={selectedTest?.category || 'blood'}
                  label="Категория"
                  onChange={(e: SelectChangeEvent) => setSelectedTest(prev => 
                    prev ? { ...prev, category: e.target.value as TestType['category'] } : null
                  )}
                >
                  <MenuItem value="blood">Анализы крови</MenuItem>
                  <MenuItem value="urine">Анализы мочи</MenuItem>
                  <MenuItem value="imaging">Визуализация</MenuItem>
                  <MenuItem value="other">Другое</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Требуется подготовка</InputLabel>
                <Select
                  value={selectedTest?.preparationRequired ? 'true' : 'false'}
                  label="Требуется подготовка"
                  onChange={(e: SelectChangeEvent) => setSelectedTest(prev => 
                    prev ? { ...prev, preparationRequired: e.target.value === 'true' } : null
                  )}
                >
                  <MenuItem value="true">Да</MenuItem>
                  <MenuItem value="false">Нет</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Доступность</InputLabel>
                <Select
                  value={selectedTest?.availability ? 'true' : 'false'}
                  label="Доступность"
                  onChange={(e: SelectChangeEvent) => setSelectedTest(prev => 
                    prev ? { ...prev, availability: e.target.value === 'true' } : null
                  )}
                >
                  <MenuItem value="true">Доступен</MenuItem>
                  <MenuItem value="false">Недоступен</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {selectedTest?.preparationRequired && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Инструкции по подготовке"
                  multiline
                  rows={2}
                  value={selectedTest?.preparationDescription || ''}
                  onChange={(e) => setSelectedTest(prev => 
                    prev ? { ...prev, preparationDescription: e.target.value } : null
                  )}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы действительно хотите удалить тип анализа "{selectedTest?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог добавления типа анализа */}
      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Добавление нового типа анализа</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Название"
                value={newTest.name}
                onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Описание"
                multiline
                rows={2}
                value={newTest.description}
                onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Нормальные значения"
                multiline
                rows={2}
                value={newTest.normalRange}
                onChange={(e) => setNewTest({ ...newTest, normalRange: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Цена (тг)"
                type="number"
                value={newTest.price}
                onChange={(e) => setNewTest({ ...newTest, price: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Категория</InputLabel>
                <Select
                  value={newTest.category}
                  label="Категория"
                  onChange={(e: SelectChangeEvent) => setNewTest({ 
                    ...newTest, 
                    category: e.target.value as TestType['category'] 
                  })}
                >
                  <MenuItem value="blood">Анализы крови</MenuItem>
                  <MenuItem value="urine">Анализы мочи</MenuItem>
                  <MenuItem value="imaging">Визуализация</MenuItem>
                  <MenuItem value="other">Другое</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Требуется подготовка</InputLabel>
                <Select
                  value={newTest.preparationRequired ? 'true' : 'false'}
                  label="Требуется подготовка"
                  onChange={(e: SelectChangeEvent) => setNewTest({ 
                    ...newTest, 
                    preparationRequired: e.target.value === 'true' 
                  })}
                >
                  <MenuItem value="true">Да</MenuItem>
                  <MenuItem value="false">Нет</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Доступность</InputLabel>
                <Select
                  value={newTest.availability ? 'true' : 'false'}
                  label="Доступность"
                  onChange={(e: SelectChangeEvent) => setNewTest({ 
                    ...newTest, 
                    availability: e.target.value === 'true' 
                  })}
                >
                  <MenuItem value="true">Доступен</MenuItem>
                  <MenuItem value="false">Недоступен</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {newTest.preparationRequired && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Инструкции по подготовке"
                  multiline
                  rows={2}
                  value={newTest.preparationDescription || ''}
                  onChange={(e) => setNewTest({ ...newTest, preparationDescription: e.target.value })}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>Отмена</Button>
          <Button 
            onClick={handleAddTest} 
            variant="contained" 
            color="primary"
            disabled={!newTest.name || !newTest.description || !newTest.normalRange || newTest.price <= 0}
          >
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TestsManagement; 