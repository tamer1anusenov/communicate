import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IsEmail, IsString, Length, IsEnum } from 'class-validator';
import { Appointment } from './Appointment';
import { TestResult } from './TestResult';

export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
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
    enum: UserRole,
    default: UserRole.PATIENT,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @OneToMany('Doctor', 'user')
  doctorProfile: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}