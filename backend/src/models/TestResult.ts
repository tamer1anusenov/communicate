import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Patient } from './Patient';
import { Doctor } from './Doctor';

@Entity('testResults')
export class TestResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient, patient => patient.testResults)
  patient: Patient;
  
  @Column()
  patientId: string;
  
  @ManyToOne(() => Doctor, doctor => doctor.testResults)
  doctor: Doctor;
  
  @Column()
  doctorId: string;

  @Column()
  testName: string;

  @Column('text')
  result: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}