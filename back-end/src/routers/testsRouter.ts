import { Router } from 'express';
import * as testController from '../controllers/testController.js';

const testsRouter = Router();

testsRouter.post('/reset-database', testController.resetDatabase);

export default testsRouter;
