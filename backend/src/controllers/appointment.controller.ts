import { Request, Response } from 'express';
import { AppointmentStatus } from '../models/Appointment';
import { SlotStatus } from '../models/TimeSlot';
import { AppointmentService } from '../services/appointment.service';
import { AppDataSource } from '../config/database';

// Get all appointments with filtering options
export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const { doctorId, patientId, status, startDate, endDate, search } = req.query;
    const appointmentService = new AppointmentService();
    
    const filters: any = {};
    if (doctorId) filters.doctorId = doctorId as string;
    if (patientId) filters.patientId = patientId as string;
    if (status) filters.status = status as AppointmentStatus;
    if (search) filters.search = search as string;
    
    // Parse date range if provided
    if (startDate && endDate) {
      filters.startDate = new Date(startDate as string);
      filters.endDate = new Date(endDate as string);
    }
    
    const appointments = await appointmentService.getAllAppointments(filters);
    
    // Format the response for the admin table
    const formattedAppointments = appointments.map(appointment => ({
      id: appointment.id,
      patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
      doctorName: `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
      doctorSpecialization: appointment.doctor.specialization,
      dateTime: appointment.appointmentDate,
      status: appointment.status,
      notes: appointment.notes,
      patientId: appointment.patient.id,
      doctorId: appointment.doctor.id,
      patientContact: appointment.patient.phone,
      patientEmail: appointment.patient.email
    }));
    
    return res.json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get appointments for a specific doctor with filtering options
export const getDoctorAppointments = async (req: Request, res: Response) => {
  try {
    const { doctorId } = req.params;
    const { status, startDate, endDate } = req.query;
    const appointmentService = new AppointmentService();
    
    const filters: any = {};
    if (status) filters.status = status as AppointmentStatus;
    
    // Parse date range if provided
    if (startDate && endDate) {
      filters.startDate = new Date(startDate as string);
      filters.endDate = new Date(endDate as string);
    }
    
    const appointments = await appointmentService.getDoctorAppointments(doctorId, filters);
    
    // Format the response
    const formattedAppointments = appointments.map(appointment => ({
      id: appointment.id,
      patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
      patientContact: appointment.patient.phone,
      patientEmail: appointment.patient.email,
      dateTime: appointment.appointmentDate,
      status: appointment.status,
      notes: appointment.notes,
      patientId: appointment.patient.id
    }));
    
    return res.json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get appointments for a specific patient with filtering options
export const getPatientAppointments = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const { status, startDate, endDate } = req.query;
    const appointmentService = new AppointmentService();
    
    const filters: any = {};
    if (status) filters.status = status as AppointmentStatus;
    
    // Parse date range if provided
    if (startDate && endDate) {
      filters.startDate = new Date(startDate as string);
      filters.endDate = new Date(endDate as string);
    }
    
    const appointments = await appointmentService.getPatientAppointments(patientId, filters);
    
    // Format the response
    const formattedAppointments = appointments.map(appointment => ({
      id: appointment.id,
      doctorName: `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
      doctorSpecialization: appointment.doctor.specialization,
      dateTime: appointment.appointmentDate,
      status: appointment.status,
      notes: appointment.notes,
      doctorId: appointment.doctor.id
    }));
    
    return res.json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Book a new appointment
export const bookAppointment = async (req: Request, res: Response) => {
  try {
    const { patientId, doctorId, timeSlotId, notes } = req.body;
    
    // Validate required fields
    if (!patientId || !doctorId || !timeSlotId) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields. Patient ID, Doctor ID, and Time Slot ID are required.'
      });
    }
    
    // Validate that the user making the request is the patient or an admin
    if (req.user && req.user.role !== 'ADMIN') {
      // For patient, verify they are booking for themselves
      // Get the patient record related to the user making the request
      const patientRepository = AppDataSource.getRepository('Patient');
      const patient = await patientRepository.findOne({
        where: {
          id: req.user.userId
        }
      });
      
      if (!patient || patient.id !== patientId) {
        return res.status(403).json({
          success: false,
          message: 'You can only book appointments for yourself'
        });
      }
    }
    
    const appointmentService = new AppointmentService();
    
    try {
      const appointment = await appointmentService.bookAppointment(
        patientId,
        doctorId,
        timeSlotId,
        notes
      );
      
      return res.status(201).json({
        success: true,
        message: 'Appointment booked successfully',
        appointment
      });
    } catch (err: any) {
      return res.status(400).json({ 
        success: false,
        message: err.message 
      });
    }
  } catch (error) {
    console.error('Error booking appointment:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// Test endpoint to book an appointment
export const testBookAppointment = async (req: Request, res: Response) => {
  try {
    const { patientId, doctorId, timeSlotId, notes } = req.body;
    
    // Validate required fields
    if (!patientId || !doctorId || !timeSlotId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: patientId, doctorId, or timeSlotId'
      });
    }
    
    // In a real application, we would:
    // 1. Validate that the patient and doctor exist
    // 2. Check if the time slot is available
    // 3. Update the time slot status to BOOKED
    // 4. Create the appointment
    
    // For testing, we'll just return a success message
    return res.status(201).json({
      success: true,
      message: 'Test appointment booked successfully',
      appointment: {
        id: 'test-appointment-id',
        patientId,
        doctorId,
        timeSlotId,
        status: AppointmentStatus.SCHEDULED,
        notes: notes || 'Test appointment notes',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error booking test appointment:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    const appointmentService = new AppointmentService();
    const appointment = await appointmentService.updateAppointmentStatus(id, status, notes);
    
    return res.json({
      success: true,
      message: 'Appointment status updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete an appointment
export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appointmentService = new AppointmentService();
    
    await appointmentService.deleteAppointment(id);
    
    return res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get a specific appointment by ID
export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appointmentService = new AppointmentService();
    
    const appointment = await appointmentService.getAppointmentById(id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    return res.json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
