import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    if (!req.user || !('userId' in req.user)) return res.status(401).json({ message: 'Unauthorized' });
    const user = await userRepository.findOne({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get profile', error });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    if (!req.user || !('userId' in req.user)) return res.status(401).json({ message: 'Unauthorized' });
    const user = await userRepository.findOne({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    await userRepository.save(user);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    if (!req.user || !('userId' in req.user)) return res.status(401).json({ message: 'Unauthorized' });
    const user = await userRepository.findOne({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });
    user.password = await bcrypt.hash(req.body.newPassword, 10);
    await userRepository.save(user);
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to change password', error });
  }
};