import alina from '../assets/images/alina.png';
import ruslan from '../assets/images/ruslan.png';
import aizhan from '../assets/images/aizhan.png';
import gulnura from '../assets/images/gulnura.png';
import daniyar from '../assets/images/daniyar.png';
import elmira from '../assets/images/elmira.png';
import marat from '../assets/images/marat.png';
import timur from '../assets/images/timur.png';
import askar from '../assets/images/askar.png';
import sergey from '../assets/images/sergey.png';
import murat from '../assets/images/murat.png';
import zhanna from '../assets/images/zhanna.png';
import nuria from '../assets/images/nuria.png';
import aigul from '../assets/images/aigul.png';
import gulnar from '../assets/images/gulnar.png';

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  patronymic?: string;
  specialization: string;
  experience: string;
  description: string;
  image?: string;
}

export type Specialty = 
  | 'THERAPIST'
  | 'CARDIOLOGIST'
  | 'NEUROLOGIST'
  | 'PEDIATRICIAN'
  | 'SURGEON'
  | 'ALL';

export const specialtyLabels: Record<Specialty, string> = {
  ALL: 'Все специальности',
  THERAPIST: 'Терапевт',
  CARDIOLOGIST: 'Кардиолог',
  NEUROLOGIST: 'Невролог',
  PEDIATRICIAN: 'Педиатр',
  SURGEON: 'Хирург',
};

export const doctors: Doctor[] = [
  // Терапевты
  {
    id: '1',
    firstName: 'Алина',
    lastName: 'Коваль',
    patronymic: 'Сергеевна',
    specialization: 'THERAPIST',
    experience: '12 лет',
    description: 'Диагностика и лечение ОРЗ, хронических заболеваний, вакцинация',
    image: alina,
  },
  {
    id: '2',
    firstName: 'Данияр',
    lastName: 'Мухамедов',
    specialization: 'THERAPIST',
    experience: '8 лет',
    description: 'Амбулаторная терапия, профилактика заболеваний, диагностика',
    image: daniyar,
  },
  {
    id: '3',
    firstName: 'Айжан',
    lastName: 'Нурмаганбетова',
    specialization: 'THERAPIST',
    experience: '10 лет',
    description: 'Комплексная терапия, лечение пациентов с гипертонией',
    image: aizhan,
  },

  // Кардиологи
  {
    id: '4',
    firstName: 'Тимур',
    lastName: 'Алиев',
    patronymic: 'Сергеевич',
    specialization: 'CARDIOLOGIST',
    experience: '15 лет',
    description: 'Лечение ИБС, ЭКГ, консультации по сердечно-сосудистым заболеваниям',
    image: timur,
  },
  {
    id: '5',
    firstName: 'Гульнара',
    lastName: 'Сулейменова',
    specialization: 'CARDIOLOGIST',
    experience: '11 лет',
    description: 'Кардиоскрининг, эхокардиография, реабилитация после инфаркта',
    image: gulnura,
  },
  {
    id: '6',
    firstName: 'Марат',
    lastName: 'Абдрахманов',
    specialization: 'CARDIOLOGIST',
    experience: '9 лет',
    description: 'Диагностика и лечение аритмии, гипертонии',
    image: marat,
  },

  // Неврологи
  {
    id: '7',
    firstName: 'Эльмира',
    lastName: 'Байжанова',
    specialization: 'NEUROLOGIST',
    experience: '13 лет',
    description: 'Мигрени, бессонница, постинсультное восстановление',
    image: elmira,
  },
  {
    id: '8',
    firstName: 'Руслан',
    lastName: 'Оспанов',
    specialization: 'NEUROLOGIST',
    experience: '10 лет',
    description: 'Радикулит, остеохондроз, невропатия',
    image: ruslan,
  },
  {
    id: '9',
    firstName: 'Жанна',
    lastName: 'Карибаева',
    specialization: 'NEUROLOGIST',
    experience: '7 лет',
    description: 'ЭЭГ диагностика, вестибулярные расстройства',
    image: zhanna,
  },

  // Педиатры
  {
    id: '10',
    firstName: 'Нурия',
    lastName: 'Асельбек',
    specialization: 'PEDIATRICIAN',
    experience: '10 лет',
    description: 'Наблюдение за детьми от 0 до 12 лет, вакцинация, ОРВИ',
    image: nuria,
  },
  {
    id: '11',
    firstName: 'Гульнар',
    lastName: 'Ахметова',
    specialization: 'PEDIATRICIAN',
    experience: '8 лет',
    description: 'Аллергии, диспансеризация, консультации родителей',
    image: gulnar,
  },
  {
    id: '12',
    firstName: 'Сергей',
    lastName: 'Романов',
    specialization: 'PEDIATRICIAN',
    experience: '6 лет',
    description: 'Работа с новорожденными, хронические детские заболевания',
    image: sergey,
  },

  // Хирурги
  {
    id: '13',
    firstName: 'Аскар',
    lastName: 'Нуртаев',
    specialization: 'SURGEON',
    experience: '14 лет',
    description: 'Общая хирургия, лапароскопия',
    image: askar,
  },
  {
    id: '14',
    firstName: 'Айгуль',
    lastName: 'Калиева',
    specialization: 'SURGEON',
    experience: '12 лет',
    description: 'Малые хирургические вмешательства, перевязки',
    image: aigul,
  },
  {
    id: '15',
    firstName: 'Мурад',
    lastName: 'Хамитов',
    specialization: 'SURGEON',
    experience: '9 лет',
    description: 'Послеоперационное сопровождение, амбулаторные операции',
    image: murat,
  },
]; 