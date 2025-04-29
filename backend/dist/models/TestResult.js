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
exports.TestResult = exports.TestStatus = exports.TestType = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const User_1 = require("./User");
const Doctor_1 = require("./Doctor");
var TestType;
(function (TestType) {
    TestType["BLOOD_TEST"] = "BLOOD_TEST";
    TestType["URINE_TEST"] = "URINE_TEST";
    TestType["X_RAY"] = "X_RAY";
    TestType["MRI"] = "MRI";
    TestType["CT_SCAN"] = "CT_SCAN";
    TestType["ULTRASOUND"] = "ULTRASOUND";
    TestType["ECG"] = "ECG";
    TestType["EEG"] = "EEG";
    TestType["ALLERGY_TEST"] = "ALLERGY_TEST";
    TestType["COVID_TEST"] = "COVID_TEST";
})(TestType || (exports.TestType = TestType = {}));
var TestStatus;
(function (TestStatus) {
    TestStatus["PENDING"] = "PENDING";
    TestStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TestStatus["COMPLETED"] = "COMPLETED";
    TestStatus["CANCELLED"] = "CANCELLED";
})(TestStatus || (exports.TestStatus = TestStatus = {}));
let TestResult = class TestResult {
};
exports.TestResult = TestResult;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TestResult.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.testResults, { nullable: false }),
    __metadata("design:type", User_1.User)
], TestResult.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Doctor_1.Doctor, (doctor) => doctor.testResults, { nullable: false }),
    __metadata("design:type", Doctor_1.Doctor)
], TestResult.prototype, "doctor", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TestType,
    }),
    (0, class_validator_1.IsEnum)(TestType),
    __metadata("design:type", String)
], TestResult.prototype, "testType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], TestResult.prototype, "testDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TestStatus,
        default: TestStatus.PENDING,
    }),
    (0, class_validator_1.IsEnum)(TestStatus),
    __metadata("design:type", String)
], TestResult.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestResult.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TestResult.prototype, "results", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TestResult.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TestResult.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TestResult.prototype, "updatedAt", void 0);
exports.TestResult = TestResult = __decorate([
    (0, typeorm_1.Entity)('test_results')
], TestResult);
