import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, inn, phone, password, role = 'PATIENT' } = req.body;

    // Check if user with this email or INN already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { inn }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or INN already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user based on role
    if (role === 'PATIENT') {
      // Create new user with patient role
      const newUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          inn,
          phone,
          password: hashedPassword,
          role: UserRole.PATIENT,
        }
      });

      // Instead of using patientProfile relation, create the Patient record directly
      await prisma.$executeRaw`INSERT INTO "Patient" ("id", "userId", "address", "createdAt", "updatedAt") VALUES (gen_random_uuid(), ${newUser.id}, ${req.body.address || ''}, NOW(), NOW())`;

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser.id, role: newUser.role },
        process.env.JWT_SECRET || 'your_jwt_secret_key_here',
        { expiresIn: '24h' }
      );

      return res.status(201).json({
        message: 'Patient registered successfully',
        token,
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.role
        }
      });
    } else if (role === 'DOCTOR') {
      // Validate doctor-specific fields
      const { specialization, education, experience, description } = req.body;
      if (!specialization) {
        return res.status(400).json({ message: 'Specialization is required for doctor registration' });
      }

      // Create new user with doctor role
      const newUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          inn,
          phone,
          password: hashedPassword,
          role: UserRole.DOCTOR,
        }
      });
      
      // Create doctor profile with raw SQL
      await prisma.$executeRaw`INSERT INTO "Doctor" ("id", "userId", "specialization", "education", "experience", "description", "createdAt", "updatedAt") VALUES (gen_random_uuid(), ${newUser.id}, ${specialization}, ${education || ''}, ${experience || ''}, ${description || ''}, NOW(), NOW())`;

      // Get doctor profile ID for response
      const doctorProfile = await prisma.$queryRaw`SELECT "id", "specialization" FROM "Doctor" WHERE "userId" = ${newUser.id} LIMIT 1` as {id: string, specialization: string}[];

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser.id, role: newUser.role },
        process.env.JWT_SECRET || 'your_jwt_secret_key_here',
        { expiresIn: '24h' }
      );

      return res.status(201).json({
        message: 'Doctor registered successfully',
        token,
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.role,
          doctorId: doctorProfile[0]?.id,
          specialization: doctorProfile[0]?.specialization
        }
      });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { identifier, password, passcode } = req.body;
    
    // Admin login using passcode
    if (passcode) {
      // Admin authentication logic would go here
      // For now, returning an error as admin auth isn't fully implemented
      return res.status(401).json({ message: 'Admin authentication not implemented yet' });
    }

    // Regular login with email or INN as identifier
    if (!identifier) {
      return res.status(400).json({ message: 'Email or INN is required' });
    }

    // Find user by email or INN
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { inn: identifier }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '24h' }
    );

    // Prepare user response based on role
    const userResponse: any = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    };

    // Add role-specific data using raw queries instead of model access
    if (user.role === UserRole.DOCTOR) {
      const doctorProfiles = await prisma.$queryRaw`SELECT "id", "specialization" FROM "Doctor" WHERE "userId" = ${user.id} LIMIT 1` as {id: string, specialization: string}[];
      if (doctorProfiles.length > 0) {
        userResponse.doctorId = doctorProfiles[0].id;
        userResponse.specialization = doctorProfiles[0].specialization;
      }
    } else if (user.role === UserRole.PATIENT) {
      const patientProfiles = await prisma.$queryRaw`SELECT "id" FROM "Patient" WHERE "userId" = ${user.id} LIMIT 1` as {id: string}[];
      if (patientProfiles.length > 0) {
        userResponse.patientId = patientProfiles[0].id;
      }
    }

    return res.status(200).json({
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
