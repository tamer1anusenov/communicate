"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUserById = exports.getAllUsers = exports.updateProfile = exports.getProfile = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../config/database");
const User_1 = require("../models/User");
const getProfile = async (req, res) => {
    try {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({
            where: { id: req.user?.id },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            inn: user.inn,
            phone: user.phone,
            role: user.role,
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({
            where: { id: req.user?.id },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Update user fields
        if (req.body.firstName)
            user.firstName = req.body.firstName;
        if (req.body.lastName)
            user.lastName = req.body.lastName;
        if (req.body.phone)
            user.phone = req.body.phone;
        if (req.body.password) {
            user.password = await bcryptjs_1.default.hash(req.body.password, 10);
        }
        await userRepository.save(user);
        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                inn: user.inn,
                phone: user.phone,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateProfile = updateProfile;
const getAllUsers = async (req, res) => {
    try {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const users = await userRepository.find();
        res.json(users.map((user) => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            inn: user.inn,
            phone: user.phone,
            role: user.role,
        })));
    }
    catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    try {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({
            where: { id: req.params.id },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            inn: user.inn,
            phone: user.phone,
            role: user.role,
        });
    }
    catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getUserById = getUserById;
const deleteUser = async (req, res) => {
    try {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({
            where: { id: req.params.id },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await userRepository.remove(user);
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteUser = deleteUser;
