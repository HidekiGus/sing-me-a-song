import { Router } from 'express';
import * as testController from '../controllers/testController.js';

const testsRouter = Router();

testsRouter.post('/reset-database', testController.resetDatabase);
testsRouter.post('/add-recommendation', testController.addRecommendation);

export default testsRouter;
