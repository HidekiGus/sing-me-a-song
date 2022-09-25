import { Request, Response } from 'express';
import * as testService from '../services/testService.js';

export async function resetDatabase(req: Request, res: Response) {
  await testService.resetDatabase();
  res.sendStatus(201);
}

export async function addRecommendation(req: Request, res: Response) {
  await testService.addRecommendation();
  res.sendStatus(201);
}
