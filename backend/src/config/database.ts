import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Patient } from '../models/Patient';
import { Doctor } from '../models/Doctor';
import { Admin } from '../models/Admin';
import { Appointment } from '../models/Appointment';
import { TestResult } from '../models/TestResult';
import { TimeSlot } from '../models/TimeSlot';
import { User } from '../models/User';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Patient, Doctor, Admin, Appointment, TestResult, TimeSlot],
  migrations: [],
  subscribers: [],
});