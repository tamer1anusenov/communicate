"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_middleware_1 = require("../middleware/auth.middleware");
const User_1 = require("../models/User");
const appointment_controller_1 = require("../controllers/appointment.controller");
const router = (0, express_1.Router)();
// Protected routes - require authentication
router.use(auth_middleware_1.authenticate);
// Patient and Doctor routes
router.get('/me', appointment_controller_1.getPatientAppointments); // Get current user's appointments
router.get('/doctor/me', (0, auth_middleware_1.authorize)(User_1.UserRole.DOCTOR), appointment_controller_1.getDoctorAppointments); // Get doctor's appointments
// Admin routes
router.get('/', (0, auth_middleware_1.authorize)(User_1.UserRole.ADMIN), appointment_controller_1.getAllAppointments);
router.get('/:id', (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN, User_1.UserRole.DOCTOR]), appointment_controller_1.getAppointmentById);
// Create appointment - accessible by patients and admins
router.post('/', (0, auth_middleware_1.authorize)([User_1.UserRole.PATIENT, User_1.UserRole.ADMIN]), [
    (0, express_validator_1.body)('doctorId').notEmpty().withMessage('Doctor ID is required'),
    (0, express_validator_1.body)('appointmentDate')
        .notEmpty()
        .withMessage('Appointment date is required')
        .isISO8601()
        .withMessage('Invalid date format'),
    (0, express_validator_1.body)('notes').optional().isString().withMessage('Notes must be a string'),
], appointment_controller_1.createAppointment);
// Update appointment - accessible by doctors and admins
router.put('/:id', (0, auth_middleware_1.authorize)([User_1.UserRole.DOCTOR, User_1.UserRole.ADMIN]), [
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
        .withMessage('Invalid status'),
    (0, express_validator_1.body)('notes').optional().isString().withMessage('Notes must be a string'),
], appointment_controller_1.updateAppointment);
// Delete appointment - accessible by admins only
router.delete('/:id', (0, auth_middleware_1.authorize)(User_1.UserRole.ADMIN), appointment_controller_1.deleteAppointment);
exports.default = router;
