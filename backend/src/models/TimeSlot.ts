import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Doctor } from './Doctor';

export enum SlotStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  UNAVAILABLE = 'unavailable'
}

@Entity('time_slots')
export class TimeSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({
    type: 'enum',
    enum: SlotStatus,
    default: SlotStatus.AVAILABLE
  })
  status: SlotStatus;

  @ManyToOne(() => Doctor, doctor => doctor.timeSlots)
  doctor: Doctor;

  @Column()
  doctorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
