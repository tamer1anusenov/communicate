"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const User_1 = require("../models/User");
const register = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        // Check if user already exists
        const existingUser = await userRepository.findOne({
            where: [{ email: req.body.email }, { inn: req.body.inn }],
        });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: 'User with this email or INN already exists' });
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(req.body.password, 10);
        // Create new user
        const user = userRepository.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            inn: req.body.inn,
            phone: req.body.phone,
            password: hashedPassword,
            role: req.body.role || User_1.UserRole.PATIENT,
        });
        await userRepository.save(user);
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({
            message: 'User registered successfully',
            token,
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
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { identifier, password } = req.body;
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        // Find user by email or INN
        const user = await userRepository.findOne({
            where: [{ email: identifier }, { inn: identifier }],
        });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Check password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({
            message: 'Login successful',
            token,
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
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.login = login;
