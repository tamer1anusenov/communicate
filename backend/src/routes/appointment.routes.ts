import express from 'express';
import { 
  getAllAppointments,
  getDoctorAppointments,
  getPatientAppointments,
  bookAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  testBookAppointment
} from '../controllers/appointment.controller';
import { authMiddleware } from '../middleware/auth';
import { checkRole } from '../middleware/checkRole';

const router = express.Router();

// Public test endpoint for appointment booking (no auth required)
router.post('/test', testBookAppointment);

// Protected routes
router.use(authMiddleware);

// Admin routes
router.get('/all', checkRole(['admin']), getAllAppointments);

// Doctor routes
router.get('/doctor/:doctorId', checkRole(['doctor', 'admin']), getDoctorAppointments);
router.put('/:id/status', checkRole(['doctor', 'admin']), updateAppointmentStatus);

// Patient routes
router.get('/patient/:patientId', checkRole(['patient', 'doctor', 'admin']), getPatientAppointments);

// Booking route (patients can book appointments)
router.post('/', checkRole(['patient']), bookAppointment);

// Delete appointment (admin only)
router.delete('/:id', checkRole(['admin']), deleteAppointment);

export default router;