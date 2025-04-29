import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledChip = styled(Chip)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

interface MedicalCondition {
  id: string;
  name: string;
  diagnosisDate: string;
  status: 'active' | 'chronic' | 'resolved';
  treatment: string;
  notes: string;
}

const MedicalRecord: React.FC = () => {
  const [conditions] = useState<MedicalCondition[]>([
    {
      id: '1',
      name: 'Гипертония',
      diagnosisDate: '2023-01-15',
      status: 'chronic',
      treatment: 'Лозартан 50мг 1 раз в день, контроль диеты, ограничение соли',
      notes: 'Регулярный мониторинг АД. Целевое давление <140/90 мм.рт.ст.',
    },
    {
      id: '2',
      name: 'ОРВИ',
      diagnosisDate: '2023-03-20',
      status: 'resolved',
      treatment: 'Противовирусная терапия, жаропонижающие препараты, обильное питье',
      notes: 'Полное выздоровление. Рекомендована вакцинация от гриппа в следующем сезоне.',
    },
    {
      id: '3',
      name: 'Гастрит',
      diagnosisDate: '2022-08-10',
      status: 'chronic',
      treatment: 'Омепразол 20мг, диетотерапия, дробное питание',
      notes: 'Обострения 1-2 раза в год. Контроль через ФГДС 1 раз в год.',
    },
    {
      id: '4',
      name: 'Острый бронхит',
      diagnosisDate: '2021-11-25',
      status: 'resolved',
      treatment: 'Амоксициллин 500мг 2 раза в день, муколитики, ингаляции',
      notes: 'Полное выздоровление через 14 дней. Рекомендовано избегать переохлаждения.',
    },
    {
      id: '5',
      name: 'Аллергический ринит',
      diagnosisDate: '2020-05-03',
      status: 'chronic',
      treatment: 'Цетиризин при обострениях, назальные спреи',
      notes: 'Сезонные обострения весной. Проведена аллергодиагностика.',
    },
    {
      id: '6',
      name: 'Остеохондроз шейного отдела',
      diagnosisDate: '2019-09-15',
      status: 'chronic',
      treatment: 'ЛФК, массаж, физиотерапия',
      notes: 'Регулярные профилактические курсы лечения 2 раза в год.',
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'error';
      case 'chronic':
        return 'warning';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Острое';
      case 'chronic':
        return 'Хроническое';
      case 'resolved':
        return 'Вылечено';
      default:
        return status;
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Медицинская карта
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          История заболеваний
        </Typography>
        <List>
          {conditions.map((condition) => (
            <Paper key={condition.id} sx={{ mb: 2, p: 2 }} elevation={1}>
              <ListItem>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h6">{condition.name}</Typography>
                      <StyledChip
                        label={getStatusLabel(condition.status)}
                        color={getStatusColor(condition.status)}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Диагностировано:</strong> {condition.diagnosisDate}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Лечение:</strong> {condition.treatment}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Примечания:</strong> {condition.notes}
                        </Typography>
                      </Grid>
                    </Grid>
                  }
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default MedicalRecord; 