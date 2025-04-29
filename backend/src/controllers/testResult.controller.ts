import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { TestResult } from '../models/TestResult';

export const getMyResults = async (req: Request, res: Response) => {
  try {
    if (!req.user || !('userId' in req.user)) return res.status(401).json({ message: 'Unauthorized' });
    const testResultRepository = AppDataSource.getRepository(TestResult);
    const results = await testResultRepository.find({
      where: { patient: { id: req.user.userId } },
      relations: ['patient'],
      order: { createdAt: 'DESC' }
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get test results', error });
  }
};

export const getResultById = async (req: Request, res: Response) => {
  try {
    if (!req.user || !('userId' in req.user)) return res.status(401).json({ message: 'Unauthorized' });
    const testResultRepository = AppDataSource.getRepository(TestResult);
    const result = await testResultRepository.findOne({
      where: { id: req.params.id, patient: { id: req.user.userId } },
      relations: ['patient']
    });
    if (!result) return res.status(404).json({ message: 'Test result not found' });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get test result', error });
  }
};