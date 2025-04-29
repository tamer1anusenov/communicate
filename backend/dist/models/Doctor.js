"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Doctor = exports.Specialization = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const User_1 = require("./User");
const Appointment_1 = require("./Appointment");
const TestResult_1 = require("./TestResult");
var Specialization;
(function (Specialization) {
    Specialization["THERAPIST"] = "THERAPIST";
    Specialization["CARDIOLOGIST"] = "CARDIOLOGIST";
    Specialization["NEUROLOGIST"] = "NEUROLOGIST";
    Specialization["PEDIATRICIAN"] = "PEDIATRICIAN";
    Specialization["SURGEON"] = "SURGEON";
    Specialization["DENTIST"] = "DENTIST";
    Specialization["OPHTHALMOLOGIST"] = "OPHTHALMOLOGIST";
    Specialization["DERMATOLOGIST"] = "DERMATOLOGIST";
    Specialization["PSYCHIATRIST"] = "PSYCHIATRIST";
    Specialization["ENDOCRINOLOGIST"] = "ENDOCRINOLOGIST";
})(Specialization || (exports.Specialization = Specialization = {}));
let Doctor = class Doctor {
};
exports.Doctor = Doctor;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Doctor.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.doctorProfile, { nullable: false }),
    __metadata("design:type", User_1.User)
], Doctor.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: Specialization,
    }),
    (0, class_validator_1.IsEnum)(Specialization),
    __metadata("design:type", String)
], Doctor.prototype, "specialization", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(10, 500),
    __metadata("design:type", String)
], Doctor.prototype, "education", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(10, 500),
    __metadata("design:type", String)
], Doctor.prototype, "experience", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(10, 1000),
    __metadata("design:type", String)
], Doctor.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Appointment_1.Appointment, (appointment) => appointment.doctor),
    __metadata("design:type", Array)
], Doctor.prototype, "appointments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => TestResult_1.TestResult, (testResult) => testResult.doctor),
    __metadata("design:type", Array)
], Doctor.prototype, "testResults", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Doctor.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Doctor.prototype, "updatedAt", void 0);
exports.Doctor = Doctor = __decorate([
    (0, typeorm_1.Entity)('doctors')
], Doctor);
