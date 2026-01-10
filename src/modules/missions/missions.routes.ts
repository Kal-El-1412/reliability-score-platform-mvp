import { Router } from 'express';
import { MissionsController } from './missions.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { completeMissionSchema } from './missions.validation';

const router = Router();
const missionsController = new MissionsController();

router.get('/active', authenticate, missionsController.getActiveMissions);
router.post('/complete', authenticate, validate(completeMissionSchema), missionsController.completeMission);

export default router;
