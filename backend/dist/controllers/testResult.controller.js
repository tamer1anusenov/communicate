"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTestResult = exports.updateTestResult = exports.createTestResult = exports.getDoctorTestResults = exports.getPatientTestResults = exports.getTestResultById = exports.getAllTestResults = void 0;
const express_validator_1 = require("express-validator");
const database_1 = require("../config/database");
const TestResult_1 = require("../models/TestResult");
const Doctor_1 = require("../models/Doctor");
const User_1 = require("../models/User");
const getAllTestResults = async (req, res) => {
    try {
        const testResultRepository = database_1.AppDataSource.getRepository(TestResult_1.TestResult);
        const testResults = await testResultRepository.find({
            relations: ['patient', 'doctor', 'doctor.user'],
            order: { testDate: 'DESC' },
        });
        res.json(testResults);
    }
    catch (error) {
        console.error('Get all test results error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllTestResults = getAllTestResults;
const getTestResultById = async (req, res) => {
    try {
        const testResultRepository = database_1.AppDataSource.getRepository(TestResult_1.TestResult);
        const testResult = await testResultRepository.findOne({
            where: { id: req.params.id },
            relations: ['patient', 'doctor', 'doctor.user'],
        });
        if (!testResult) {
            return res.status(404).json({ message: 'Test result not found' });
        }
        // Check if user has permission to view this test result
        const user = req.user;
        const isAdmin = user.role === User_1.UserRole.ADMIN;
        const isAssignedDoctor = user.role === User_1.UserRole.DOCTOR && testResult.doctor.user.id === user.id;
        if (!isAdmin && !isAssignedDoctor) {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.json(testResult);
    }
    catch (error) {
        console.error('Get test result by ID error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getTestResultById = getTestResultById;
const getPatientTestResults = async (req, res) => {
    try {
        const user = req.user;
        const testResultRepository = database_1.AppDataSource.getRepository(TestResult_1.TestResult);
        const testResults = await testResultRepository.find({
            where: { patient: { id: user.id } },
            relations: ['patient', 'doctor', 'doctor.user'],
            order: { testDate: 'DESC' },
        });
        res.json(testResults);
    }
    catch (error) {
        console.error('Get patient test results error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getPatientTestResults = getPatientTestResults;
const getDoctorTestResults = async (req, res) => {
    try {
        const user = req.user;
        const doctorRepository = database_1.AppDataSource.getRepository(Doctor_1.Doctor);
        const doctor = await doctorRepository.findOne({
            where: { user: { id: user.id } },
        });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }
        const testResultRepository = database_1.AppDataSource.getRepository(TestResult_1.TestResult);
        const testResults = await testResultRepository.find({
            where: { doctor: { id: doctor.id } },
            relations: ['patient', 'doctor', 'doctor.user'],
            order: { testDate: 'DESC' },
        });
        res.json(testResults);
    }
    catch (error) {
        console.error('Get doctor test results error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getDoctorTestResults = getDoctorTestResults;
const createTestResult = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = req.user;
        const { patientId, testType, testDate, status, description, results, notes } = req.body;
        // Get doctor profile
        const doctorRepository = database_1.AppDataSource.getRepository(Doctor_1.Doctor);
        const doctor = await doctorRepository.findOne({
            where: { user: { id: user.id } },
        });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }
        // Get patient
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const patient = await userRepository.findOne({
            where: { id: patientId },
        });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        // Create test result
        const testResultRepository = database_1.AppDataSource.getRepository(TestResult_1.TestResult);
        const testResult = testResultRepository.create({
            patient,
            doctor,
            testType: testType,
            testDate: new Date(testDate),
            status: status,
            description,
            results,
            notes,
        });
        await testResultRepository.save(testResult);
        res.status(201).json({
            message: 'Test result created successfully',
            testResult,
        });
    }
    catch (error) {
        console.error('Create test result error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createTestResult = createTestResult;
const updateTestResult = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = req.user;
        const { testType, testDate, status, description, results, notes } = req.body;
        const testResultRepository = database_1.AppDataSource.getRepository(TestResult_1.TestResult);
        const testResult = await testResultRepository.findOne({
            where: { id: req.params.id },
            relations: ['doctor', 'doctor.user'],
        });
        if (!testResult) {
            return res.status(404).json({ message: 'Test result not found' });
        }
        // Check if user has permission to update this test result
        const isAdmin = user.role === User_1.UserRole.ADMIN;
        const isAssignedDoctor = user.role === User_1.UserRole.DOCTOR && testResult.doctor.user.id === user.id;
        if (!isAdmin && !isAssignedDoctor) {
            return res.status(403).json({ message: 'Access denied' });
        }
        // Update test result
        if (testType)
            testResult.testType = testType;
        if (testDate)
            testResult.testDate = new Date(testDate);
        if (status)
            testResult.status = status;
        if (description)
            testResult.description = description;
        if (results)
            testResult.results = results;
        if (notes)
            testResult.notes = notes;
        await testResultRepository.save(testResult);
        res.json({
            message: 'Test result updated successfully',
            testResult,
        });
    }
    catch (error) {
        console.error('Update test result error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateTestResult = updateTestResult;
const deleteTestResult = async (req, res) => {
    try {
        const testResultRepository = database_1.AppDataSource.getRepository(TestResult_1.TestResult);
        const testResult = await testResultRepository.findOne({
            where: { id: req.params.id },
        });
        if (!testResult) {
            return res.status(404).json({ message: 'Test result not found' });
        }
        await testResultRepository.remove(testResult);
        res.json({ message: 'Test result deleted successfully' });
    }
    catch (error) {
        console.error('Delete test result error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteTestResult = deleteTestResult;
