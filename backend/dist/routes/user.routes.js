"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_middleware_1 = require("../middleware/auth.middleware");
const User_1 = require("../models/User");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
// Get own profile
router.get('/profile', auth_middleware_1.authenticate, user_controller_1.getProfile);
// Update own profile
router.put('/profile', auth_middleware_1.authenticate, [
    (0, express_validator_1.body)('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
    (0, express_validator_1.body)('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
    (0, express_validator_1.body)('phone').optional().notEmpty().withMessage('Phone number cannot be empty'),
    (0, express_validator_1.body)('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
], user_controller_1.updateProfile);
// Admin routes
router.get('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(User_1.UserRole.ADMIN), user_controller_1.getAllUsers);
router.get('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(User_1.UserRole.ADMIN), user_controller_1.getUserById);
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(User_1.UserRole.ADMIN), user_controller_1.deleteUser);
exports.default = router;
