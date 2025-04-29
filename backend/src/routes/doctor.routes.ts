import { Router } from 'express';
import { getAllDoctors, getDoctorById, getBySpecialization, getTestDoctors, addSampleDoctors } from '../controllers/doctor.controller';
// import { auth } from '../middleware/auth'; // Uncomment if you want to protect doctor routes

const router = Router();

router.get('/', getAllDoctors);
router.get('/test', getTestDoctors); // Test endpoint
router.post('/seed', addSampleDoctors); // Add sample doctors to database
router.get('/:id', getDoctorById);
router.get('/specialization/:specialization', getBySpecialization);

export default router;