import express from 'express';
import cors from 'cors';
import path from 'path';
import authRouter from './routes/auth.routes';
import appointmentsRouter from './routes/appointment.routes';
import doctorRouter from './routes/doctor.routes';
import userRouter from './routes/user.routes';
import testResultRouter from './routes/testResult.routes';
import timeSlotRouter from './routes/timeSlot.routes';
import appointmentRouter from './routes/appointment.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/doctors', doctorRouter);
app.use('/api/profile', userRouter);
app.use('/api/test-results', testResultRouter);
app.use('/api/time-slots', timeSlotRouter);
app.use('/api/appointment', appointmentRouter);

export default app;