"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAppointment = exports.updateAppointment = exports.createAppointment = exports.getDoctorAppointments = exports.getPatientAppointments = exports.getAppointmentById = exports.getAllAppointments = void 0;
const express_validator_1 = require("express-validator");
const database_1 = require("../config/database");
const Appointment_1 = require("../models/Appointment");
const Doctor_1 = require("../models/Doctor");
const User_1 = require("../models/User");
const getAllAppointments = async (req, res) => {
    try {
        const appointmentRepository = database_1.AppDataSource.getRepository(Appointment_1.Appointment);
        const appointments = await appointmentRepository.find({
            relations: ['patient', 'doctor', 'doctor.user'],
            order: { appointmentDate: 'DESC' },
        });
        res.json(appointments);
    }
    catch (error) {
        console.error('Get all appointments error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllAppointments = getAllAppointments;
const getAppointmentById = async (req, res) => {
    try {
        const appointmentRepository = database_1.AppDataSource.getRepository(Appointment_1.Appointment);
        const appointment = await appointmentRepository.findOne({
            where: { id: req.params.id },
            relations: ['patient', 'doctor', 'doctor.user'],
        });
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        // Check if user has permission to view this appointment
        const user = req.user;
        const isAdmin = user.role === User_1.UserRole.ADMIN;
        const isAssignedDoctor = user.role === User_1.UserRole.DOCTOR && appointment.doctor.user.id === user.id;
        if (!isAdmin && !isAssignedDoctor) {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.json(appointment);
    }
    catch (error) {
        console.error('Get appointment by ID error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAppointmentById = getAppointmentById;
const getPatientAppointments = async (req, res) => {
    try {
        const user = req.user;
        const appointmentRepository = database_1.AppDataSource.getRepository(Appointment_1.Appointment);
        const appointments = await appointmentRepository.find({
            where: { patient: { id: user.id } },
            relations: ['patient', 'doctor', 'doctor.user'],
            order: { appointmentDate: 'DESC' },
        });
        res.json(appointments);
    }
    catch (error) {
        console.error('Get patient appointments error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getPatientAppointments = getPatientAppointments;
const getDoctorAppointments = async (req, res) => {
    try {
        const user = req.user;
        const doctorRepository = database_1.AppDataSource.getRepository(Doctor_1.Doctor);
        const doctor = await doctorRepository.findOne({
            where: { user: { id: user.id } },
        });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }
        const appointmentRepository = database_1.AppDataSource.getRepository(Appointment_1.Appointment);
        const appointments = await appointmentRepository.find({
            where: { doctor: { id: doctor.id } },
            relations: ['patient', 'doctor', 'doctor.user'],
            order: { appointmentDate: 'DESC' },
        });
        res.json(appointments);
    }
    catch (error) {
        console.error('Get doctor appointments error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getDoctorAppointments = getDoctorAppointments;
const createAppointment = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = req.user;
        const { doctorId, appointmentDate, notes } = req.body;
        // Check if doctor exists
        const doctorRepository = database_1.AppDataSource.getRepository(Doctor_1.Doctor);
        const doctor = await doctorRepository.findOne({
            where: { id: doctorId },
            relations: ['user'],
        });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        // Create appointment
        const appointmentRepository = database_1.AppDataSource.getRepository(Appointment_1.Appointment);
        const appointment = appointmentRepository.create({
            patient: user,
            doctor,
            appointmentDate: new Date(appointmentDate),
            status: Appointment_1.AppointmentStatus.PENDING,
            notes,
        });
        await appointmentRepository.save(appointment);
        res.status(201).json({
            message: 'Appointment created successfully',
            appointment,
        });
    }
    catch (error) {
        console.error('Create appointment error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createAppointment = createAppointment;
const updateAppointment = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = req.user;
        const { status, notes } = req.body;
        const appointmentRepository = database_1.AppDataSource.getRepository(Appointment_1.Appointment);
        const appointment = await appointmentRepository.findOne({
            where: { id: req.params.id },
            relations: ['doctor', 'doctor.user'],
        });
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        // Check if user has permission to update this appointment
        const isAdmin = user.role === User_1.UserRole.ADMIN;
        const isAssignedDoctor = user.role === User_1.UserRole.DOCTOR && appointment.doctor.user.id === user.id;
        if (!isAdmin && !isAssignedDoctor) {
            return res.status(403).json({ message: 'Access denied' });
        }
        // Update appointment
        if (status)
            appointment.status = status;
        if (notes)
            appointment.notes = notes;
        await appointmentRepository.save(appointment);
        res.json({
            message: 'Appointment updated successfully',
            appointment,
        });
    }
    catch (error) {
        console.error('Update appointment error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateAppointment = updateAppointment;
const deleteAppointment = async (req, res) => {
    try {
        const appointmentRepository = database_1.AppDataSource.getRepository(Appointment_1.Appointment);
        const appointment = await appointmentRepository.findOne({
            where: { id: req.params.id },
        });
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        await appointmentRepository.remove(appointment);
        res.json({ message: 'Appointment deleted successfully' });
    }
    catch (error) {
        console.error('Delete appointment error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteAppointment = deleteAppointment;
