import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { TimeSlot, SlotStatus } from '../models/TimeSlot';
import { Doctor } from '../models/Doctor';
import { TimeSlotService } from '../services/timeSlot.service';

// Get all time slots for a specific doctor
export const getDoctorTimeSlots = async (req: Request, res: Response) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;
    const timeSlotService = new TimeSlotService();
    
    let timeSlots;
    if (date) {
      // Get time slots for a specific date
      const dateObj = new Date(date as string);
      timeSlots = await timeSlotService.getTimeSlotsForDoctorByDate(doctorId, dateObj);
    } else {
      // Get all upcoming time slots
      timeSlots = await timeSlotService.getUpcomingTimeSlotsForDoctor(doctorId);
    }
    
    return res.json(timeSlots);
  } catch (error) {
    console.error('Error fetching doctor time slots:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get available time slots for a specific doctor
export const getAvailableTimeSlots = async (req: Request, res: Response) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;
    const timeSlotService = new TimeSlotService();
    
    if (!date) {
      return res.status(400).json({ 
        success: false,
        message: 'Date parameter is required' 
      });
    }
    
    const dateObj = new Date(date as string);
    const availableTimeSlots = await timeSlotService.getAvailableTimeSlotsForDoctorByDate(doctorId, dateObj);
    
    // Format slots for frontend display
    const formattedSlots = availableTimeSlots.map(slot => ({
      id: slot.id,
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: slot.status,
      formattedStartTime: formatTimeSlot(slot.startTime),
      formattedEndTime: formatTimeSlot(slot.endTime),
      doctorId: slot.doctorId
    }));

    // Group slots by hour for better display on frontend
    const slotsByHour: Record<string, typeof formattedSlots> = {};
    formattedSlots.forEach(slot => {
      const hour = new Date(slot.startTime).getHours().toString();
      if (!slotsByHour[hour]) {
        slotsByHour[hour] = [];
      }
      slotsByHour[hour].push(slot);
    });
    
    return res.json({
      success: true,
      date: dateObj.toISOString().split('T')[0],
      slots: formattedSlots,
      slotsByHour,
      total: formattedSlots.length
    });
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// Helper function to format time slots for display
function formatTimeSlot(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Generate time slots for a doctor for a specific date
export const generateTimeSlotsForDate = async (req: Request, res: Response) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.body;
    
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }
    
    const timeSlotService = new TimeSlotService();
    const dateObj = new Date(date);
    const timeSlots = await timeSlotService.generateTimeSlotsForDoctor(doctorId, dateObj);
    
    return res.status(201).json({
      message: 'Time slots generated successfully',
      timeSlots
    });
  } catch (error) {
    console.error('Error generating time slots:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a time slot status
export const updateTimeSlotStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const timeSlotService = new TimeSlotService();
    const timeSlot = await timeSlotService.updateTimeSlotStatus(id, status);
    
    return res.json({
      message: 'Time slot status updated successfully',
      timeSlot
    });
  } catch (error) {
    console.error('Error updating time slot status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Mark time slots as unavailable (for doctor's time off)
export const markTimeSlotsAsUnavailable = async (req: Request, res: Response) => {
  try {
    const { slotIds } = req.body;
    
    if (!slotIds || !Array.isArray(slotIds) || slotIds.length === 0) {
      return res.status(400).json({ message: 'Valid slot IDs array is required' });
    }
    
    const timeSlotService = new TimeSlotService();
    const updatedSlots = await timeSlotService.markTimeSlotsAsUnavailable(slotIds);
    
    return res.json({
      message: 'Time slots marked as unavailable successfully',
      timeSlots: updatedSlots
    });
  } catch (error) {
    console.error('Error marking time slots as unavailable:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Generate time slots for a doctor for multiple days
export const generateTimeSlotsForDays = async (req: Request, res: Response) => {
  try {
    const { doctorId } = req.params;
    const { days = 7 } = req.body; // Default to 7 days
    
    const timeSlotService = new TimeSlotService();
    const timeSlots = await timeSlotService.generateTimeSlotsForDoctorForDays(doctorId, days);
    
    return res.status(201).json({
      message: `Time slots generated successfully for the next ${days} days`,
      count: timeSlots.length,
      timeSlots
    });
  } catch (error) {
    console.error('Error generating time slots for days:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Test endpoint to return sample time slots
export const getTestTimeSlots = async (req: Request, res: Response) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }
    
    const requestDate = new Date(date as string);
    const today = new Date();
    
    // Generate time slots for the requested date
    // Morning slots: 8:00 AM to 12:00 PM (8 slots of 30 minutes each)
    // Afternoon slots: 2:00 PM to 6:00 PM (8 slots of 30 minutes each)
    const slots = [];
    const slotsByHour: Record<string, any[]> = {};
    
    // Helper function to format time
    const formatTime = (hours: number, minutes: number) => {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };
    
    // Generate morning slots (8:00 AM to 12:00 PM)
    for (let hour = 8; hour < 12; hour++) {
      const hourKey = formatTime(hour, 0);
      slotsByHour[hourKey] = [];
      
      for (let minute = 0; minute < 60; minute += 30) {
        const startTime = new Date(requestDate);
        startTime.setHours(hour, minute, 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + 30);
        
        // Determine if the slot is in the past
        const isPast = startTime < today;
        
        // All future slots are available by default
        const slot = {
          id: `${doctorId}-${startTime.toISOString()}`,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          status: isPast ? 'UNAVAILABLE' : 'AVAILABLE',
          formattedStartTime: formatTime(hour, minute),
          formattedEndTime: formatTime(endTime.getHours(), endTime.getMinutes()),
          doctorId
        };
        
        slots.push(slot);
        slotsByHour[hourKey].push(slot);
      }
    }
    
    // Generate afternoon slots (2:00 PM to 6:00 PM)
    for (let hour = 14; hour < 18; hour++) {
      const hourKey = formatTime(hour, 0);
      slotsByHour[hourKey] = [];
      
      for (let minute = 0; minute < 60; minute += 30) {
        const startTime = new Date(requestDate);
        startTime.setHours(hour, minute, 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + 30);
        
        // Determine if the slot is in the past
        const isPast = startTime < today;
        
        // All future slots are available by default
        const slot = {
          id: `${doctorId}-${startTime.toISOString()}`,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          status: isPast ? 'UNAVAILABLE' : 'AVAILABLE',
          formattedStartTime: formatTime(hour, minute),
          formattedEndTime: formatTime(endTime.getHours(), endTime.getMinutes()),
          doctorId
        };
        
        slots.push(slot);
        slotsByHour[hourKey].push(slot);
      }
    }
    
    return res.json({
      success: true,
      date: requestDate.toISOString().split('T')[0],
      slots,
      slotsByHour,
      total: slots.length
    });
  } catch (error) {
    console.error('Error generating test time slots:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
