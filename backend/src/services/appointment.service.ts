import { Repository, DataSource } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Appointment, AppointmentStatus } from '../models/Appointment';
import { TimeSlot, SlotStatus } from '../models/TimeSlot';
import { Patient } from '../models/Patient';
import { Doctor } from '../models/Doctor';

export class AppointmentService {
  private appointmentRepository: Repository<Appointment>;
  private timeSlotRepository: Repository<TimeSlot>;
  private patientRepository: Repository<Patient>;
  private doctorRepository: Repository<Doctor>;

  constructor() {
    this.appointmentRepository = AppDataSource.getRepository(Appointment);
    this.timeSlotRepository = AppDataSource.getRepository(TimeSlot);
    this.patientRepository = AppDataSource.getRepository(Patient);
    this.doctorRepository = AppDataSource.getRepository(Doctor);
  }

  /**
   * Book a new appointment
   * 1. Check if the time slot exists and is available
   * 2. Create the appointment
   * 3. Update the time slot status to BOOKED
   */
  async bookAppointment(patientId: string, doctorId: string, timeSlotId: string, notes?: string): Promise<Appointment> {
    // Check if the time slot exists and is available
    const timeSlot = await this.timeSlotRepository.findOneBy({ id: timeSlotId });

    if (!timeSlot) {
      throw new Error('Time slot not found');
    }

    if (timeSlot.status !== SlotStatus.AVAILABLE) {
      throw new Error('Time slot is not available');
    }

    // Check if the doctor exists
    const doctor = await this.doctorRepository.findOneBy({ id: doctorId });

    if (!doctor) {
      throw new Error('Doctor not found');
    }

    // Check if the patient exists
    const patient = await this.patientRepository.findOneBy({ id: patientId });

    if (!patient) {
      throw new Error('Patient not found');
    }

    // Use a transaction to ensure data consistency
    return AppDataSource.transaction(async (transactionalEntityManager) => {
      // Update the time slot status to BOOKED
      timeSlot.status = SlotStatus.BOOKED;
      await transactionalEntityManager.save(timeSlot);

      // Create the appointment
      const appointment = new Appointment();
      appointment.doctor = doctor;
      appointment.patient = patient;
      appointment.timeSlot = timeSlot;
      appointment.status = AppointmentStatus.SCHEDULED;
      appointment.notes = notes;

      return transactionalEntityManager.save(appointment);
    });
  }

  /**
   * Get all appointments with filtering options
   */
  async getAllAppointments(filters: any = {}): Promise<Appointment[]> {
    const { doctorId, patientId, status, startDate, endDate, search } = filters;

    // Build the query
    const queryBuilder = this.appointmentRepository.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .leftJoinAndSelect('doctor.user', 'doctorUser')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('patient.user', 'patientUser')
      .leftJoinAndSelect('appointment.timeSlot', 'timeSlot');

    // Apply filters
    if (doctorId) {
      queryBuilder.andWhere('doctor.id = :doctorId', { doctorId });
    }

    if (patientId) {
      queryBuilder.andWhere('patient.id = :patientId', { patientId });
    }

    if (status) {
      queryBuilder.andWhere('appointment.status = :status', { status });
    }

    // Add date range filter if provided
    if (startDate && endDate) {
      queryBuilder.andWhere('timeSlot.startTime >= :startDate', { startDate: new Date(startDate) })
        .andWhere('timeSlot.startTime <= :endDate', { endDate: new Date(endDate) });
    }

    // Search in patient or doctor name
    if (search) {
      queryBuilder.andWhere(
        '(patientUser.firstName ILIKE :search OR patientUser.lastName ILIKE :search OR ' +
        'doctorUser.firstName ILIKE :search OR doctorUser.lastName ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Order by appointment date
    queryBuilder.orderBy('timeSlot.startTime', 'ASC');

    return queryBuilder.getMany();
  }

  /**
   * Get appointments for a specific doctor
   */
  async getDoctorAppointments(doctorId: string, filters: any = {}): Promise<Appointment[]> {
    const { status, startDate, endDate } = filters;

    // Build the query
    const queryBuilder = this.appointmentRepository.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('patient.user', 'patientUser')
      .leftJoinAndSelect('appointment.timeSlot', 'timeSlot')
      .where('appointment.doctorId = :doctorId', { doctorId });

    // Apply filters
    if (status) {
      queryBuilder.andWhere('appointment.status = :status', { status });
    }

    // Add date range filter if provided
    if (startDate && endDate) {
      queryBuilder.andWhere('timeSlot.startTime >= :startDate', { startDate: new Date(startDate) })
        .andWhere('timeSlot.startTime <= :endDate', { endDate: new Date(endDate) });
    }

    // Order by appointment date
    queryBuilder.orderBy('timeSlot.startTime', 'ASC');

    return queryBuilder.getMany();
  }

  /**
   * Get appointments for a specific patient
   */
  async getPatientAppointments(patientId: string, filters: any = {}): Promise<Appointment[]> {
    const { status, startDate, endDate } = filters;

    // Build the query
    const queryBuilder = this.appointmentRepository.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .leftJoinAndSelect('doctor.user', 'doctorUser')
      .leftJoinAndSelect('appointment.timeSlot', 'timeSlot')
      .where('appointment.patientId = :patientId', { patientId });

    // Apply filters
    if (status) {
      queryBuilder.andWhere('appointment.status = :status', { status });
    }

    // Add date range filter if provided
    if (startDate && endDate) {
      queryBuilder.andWhere('timeSlot.startTime >= :startDate', { startDate: new Date(startDate) })
        .andWhere('timeSlot.startTime <= :endDate', { endDate: new Date(endDate) });
    }

    // Order by appointment date
    queryBuilder.orderBy('timeSlot.startTime', 'ASC');

    return queryBuilder.getMany();
  }

  /**
   * Get a specific appointment by ID
   */
  async getAppointmentById(appointmentId: string): Promise<Appointment | null> {
    return this.appointmentRepository.findOne({
      where: { id: appointmentId },
      relations: ['doctor', 'doctor.user', 'patient', 'patient.user', 'timeSlot']
    });
  }

  /**
   * Update appointment status
   */
  async updateAppointmentStatus(appointmentId: string, status: AppointmentStatus, notes?: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
      relations: ['timeSlot']
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    // Update appointment status
    appointment.status = status;
    
    // Update notes if provided
    if (notes !== undefined) {
      appointment.notes = notes;
    }

    // If appointment is cancelled, make the time slot available again
    if (status === AppointmentStatus.CANCELLED) {
      const timeSlot = appointment.timeSlot;
      timeSlot.status = SlotStatus.AVAILABLE;
      await this.timeSlotRepository.save(timeSlot);
    }

    return this.appointmentRepository.save(appointment);
  }

  /**
   * Delete an appointment
   */
  async deleteAppointment(appointmentId: string): Promise<boolean> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
      relations: ['timeSlot']
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    // Make the time slot available again
    const timeSlot = appointment.timeSlot;
    timeSlot.status = SlotStatus.AVAILABLE;
    await this.timeSlotRepository.save(timeSlot);

    // Delete the appointment
    await this.appointmentRepository.remove(appointment);
    
    return true;
  }
}
