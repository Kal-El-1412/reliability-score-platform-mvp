import { Router } from 'express';
import { RiskController } from './risk.controller';

const router = Router();
const riskController = new RiskController();

router.get('/profile/:userId', riskController.getRiskProfile);
router.post('/flag', riskController.flagUser);

export default router;
