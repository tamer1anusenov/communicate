"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.post('/register', [
    (0, express_validator_1.body)('firstName').notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lastName').notEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email'),
    (0, express_validator_1.body)('inn')
        .isLength({ min: 12, max: 12 })
        .withMessage('INN must be 12 digits')
        .matches(/^\d+$/)
        .withMessage('INN must contain only numbers'),
    (0, express_validator_1.body)('phone').notEmpty().withMessage('Phone number is required'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('role').optional().isIn(['patient', 'doctor']).withMessage('Invalid role'),
], auth_controller_1.register);
router.post('/login', [
    (0, express_validator_1.body)('identifier').notEmpty().withMessage('Email or INN is required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
], auth_controller_1.login);
exports.default = router;
