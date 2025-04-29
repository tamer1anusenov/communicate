"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const doctor_routes_1 = __importDefault(require("./routes/doctor.routes"));
const appointment_routes_1 = __importDefault(require("./routes/appointment.routes"));
const testResult_routes_1 = __importDefault(require("./routes/testResult.routes"));
// Load environment variables
dotenv_1.default.config();
// Create Express app
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/doctors', doctor_routes_1.default);
app.use('/api/appointments', appointment_routes_1.default);
app.use('/api/test-results', testResult_routes_1.default);
// Default route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Keremet Medical Center API' });
});
// Initialize database connection
database_1.AppDataSource.initialize()
    .then(() => {
    console.log('Database connection initialized');
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error('Error during database initialization:', error);
});
