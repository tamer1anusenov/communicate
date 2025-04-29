import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';
import { Appointment } from './Appointment';
import { TimeSlot } from './TimeSlot';
import { TestResult } from './TestResult';

export enum Specialization {
  THERAPIST = 'therapist',
  CARDIOLOGIST = 'cardiologist',
  NEUROLOGIST = 'neurologist',
  PEDIATRICIAN = 'pediatrician',
  SURGEON = 'surgeon',
  DENTIST = 'dentist',
  OPHTHALMOLOGIST = 'ophthalmologist',
  DERMATOLOGIST = 'dermatologist',
  PSYCHIATRIST = 'psychiatrist',
  ENDOCRINOLOGIST = 'endocrinologist',
}

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  @Length(2, 50)
  firstName: string;

  @Column()
  @IsString()
  @Length(2, 50)
  lastName: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ unique: true })
  @IsString()
  @Length(12, 12)
  inn: string;

  @Column()
  @IsString()
  phone: string;

  @Column()
  @IsString()
  password: string;

  @Column({
    type: 'enum',
    enum: Specialization
  })
  @IsNotEmpty()
  specialization: Specialization;

  @Column('text', { nullable: true })
  @IsString()
  education: string;

  @Column('text', { nullable: true })
  @IsString()
  experience: string;

  @Column('text', { nullable: true })
  @IsString()
  description: string;

  @OneToMany(() => Appointment, appointment => appointment.doctor)
  appointments: Appointment[];

  @OneToMany(() => TimeSlot, timeSlot => timeSlot.doctor)
  timeSlots: TimeSlot[];
  
  @OneToMany(() => TestResult, testResult => testResult.doctor)
  testResults: TestResult[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
