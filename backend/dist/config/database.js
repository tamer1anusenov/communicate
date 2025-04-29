"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("../models/User");
const Doctor_1 = require("../models/Doctor");
const Appointment_1 = require("../models/Appointment");
const TestResult_1 = require("../models/TestResult");
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.NODE_ENV === 'development', // Set to false in production
    logging: process.env.NODE_ENV === 'development',
    entities: [User_1.User, Doctor_1.Doctor, Appointment_1.Appointment, TestResult_1.TestResult],
    migrations: [],
    subscribers: [],
});
