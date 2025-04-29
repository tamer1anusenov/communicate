import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { TimeSlot, SlotStatus } from '../models/TimeSlot';
import { Doctor } from '../models/Doctor';
import { MoreThanOrEqual, LessThanOrEqual } from 'typeorm';

export class TimeSlotService {
  private timeSlotRepository: Repository<TimeSlot>;
  private doctorRepository: Repository<Doctor>;

  constructor() {
    this.timeSlotRepository = AppDataSource.getRepository(TimeSlot);
    this.doctorRepository = AppDataSource.getRepository(Doctor);
  }

  /**
   * Generate fixed time slots for a doctor for a specific date
   * Morning: 8:00 AM - 12:00 PM (8 slots of 30 minutes each)
   * Afternoon: 2:00 PM - 6:00 PM (8 slots of 30 minutes each)
   */
  async generateTimeSlotsForDoctor(doctorId: string, date: Date): Promise<TimeSlot[]> {
    // Check if doctor exists
    const doctor = await this.doctorRepository.findOneBy({ id: doctorId });

    if (!doctor) {
      throw new Error(`Doctor with ID ${doctorId} not found`);
    }

    // Check if slots already exist for this doctor and date
    const existingSlots = await this.getTimeSlotsForDoctorByDate(doctorId, date);
    if (existingSlots.length > 0) {
      return existingSlots; // Slots already generated for this date
    }

    const slots: TimeSlot[] = [];
    const slotDurationMinutes = 30;
    
    // Set the date to the beginning of the day
    const slotDate = new Date(date);
    slotDate.setHours(0, 0, 0, 0);
    
    // Generate morning slots (8:00 AM - 12:00 PM)
    let startHour = 8;
    let endHour = 12;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDurationMinutes) {
        const startTime = new Date(slotDate);
        startTime.setHours(hour, minute, 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + slotDurationMinutes);
        
        const timeSlot = new TimeSlot();
        timeSlot.startTime = startTime;
        timeSlot.endTime = endTime;
        timeSlot.status = SlotStatus.AVAILABLE;
        timeSlot.doctor = doctor;
        
        const savedSlot = await this.timeSlotRepository.save(timeSlot);
        slots.push(savedSlot);
      }
    }
    
    // Generate afternoon slots (2:00 PM - 6:00 PM)
    startHour = 14; // 2:00 PM
    endHour = 18;   // 6:00 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDurationMinutes) {
        const startTime = new Date(slotDate);
        startTime.setHours(hour, minute, 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + slotDurationMinutes);
        
        const timeSlot = new TimeSlot();
        timeSlot.startTime = startTime;
        timeSlot.endTime = endTime;
        timeSlot.status = SlotStatus.AVAILABLE;
        timeSlot.doctor = doctor;
        
        const savedSlot = await this.timeSlotRepository.save(timeSlot);
        slots.push(savedSlot);
      }
    }
    
    return slots;
  }

  /**
   * Generate time slots for a doctor for the next n days
   */
  async generateTimeSlotsForDoctorForDays(doctorId: string, days: number): Promise<TimeSlot[]> {
    const allSlots: TimeSlot[] = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      const slotsForDay = await this.generateTimeSlotsForDoctor(doctorId, date);
      allSlots.push(...slotsForDay);
    }
    
    return allSlots;
  }

  /**
   * Get all time slots for a doctor by date
   */
  async getTimeSlotsForDoctorByDate(doctorId: string, date: Date): Promise<TimeSlot[]> {
    // Set start and end of the day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return this.timeSlotRepository.find({
      where: {
        doctor: { id: doctorId },
        startTime: MoreThanOrEqual(startOfDay),
        endTime: LessThanOrEqual(endOfDay)
      },
      order: {
        startTime: 'ASC'
      }
    });
  }

  /**
   * Get available time slots for a doctor by date
   */
  async getAvailableTimeSlotsForDoctorByDate(doctorId: string, date: Date): Promise<TimeSlot[]> {
    // Set start and end of the day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return this.timeSlotRepository.find({
      where: {
        doctor: { id: doctorId },
        startTime: MoreThanOrEqual(startOfDay),
        endTime: LessThanOrEqual(endOfDay),
        status: SlotStatus.AVAILABLE
      },
      order: {
        startTime: 'ASC'
      }
    });
  }

  /**
   * Update time slot status
   */
  async updateTimeSlotStatus(slotId: string, status: SlotStatus): Promise<TimeSlot> {
    const slot = await this.timeSlotRepository.findOneBy({ id: slotId });
    
    if (!slot) {
      throw new Error(`Time slot with ID ${slotId} not found`);
    }
    
    slot.status = status;
    return this.timeSlotRepository.save(slot);
  }

  /**
   * Get a time slot by ID
   */
  async getTimeSlotById(slotId: string): Promise<TimeSlot | null> {
    return this.timeSlotRepository.findOneBy({ id: slotId });
  }

  /**
   * Get upcoming time slots for a doctor
   */
  async getUpcomingTimeSlotsForDoctor(doctorId: string): Promise<TimeSlot[]> {
    const now = new Date();
    
    return this.timeSlotRepository.find({
      where: {
        doctor: { id: doctorId },
        startTime: MoreThanOrEqual(now)
      },
      order: {
        startTime: 'ASC'
      }
    });
  }

  /**
   * Mark multiple time slots as unavailable
   */
  async markTimeSlotsAsUnavailable(slotIds: string[]): Promise<TimeSlot[]> {
    const updatedSlots: TimeSlot[] = [];
    
    for (const slotId of slotIds) {
      const slot = await this.timeSlotRepository.findOneBy({ id: slotId });
      
      if (slot && slot.status === SlotStatus.AVAILABLE) {
        slot.status = SlotStatus.UNAVAILABLE;
        const updatedSlot = await this.timeSlotRepository.save(slot);
        updatedSlots.push(updatedSlot);
      }
    }
    
    return updatedSlots;
  }
}
