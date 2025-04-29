"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_middleware_1 = require("../middleware/auth.middleware");
const User_1 = require("../models/User");
const testResult_controller_1 = require("../controllers/testResult.controller");
const router = (0, express_1.Router)();
// Protected routes - require authentication
router.use(auth_middleware_1.authenticate);
// Patient and Doctor routes
router.get('/me', testResult_controller_1.getPatientTestResults); // Get current user's test results
router.get('/doctor/me', (0, auth_middleware_1.authorize)(User_1.UserRole.DOCTOR), testResult_controller_1.getDoctorTestResults); // Get doctor's test results
// Admin routes
router.get('/', (0, auth_middleware_1.authorize)(User_1.UserRole.ADMIN), testResult_controller_1.getAllTestResults);
router.get('/:id', (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN, User_1.UserRole.DOCTOR]), testResult_controller_1.getTestResultById);
// Create test result - accessible by doctors and admins
router.post('/', (0, auth_middleware_1.authorize)([User_1.UserRole.DOCTOR, User_1.UserRole.ADMIN]), [
    (0, express_validator_1.body)('patientId').notEmpty().withMessage('Patient ID is required'),
    (0, express_validator_1.body)('testType')
        .notEmpty()
        .withMessage('Test type is required')
        .isIn([
        'BLOOD_TEST',
        'URINE_TEST',
        'X_RAY',
        'MRI',
        'CT_SCAN',
        'ULTRASOUND',
        'ECG',
        'EEG',
        'ALLERGY_TEST',
        'COVID_TEST',
    ])
        .withMessage('Invalid test type'),
    (0, express_validator_1.body)('testDate')
        .notEmpty()
        .withMessage('Test date is required')
        .isISO8601()
        .withMessage('Invalid date format'),
    (0, express_validator_1.body)('status')
        .notEmpty()
        .withMessage('Status is required')
        .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
        .withMessage('Invalid status'),
    (0, express_validator_1.body)('description').optional().isString().withMessage('Description must be a string'),
    (0, express_validator_1.body)('results').optional().isString().withMessage('Results must be a string'),
    (0, express_validator_1.body)('notes').optional().isString().withMessage('Notes must be a string'),
], testResult_controller_1.createTestResult);
// Update test result - accessible by doctors and admins
router.put('/:id', (0, auth_middleware_1.authorize)([User_1.UserRole.DOCTOR, User_1.UserRole.ADMIN]), [
    (0, express_validator_1.body)('testType')
        .optional()
        .isIn([
        'BLOOD_TEST',
        'URINE_TEST',
        'X_RAY',
        'MRI',
        'CT_SCAN',
        'ULTRASOUND',
        'ECG',
        'EEG',
        'ALLERGY_TEST',
        'COVID_TEST',
    ])
        .withMessage('Invalid test type'),
    (0, express_validator_1.body)('testDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
        .withMessage('Invalid status'),
    (0, express_validator_1.body)('description').optional().isString().withMessage('Description must be a string'),
    (0, express_validator_1.body)('results').optional().isString().withMessage('Results must be a string'),
    (0, express_validator_1.body)('notes').optional().isString().withMessage('Notes must be a string'),
], testResult_controller_1.updateTestResult);
// Delete test result - accessible by admins only
router.delete('/:id', (0, auth_middleware_1.authorize)(User_1.UserRole.ADMIN), testResult_controller_1.deleteTestResult);
exports.default = router;
