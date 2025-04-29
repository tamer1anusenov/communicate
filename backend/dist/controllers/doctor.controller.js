"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDoctor = exports.updateDoctor = exports.createDoctor = exports.getDoctorById = exports.getAllDoctors = void 0;
const express_validator_1 = require("express-validator");
const database_1 = require("../config/database");
const Doctor_1 = require("../models/Doctor");
const User_1 = require("../models/User");
const getAllDoctors = async (req, res) => {
    try {
        const doctorRepository = database_1.AppDataSource.getRepository(Doctor_1.Doctor);
        const doctors = await doctorRepository.find({
            relations: ['user'],
        });
        res.json(doctors.map((doctor) => ({
            id: doctor.id,
            user: {
                id: doctor.user.id,
                firstName: doctor.user.firstName,
                lastName: doctor.user.lastName,
                email: doctor.user.email,
                phone: doctor.user.phone,
            },
            specialization: doctor.specialization,
            education: doctor.education,
            experience: doctor.experience,
            description: doctor.description,
        })));
    }
    catch (error) {
        console.error('Get all doctors error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllDoctors = getAllDoctors;
const getDoctorById = async (req, res) => {
    try {
        const doctorRepository = database_1.AppDataSource.getRepository(Doctor_1.Doctor);
        const doctor = await doctorRepository.findOne({
            where: { id: req.params.id },
            relations: ['user'],
        });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json({
            id: doctor.id,
            user: {
                id: doctor.user.id,
                firstName: doctor.user.firstName,
                lastName: doctor.user.lastName,
                email: doctor.user.email,
                phone: doctor.user.phone,
            },
            specialization: doctor.specialization,
            education: doctor.education,
            experience: doctor.experience,
            description: doctor.description,
        });
    }
    catch (error) {
        console.error('Get doctor by ID error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getDoctorById = getDoctorById;
const createDoctor = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const doctorRepository = database_1.AppDataSource.getRepository(Doctor_1.Doctor);
        // Check if user exists and is not already a doctor
        const user = await userRepository.findOne({
            where: { id: req.body.userId },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role === User_1.UserRole.DOCTOR) {
            return res.status(400).json({ message: 'User is already a doctor' });
        }
        // Update user role to doctor
        user.role = User_1.UserRole.DOCTOR;
        await userRepository.save(user);
        // Create doctor profile
        const doctor = doctorRepository.create({
            user,
            specialization: req.body.specialization,
            education: req.body.education,
            experience: req.body.experience,
            description: req.body.description,
        });
        await doctorRepository.save(doctor);
        res.status(201).json({
            message: 'Doctor profile created successfully',
            doctor: {
                id: doctor.id,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                },
                specialization: doctor.specialization,
                education: doctor.education,
                experience: doctor.experience,
                description: doctor.description,
            },
        });
    }
    catch (error) {
        console.error('Create doctor error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createDoctor = createDoctor;
const updateDoctor = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const doctorRepository = database_1.AppDataSource.getRepository(Doctor_1.Doctor);
        const doctor = await doctorRepository.findOne({
            where: { id: req.params.id },
            relations: ['user'],
        });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        // Update doctor fields
        if (req.body.specialization)
            doctor.specialization = req.body.specialization;
        if (req.body.education)
            doctor.education = req.body.education;
        if (req.body.experience)
            doctor.experience = req.body.experience;
        if (req.body.description)
            doctor.description = req.body.description;
        await doctorRepository.save(doctor);
        res.json({
            message: 'Doctor profile updated successfully',
            doctor: {
                id: doctor.id,
                user: {
                    id: doctor.user.id,
                    firstName: doctor.user.firstName,
                    lastName: doctor.user.lastName,
                    email: doctor.user.email,
                    phone: doctor.user.phone,
                },
                specialization: doctor.specialization,
                education: doctor.education,
                experience: doctor.experience,
                description: doctor.description,
            },
        });
    }
    catch (error) {
        console.error('Update doctor error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateDoctor = updateDoctor;
const deleteDoctor = async (req, res) => {
    try {
        const doctorRepository = database_1.AppDataSource.getRepository(Doctor_1.Doctor);
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const doctor = await doctorRepository.findOne({
            where: { id: req.params.id },
            relations: ['user'],
        });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        // Update user role back to patient
        const user = doctor.user;
        user.role = User_1.UserRole.PATIENT;
        await userRepository.save(user);
        // Remove doctor profile
        await doctorRepository.remove(doctor);
        res.json({ message: 'Doctor profile deleted successfully' });
    }
    catch (error) {
        console.error('Delete doctor error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteDoctor = deleteDoctor;
