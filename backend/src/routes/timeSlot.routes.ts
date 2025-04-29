import express from 'express';
import { 
  getDoctorTimeSlots, 
  getAvailableTimeSlots, 
  generateTimeSlotsForDate,
  updateTimeSlotStatus,
  markTimeSlotsAsUnavailable,
  generateTimeSlotsForDays,
  getTestTimeSlots
} from '../controllers/timeSlot.controller';
import { authMiddleware } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';

const router = express.Router();

// Get routes - accessible to all users
router.get('/doctor/:doctorId', getDoctorTimeSlots);
router.get('/available/:doctorId', getAvailableTimeSlots);

// Test endpoint for time slots
router.get('/test/available/:doctorId', getTestTimeSlots);

// Doctor-only routes
router.post('/generate/:doctorId', authMiddleware, checkRole(['doctor', 'admin']), generateTimeSlotsForDate);
router.post('/generate-days/:doctorId', authMiddleware, checkRole(['doctor', 'admin']), generateTimeSlotsForDays);
router.put('/status/:id', authMiddleware, checkRole(['doctor', 'admin']), updateTimeSlotStatus);
router.post('/unavailable', authMiddleware, checkRole(['doctor', 'admin']), markTimeSlotsAsUnavailable);

export default router;
