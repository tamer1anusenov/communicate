import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsDate } from 'class-validator';
import { Patient } from './Patient';
import { Doctor } from './Doctor';
import { TimeSlot } from './TimeSlot';

export enum AppointmentStatus {
  PENDING = 'PENDING',
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient, patient => patient.appointments)
  patient: Patient;

  @Column()
  patientId: string;

  @ManyToOne(() => Doctor, doctor => doctor.appointments)
  doctor: Doctor;

  @Column()
  doctorId: string;

  @OneToOne(() => TimeSlot)
  @JoinColumn()
  timeSlot: TimeSlot;

  @Column()
  timeSlotId: string;

  @Column('timestamp with time zone')
  @IsNotEmpty()
  @IsDate()
  appointmentDate: Date;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING
  })
  status: AppointmentStatus;

  @Column('text', { nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}