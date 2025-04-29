import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IsEmail, IsString, Length } from 'class-validator';
import { Appointment } from './Appointment';
import { TestResult } from './TestResult';

@Entity('patients')
export class Patient {
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
  
  @Column({ nullable: true })
  @IsString()
  address: string;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];

  @OneToMany(() => TestResult, (testResult) => testResult.patient)
  testResults: TestResult[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
