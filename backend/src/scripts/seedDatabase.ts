import { AppDataSource } from '../config/database';
import { Doctor, Specialization } from '../models/Doctor';
import { TimeSlot, SlotStatus } from '../models/TimeSlot';
import { User, UserRole } from '../models/User';
import { Patient } from '../models/Patient';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';



/**
 * This script populates the database with users, doctors, patients, and time slots
 * Run with: npx ts-node src/scripts/seedDatabase.ts
 */
async function seedDatabase() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('Database connection established');
    
    const userRepository = AppDataSource.getRepository(User);
    const doctorRepository = AppDataSource.getRepository(Doctor);
    const patientRepository = AppDataSource.getRepository(Patient);
    const timeSlotRepository = AppDataSource.getRepository(TimeSlot);
    
    // Create a test patient user for appointments
    const testPatientData = {
      email: 'patient@example.com',
      password: await bcrypt.hash('password123', 10),
      role: UserRole.PATIENT,
      firstName: 'Test',
      lastName: 'Patient',
      phone: '+7 (777) 123-45-67'
    };
    
    let testPatient = await userRepository.findOne({ where: { email: testPatientData.email } });
    
    if (!testPatient) {
      testPatient = userRepository.create(testPatientData);
      await userRepository.save(testPatient);
      console.log(`Created test patient user: ${testPatient.email}`);
      
      // Create patient profile - only include fields that exist in the Patient model
      const patientProfile = patientRepository.create({
        email: testPatient.email,
        firstName: testPatient.firstName,
        lastName: testPatient.lastName,
        phone: testPatient.phone,
        password: testPatientData.password, // Use the hashed password
        // Add any other required fields for Patient model
      });
      
      await patientRepository.save(patientProfile);
      console.log(`Created patient profile for: ${testPatient.email}`);
    }
    
    // Sample doctors data
    const sampleDoctors = [
      // Терапевты
      {
        firstName: 'Алина',
        lastName: 'Коваль',
        email: 'alina.koval@example.com',
        inn: '123456789001',
        phone: '+7 (999) 123-45-01',
        password: await bcrypt.hash('password123', 10),
        specialization: Specialization.THERAPIST,
        education: 'Медицинский университет',
        experience: '12 лет',
        description: 'Диагностика и лечение ОРЗ, хронических заболеваний, вакцинация'
      },
      {
        firstName: 'Данияр',
        lastName: 'Мухамедов',
        email: 'daniyar.mukhamedov@example.com',
        inn: '123456789002',
        phone: '+7 (999) 123-45-02',
        password: await bcrypt.hash('password123', 10),
        specialization: Specialization.THERAPIST,
        education: 'Медицинский университет',
        experience: '8 лет',
        description: 'Амбулаторная терапия, профилактика заболеваний, диагностика'
      },
      // Кардиологи
      {
        firstName: 'Тимур',
        lastName: 'Алиев',
        email: 'timur.aliev@example.com',
        inn: '123456789004',
        phone: '+7 (999) 123-45-04',
        password: await bcrypt.hash('password123', 10),
        specialization: Specialization.CARDIOLOGIST,
        education: 'Медицинский университет',
        experience: '15 лет',
        description: 'Лечение ИБС, ЭКГ, консультации по сердечно-сосудистым заболеваниям'
      },
      {
        firstName: 'Гульнара',
        lastName: 'Сулейменова',
        email: 'gulnara.suleymenova@example.com',
        inn: '123456789005',
        phone: '+7 (999) 123-45-05',
        password: await bcrypt.hash('password123', 10),
        specialization: Specialization.CARDIOLOGIST,
        education: 'Медицинский университет',
        experience: '11 лет',
        description: 'Кардиоскрининг, эхокардиография, реабилитация после инфаркта'
      }
    ];
    
    // Save doctors to database and generate time slots
    for (const doctorData of sampleDoctors) {
      // Check if doctor with this email already exists
      const existingDoctor = await doctorRepository.findOne({ where: { email: doctorData.email } });
      
      if (existingDoctor) {
        console.log(`Doctor with email ${doctorData.email} already exists, skipping`);
        continue;
      }
      
      // Create user account for doctor
      const doctorUser = userRepository.create({
        email: doctorData.email,
        password: doctorData.password,
        role: UserRole.DOCTOR,
        firstName: doctorData.firstName,
        lastName: doctorData.lastName,
        phone: doctorData.phone
      });
      
      const savedDoctorUser = await userRepository.save(doctorUser);
      console.log(`Created user account for doctor: ${doctorData.email}`);
      
      // Create doctor profile linked to user
      const doctor = doctorRepository.create({
        ...doctorData,
        userId: savedDoctorUser.id // Link to user account
      });
      
      const savedDoctor = await doctorRepository.save(doctor);
      console.log(`Added doctor: ${doctor.firstName} ${doctor.lastName}`);
      
      // Generate time slots for the next 7 days
      await generateTimeSlotsForDoctor(savedDoctor.id, timeSlotRepository);
    }
    
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close database connection
    await AppDataSource.destroy();
    console.log('Database connection closed');
  }
}

/**
 * Generate time slots for a doctor for the next 7 days
 */
async function generateTimeSlotsForDoctor(doctorId: string, timeSlotRepository: any) {
  // Generate time slots for the next 7 days
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    // Skip weekends (Saturday and Sunday)
    if (date.getDay() === 0 || date.getDay() === 6) {
      continue;
    }
    
    // Generate morning slots (8:00 AM to 12:00 PM)
    for (let hour = 8; hour < 12; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const startTime = new Date(date);
        startTime.setHours(hour, minute, 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + 30);
        
        const timeSlot = timeSlotRepository.create({
          doctorId,
          startTime,
          endTime,
          status: SlotStatus.AVAILABLE
        });
        
        await timeSlotRepository.save(timeSlot);
      }
    }
    
    // Generate afternoon slots (2:00 PM to 6:00 PM)
    for (let hour = 14; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const startTime = new Date(date);
        startTime.setHours(hour, minute, 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + 30);
        
        const timeSlot = timeSlotRepository.create({
          doctorId,
          startTime,
          endTime,
          status: SlotStatus.AVAILABLE
        });
        
        await timeSlotRepository.save(timeSlot);
      }
    }
    
    console.log(`Generated time slots for ${date.toDateString()} for doctor ${doctorId}`);
  }
}

// Run the seed function
seedDatabase();
