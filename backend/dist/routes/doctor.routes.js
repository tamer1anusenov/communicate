"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_middleware_1 = require("../middleware/auth.middleware");
const User_1 = require("../models/User");
const doctor_controller_1 = require("../controllers/doctor.controller");
const router = (0, express_1.Router)();
// Public routes
router.get('/', doctor_controller_1.getAllDoctors);
router.get('/:id', doctor_controller_1.getDoctorById);
// Protected routes
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(User_1.UserRole.ADMIN), [
    (0, express_validator_1.body)('userId').notEmpty().withMessage('User ID is required'),
    (0, express_validator_1.body)('specialization')
        .notEmpty()
        .withMessage('Specialization is required')
        .isIn([
        'therapist',
        'cardiologist',
        'neurologist',
        'pediatrician',
        'surgeon',
        'dentist',
        'ophthalmologist',
        'dermatologist',
        'psychiatrist',
        'endocrinologist',
    ])
        .withMessage('Invalid specialization'),
    (0, express_validator_1.body)('education').notEmpty().withMessage('Education is required'),
    (0, express_validator_1.body)('experience').notEmpty().withMessage('Experience is required'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Description is required'),
], doctor_controller_1.createDoctor);
router.put('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(User_1.UserRole.ADMIN), [
    (0, express_validator_1.body)('specialization')
        .optional()
        .isIn([
        'therapist',
        'cardiologist',
        'neurologist',
        'pediatrician',
        'surgeon',
        'dentist',
        'ophthalmologist',
        'dermatologist',
        'psychiatrist',
        'endocrinologist',
    ])
        .withMessage('Invalid specialization'),
    (0, express_validator_1.body)('education').optional().notEmpty().withMessage('Education cannot be empty'),
    (0, express_validator_1.body)('experience').optional().notEmpty().withMessage('Experience cannot be empty'),
    (0, express_validator_1.body)('description').optional().notEmpty().withMessage('Description cannot be empty'),
], doctor_controller_1.updateDoctor);
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(User_1.UserRole.ADMIN), doctor_controller_1.deleteDoctor);
exports.default = router;
